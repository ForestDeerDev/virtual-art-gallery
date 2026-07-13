import type { GalleryOptions, GalleryInstance, GalleryConfig } from '@/types/gallery'
import * as THREE from 'three'
import { Octree, createPlayerCapsule, type Capsule } from '@/utils/collision'

export function useThreeGallery(options: GalleryOptions): GalleryInstance {
  const { container, artworks, getControls, config = {}, onArtworkClick, onLoadingStart, onLoadingProgress, onLoadingComplete } = options
  
  // 核心对象
  let scene: THREE.Scene | null = null
  let camera: THREE.PerspectiveCamera | null = null
  let renderer: THREE.WebGLRenderer | null = null
  let raycaster: THREE.Raycaster | null = null
  let mouse: THREE.Vector2 | null = null
  let artworkMeshes: THREE.Mesh[] = []
  let animationId: number | null = null
  let mounted = false // 防重复挂载
  let octree: Octree | null = null // 八叉树碰撞世界
  let playerCapsule: Capsule | null = null // 玩家胶囊体
  
  // 配置参数
  const roomWidth = config.roomWidth ?? 20
  const roomHeight = config.roomHeight ?? 5
  const roomDepth = config.roomDepth ?? 15
  const cameraHeight = config.cameraHeight ?? 1.7
  const fogNear = config.fogNear ?? 10
  const fogFar = config.fogFar ?? 50
  
  // 内部状态
  const keys = { forward: false, backward: false, left: false, right: false, up: false, down: false }
  const velocity = new THREE.Vector3()
  const direction = new THREE.Vector3()
  let isPointerLocked = false
  
  // 初始化场景
  const initScene = () => {
    const width = container.clientWidth
    const height = container.clientHeight

    scene = new THREE.Scene()
    scene.background = new THREE.Color(0x2a2a3e)
    scene.fog = new THREE.Fog(0x2a2a3e, fogNear, fogFar)

    camera = new THREE.PerspectiveCamera(75, width / height, 0.1, 1000)
    camera.position.set(0, cameraHeight, 8)

    renderer = new THREE.WebGLRenderer({ antialias: true })
    renderer.setSize(width, height)
    renderer.setPixelRatio(window.devicePixelRatio)
    renderer.shadowMap.enabled = true
    renderer.shadowMap.type = THREE.PCFSoftShadowMap
    renderer.outputColorSpace = THREE.SRGBColorSpace
    container.appendChild(renderer.domElement)

    raycaster = new THREE.Raycaster()
    mouse = new THREE.Vector2()

    // 初始化八叉树碰撞世界
    const bounds = new THREE.Box3(
      new THREE.Vector3(-roomWidth / 2, 0, -roomDepth / 2),
      new THREE.Vector3(roomWidth / 2, roomHeight, roomDepth / 2)
    )
    octree = new Octree(bounds, 8, 8)

    // 初始化玩家胶囊体
    playerCapsule = createPlayerCapsule(camera.position.clone(), 1.8, 0.3)
  }
  
  // 设置灯光
  const setupLighting = () => {
    if (!scene) return
    
    const ambientLight = new THREE.AmbientLight(0xffffff, 0.8)
    scene.add(ambientLight)

    const mainLight = new THREE.DirectionalLight(0xffffff, 1.2)
    mainLight.position.set(5, 10, 5)
    mainLight.castShadow = true
    mainLight.shadow.mapSize.width = 2048
    mainLight.shadow.mapSize.height = 2048
    scene.add(mainLight)

    const spotLight1 = new THREE.SpotLight(0xffd700, 2)
    spotLight1.position.set(-8, 5, 0)
    spotLight1.angle = Math.PI / 6
    spotLight1.penumbra = 0.3
    spotLight1.castShadow = true
    scene.add(spotLight1)

    const spotLight2 = new THREE.SpotLight(0xffd700, 2)
    spotLight2.position.set(8, 5, 0)
    spotLight2.angle = Math.PI / 6
    spotLight2.penumbra = 0.3
    spotLight2.castShadow = true
    scene.add(spotLight2)

    const pointLight = new THREE.PointLight(0xffffff, 1, 30)
    pointLight.position.set(0, 3, 0)
    scene.add(pointLight)
  }
  
  // 创建房间
  const createRoom = () => {
    if (!scene || !octree) return

    const floorGeometry = new THREE.PlaneGeometry(roomWidth, roomDepth)
    const floorMaterial = new THREE.MeshStandardMaterial({ 
      color: 0x4a4a6a,
      roughness: 0.8,
      metalness: 0.2
    })
    const floor = new THREE.Mesh(floorGeometry, floorMaterial)
    floor.rotation.x = -Math.PI / 2
    floor.receiveShadow = true
    scene.add(floor)
    octree.add(floor)

    const ceilingGeometry = new THREE.PlaneGeometry(roomWidth, roomDepth)
    const ceilingMaterial = new THREE.MeshStandardMaterial({ 
      color: 0x3a3a5e,
      roughness: 0.9
    })
    const ceiling = new THREE.Mesh(ceilingGeometry, ceilingMaterial)
    ceiling.rotation.x = Math.PI / 2
    ceiling.position.y = roomHeight
    scene.add(ceiling)
    octree.add(ceiling)

    const wallMaterial = new THREE.MeshStandardMaterial({ 
      color: 0x5a5a7a,
      roughness: 0.7,
      metalness: 0.1
    })

    const backWallGeometry = new THREE.PlaneGeometry(roomWidth, roomHeight)
    const backWall = new THREE.Mesh(backWallGeometry, wallMaterial)
    backWall.position.set(0, roomHeight / 2, -roomDepth / 2)
    backWall.receiveShadow = true
    scene.add(backWall)
    octree.add(backWall)

    const frontWallGeometry = new THREE.PlaneGeometry(roomWidth, roomHeight)
    const frontWall = new THREE.Mesh(frontWallGeometry, wallMaterial)
    frontWall.position.set(0, roomHeight / 2, roomDepth / 2)
    frontWall.rotation.y = Math.PI
    scene.add(frontWall)
    octree.add(frontWall)

    const leftWallGeometry = new THREE.PlaneGeometry(roomDepth, roomHeight)
    const leftWall = new THREE.Mesh(leftWallGeometry, wallMaterial)
    leftWall.position.set(-roomWidth / 2, roomHeight / 2, 0)
    leftWall.rotation.y = Math.PI / 2
    leftWall.receiveShadow = true
    scene.add(leftWall)
    octree.add(leftWall)

    const rightWallGeometry = new THREE.PlaneGeometry(roomDepth, roomHeight)
    const rightWall = new THREE.Mesh(rightWallGeometry, wallMaterial)
    rightWall.position.set(roomWidth / 2, roomHeight / 2, 0)
    rightWall.rotation.y = -Math.PI / 2
    rightWall.receiveShadow = true
    scene.add(rightWall)
    octree.add(rightWall)
  }
  
  // 添加艺术品
  const addArtworks = () => {
    if (!scene || !raycaster) return
    
    // 创建 LoadingManager 管理图片加载
    const loadingManager = new THREE.LoadingManager()
    
    loadingManager.onStart = () => {
      onLoadingStart?.()
    }
    
    loadingManager.onProgress = (url: string, itemsLoaded: number, itemsTotal: number) => {
      const progress = (itemsLoaded / itemsTotal) * 100
      onLoadingProgress?.(progress)
    }
    
    loadingManager.onLoad = () => {
      onLoadingComplete?.()
    }
    
    loadingManager.onError = (url: string) => {
      console.error('Error loading:', url)
    }
    
    const textureLoader = new THREE.TextureLoader(loadingManager)
    const baseFrameGeometry = new THREE.BoxGeometry(3, 4, 0.15)
    const baseFrameMaterial = new THREE.MeshStandardMaterial({ 
      color: 0x8b4513,
      roughness: 0.6,
      metalness: 0.3
    })

    const positions = [
      { x: -6, y: 2.5, z: -7.4, rotationY: 0 },
      { x: 0, y: 2.5, z: -7.4, rotationY: 0 },
      { x: 6, y: 2.5, z: -7.4, rotationY: 0 },
      { x: -9.9, y: 2.5, z: -3, rotationY: Math.PI / 2 },
      { x: -9.9, y: 2.5, z: 3, rotationY: Math.PI / 2 },
      { x: 9.9, y: 2.5, z: -3, rotationY: -Math.PI / 2 },
      { x: 9.9, y: 2.5, z: 3, rotationY: -Math.PI / 2 },
      { x: -6, y: 2.5, z: 7.4, rotationY: Math.PI },
      { x: 0, y: 2.5, z: 7.4, rotationY: Math.PI },
      { x: 6, y: 2.5, z: 7.4, rotationY: Math.PI }
    ]

    positions.forEach((pos, index) => {
      const artwork = artworks.length === 0 ? {
        id: index + 1,
        title: `艺术作品 ${index + 1}`,
        artist: '未知艺术家',
        category: '未分类',
        imageUrl: 'https://via.placeholder.com/400x500?text=No+Image'
      } : artworks[index % artworks.length]

      // 为每个 mesh clone geometry 和 material，避免重复 dispose
      const frameGeometry = baseFrameGeometry.clone()
      const frameMaterial = baseFrameMaterial.clone()
      const frame = new THREE.Mesh(frameGeometry, frameMaterial)
      frame.position.set(pos.x, pos.y, pos.z)
      frame.rotation.y = pos.rotationY
      frame.castShadow = true
      frame.userData = { 
        type: 'artwork', 
        id: artwork.id,
        title: artwork.title,
        artist: artwork.artist,
        category: artwork.category,
        imageUrl: artwork.imageUrl
      }
      scene.add(frame)
      artworkMeshes.push(frame)

      const canvasGeometry = new THREE.PlaneGeometry(2.6, 3.6)
      const texture = textureLoader.load(
        artwork.imageUrl,
        undefined,
        undefined,
        (err) => {
          console.error('Texture loading error:', err)
        }
      )
      texture.colorSpace = THREE.SRGBColorSpace
      
      const canvasMaterial = new THREE.MeshStandardMaterial({ 
        map: texture,
        roughness: 0.3,
        metalness: 0.1,
        side: THREE.DoubleSide
      })
      const canvas = new THREE.Mesh(canvasGeometry, canvasMaterial)
      canvas.position.set(0, 0, 0.08)
      frame.add(canvas)

      const spotlight = new THREE.SpotLight(0xffffff, 1.5)
      spotlight.position.set(0, 3, 2)
      spotlight.angle = Math.PI / 8
      spotlight.penumbra = 0.5
      spotlight.distance = 10
      spotlight.target = canvas
      frame.add(spotlight)
    })
    
    // 清理基础几何体和材质
    baseFrameGeometry.dispose()
    baseFrameMaterial.dispose()
  }
  
  // 添加装饰
  const addDecorations = () => {
    if (!scene) return
    
    const pedestalGeometry = new THREE.CylinderGeometry(0.3, 0.4, 1, 32)
    const pedestalMaterial = new THREE.MeshStandardMaterial({ 
      color: 0x6a6a8a,
      roughness: 0.5,
      metalness: 0.3
    })

    const pedestalPositions = [
      { x: -3, z: 0 },
      { x: 3, z: 0 },
      { x: 0, z: -3 },
      { x: 0, z: 3 }
    ]

    pedestalPositions.forEach(pos => {
      const pedestal = new THREE.Mesh(pedestalGeometry, pedestalMaterial)
      pedestal.position.set(pos.x, 0.5, pos.z)
      pedestal.castShadow = true
      pedestal.receiveShadow = true
      scene.add(pedestal)
      if (octree) octree.add(pedestal)

      const sculptureGeometry = new THREE.IcosahedronGeometry(0.3, 0)
      const sculptureMaterial = new THREE.MeshStandardMaterial({ 
        color: 0xffd700,
        roughness: 0.2,
        metalness: 0.8
      })
      const sculpture = new THREE.Mesh(sculptureGeometry, sculptureMaterial)
      sculpture.position.set(pos.x, 1.3, pos.z)
      sculpture.castShadow = true
      scene.add(sculpture)
      if (octree) octree.add(sculpture)
    })

    const benchGeometry = new THREE.BoxGeometry(4, 0.4, 1)
    const benchMaterial = new THREE.MeshStandardMaterial({ 
      color: 0x7c7c9a,
      roughness: 0.6
    })
    const bench = new THREE.Mesh(benchGeometry, benchMaterial)
    bench.position.set(0, 0.2, -4)
    bench.castShadow = true
    bench.receiveShadow = true
    scene.add(bench)
    if (octree) octree.add(bench)
  }
  
  // 设置控制
  const setupControls = () => {
    // 点击容器请求指针锁定
    container.addEventListener('click', () => {
      if (!isPointerLocked) {
        container.requestPointerLock()
      }
    })

    document.addEventListener('pointerlockchange', () => {
      isPointerLocked = document.pointerLockElement === container
    })

    document.addEventListener('keydown', onKeyDown)
    document.addEventListener('keyup', onKeyUp)
    document.addEventListener('mousemove', onMouseMove)
    // 使用 mousedown 代替 click 来选择画框，避免与 pointerlock 冲突
    document.addEventListener('mousedown', onClick)
  }
  
  const onKeyDown = (event: KeyboardEvent) => {
    switch (event.code) {
      case 'KeyW': case 'ArrowUp': keys.forward = true; break
      case 'KeyS': case 'ArrowDown': keys.backward = true; break
      case 'KeyA': case 'ArrowLeft': keys.left = true; break
      case 'KeyD': case 'ArrowRight': keys.right = true; break
      case 'Space': keys.up = true; break
      case 'ShiftLeft': case 'ShiftRight': keys.down = true; break
    }
  }

  const onKeyUp = (event: KeyboardEvent) => {
    switch (event.code) {
      case 'KeyW': case 'ArrowUp': keys.forward = false; break
      case 'KeyS': case 'ArrowDown': keys.backward = false; break
      case 'KeyA': case 'ArrowLeft': keys.left = false; break
      case 'KeyD': case 'ArrowRight': keys.right = false; break
      case 'Space': keys.up = false; break
      case 'ShiftLeft': case 'ShiftRight': keys.down = false; break
    }
  }

  const onMouseMove = (event: MouseEvent) => {
    if (!isPointerLocked || !camera) return

    const movementX = event.movementX || 0
    const movementY = event.movementY || 0
    const controlsState = getControls()

    camera.rotation.y -= movementX * 0.002 * controlsState.mouseSensitivity
    camera.rotation.x -= movementY * 0.002 * controlsState.mouseSensitivity
    camera.rotation.x = Math.max(-Math.PI / 2, Math.min(Math.PI / 2, camera.rotation.x))
  }

  const onClick = (event: MouseEvent) => {
    if (!isPointerLocked || !raycaster || !camera || !mouse) return

    mouse.x = (event.clientX / window.innerWidth) * 2 - 1
    mouse.y = -(event.clientY / window.innerHeight) * 2 + 1

    raycaster.setFromCamera(mouse, camera)
    const intersects = raycaster.intersectObjects(artworkMeshes)

    if (intersects.length > 0) {
      const artwork = intersects[0].object as THREE.Mesh
      if (artwork.userData.type === 'artwork') {
        document.exitPointerLock()
        onArtworkClick(artwork.userData.id)
      }
    }
  }
  
  // 动画循环
  const animate = () => {
    animationId = requestAnimationFrame(animate)
    
    if (!camera || !octree || !playerCapsule) return
    
    const controlsState = getControls()
    const speed = controlsState.moveSpeed * 0.1

    direction.z = Number(keys.forward) - Number(keys.backward)
    direction.x = Number(keys.right) - Number(keys.left)
    direction.y = Number(keys.up) - Number(keys.down)
    direction.normalize()

    if (keys.forward || keys.backward) {
      velocity.z -= direction.z * speed
    }
    if (keys.left || keys.right) {
      velocity.x -= direction.x * speed
    }
    if (keys.up || keys.down) {
      velocity.y += direction.y * speed
    }

    velocity.x *= 0.9
    velocity.y *= 0.9
    velocity.z *= 0.9

    const forward = new THREE.Vector3()
    camera.getWorldDirection(forward)
    forward.y = 0
    forward.normalize()

    const right = new THREE.Vector3()
    right.crossVectors(forward, new THREE.Vector3(0, 1, 0))

    // 计算新位置
    const newPosition = camera.position.clone()
    newPosition.addScaledVector(forward, -velocity.z)
    newPosition.addScaledVector(right, -velocity.x)
    newPosition.y += velocity.y

    // 使用 Octree + Capsule 碰撞检测
    playerCapsule.setPosition(newPosition)
    if (!octree.checkCollision(playerCapsule)) {
      camera.position.copy(newPosition)
    }

    camera.position.y = Math.max(0.5, Math.min(4.5, camera.position.y))
    camera.position.x = Math.max(-9, Math.min(9, camera.position.x))
    camera.position.z = Math.max(-7, Math.min(7, camera.position.z))

    if (controlsState.autoRotate) {
      camera.rotation.y += 0.003
    }

    if (renderer && scene) {
      renderer.render(scene, camera)
    }
  }
  
  // 重置相机
  const resetCamera = () => {
    if (!camera) return
    camera.position.set(0, cameraHeight, 8)
    camera.rotation.set(0, 0, 0)
  }
  
  // 窗口大小调整
  const onResize = () => {
    if (!camera || !renderer) return
    const width = container.clientWidth
    const height = container.clientHeight
    camera.aspect = width / height
    camera.updateProjectionMatrix()
    renderer.setSize(width, height)
  }
  
  // 彻底清理资源（包括纹理）
  const dispose = () => {
    if (animationId) {
      cancelAnimationFrame(animationId)
    }
    
    // 清理Three.js资源
    if (scene) {
      scene.traverse((object) => {
        if (object instanceof THREE.Mesh) {
          object.geometry.dispose()
          
          if (Array.isArray(object.material)) {
            object.material.forEach(material => {
              if (material.map) material.map.dispose()
              material.dispose()
            })
          } else {
            if (object.material.map) object.material.map.dispose()
            object.material.dispose()
          }
        }
      })
    }
    
    if (renderer) {
      renderer.dispose()
    }
    
    // 移除事件监听
    document.removeEventListener('keydown', onKeyDown)
    document.removeEventListener('keyup', onKeyUp)
    document.removeEventListener('mousemove', onMouseMove)
    document.removeEventListener('mousedown', onClick)
    window.removeEventListener('resize', onResize)
  }
  
  // 启动画廊（防重复）
  const mount = () => {
    if (mounted) return
    mounted = true
    
    initScene()
    setupLighting()
    createRoom()
    addArtworks()
    addDecorations()
    setupControls()
    animate()
    window.addEventListener('resize', onResize)
  }
  
  return {
    mount,
    dispose,
    resetCamera
  }
}
