<template>
  <div>
    <Navbar />
    <div class="virtual-gallery-container">
      <div ref="canvasContainer" class="canvas-container"></div>
      <div class="gallery-controls">
        <div class="control-panel">
          <h5>控制面板</h5>
          <div class="control-item">
            <label>移动速度</label>
            <el-slider v-model="moveSpeed" :min="0.1" :max="2" :step="0.1" />
            <span>{{ moveSpeed }}</span>
          </div>
          <div class="control-item">
            <label>鼠标灵敏度</label>
            <el-slider v-model="mouseSensitivity" :min="0.1" :max="1" :step="0.1" />
            <span>{{ mouseSensitivity }}</span>
          </div>
          <div class="control-item">
            <el-button type="primary" size="small" @click="resetCamera">
              <el-icon><RefreshLeft /></el-icon> 重置视角
            </el-button>
          </div>
          <div class="control-item">
            <el-button type="success" size="small" @click="toggleAutoRotate">
              <el-icon><Refresh /></el-icon> {{ autoRotate ? '停止旋转' : '自动旋转' }}
            </el-button>
          </div>
        </div>
        <div class="instructions">
          <h6>操作说明</h6>
          <p><el-icon><Mouse /></el-icon> 鼠标移动：旋转视角</p>
          <p><el-icon><Key /></el-icon> W/A/S/D：前后左右移动</p>
          <p><el-icon><Top /></el-icon> 空格/Shift：上升/下降</p>
          <p><el-icon><Pointer /></el-icon> 点击画框：查看详情</p>
        </div>
      </div>
      <div class="exit-button">
        <router-link to="/gallery">
          <el-button type="danger">
            <el-icon><Back /></el-icon> 返回画廊
          </el-button>
        </router-link>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted, onBeforeUnmount } from 'vue'
import { useRouter } from 'vue-router'
import * as THREE from 'three'
import Navbar from '@/components/Navbar.vue'
import artworkApi from '@/api/artwork'

const router = useRouter()
const canvasContainer = ref(null)

let scene, camera, renderer, controls
let moveSpeed = ref(0.5)
let mouseSensitivity = ref(0.3)
let autoRotate = ref(false)
let artworks = []
let raycaster, mouse
let isPointerLocked = false

const keys = {
  forward: false,
  backward: false,
  left: false,
  right: false,
  up: false,
  down: false
}

const velocity = new THREE.Vector3()
const direction = new THREE.Vector3()

const artworkImages = ref([])

onMounted(async () => {
  await loadArtworks()
  initThreeJS()
  createGallery()
  setupEventListeners()
  animate()
})

async function loadArtworks() {
  try {
    const response = await artworkApi.getArtworks({ page: 0, pageSize: 20 })
    const artworksData = response.data || []
    artworkImages.value = artworksData.map(artwork => ({
      id: artwork.id,
      title: artwork.title,
      artist: artwork.artist,
      category: artwork.category,
      imageUrl: artwork.imageUrl
    }))
    console.log('Loaded artworks:', artworkImages.value)
  } catch (error) {
    console.error('获取艺术作品失败:', error)
    artworkImages.value = [
      { id: 1, title: '艺术作品 1', artist: '艺术家 1', category: '油画', imageUrl: 'https://images.unsplash.com/photo-1541961017774-22349e4a1262?w=800&h=1000&fit=crop' },
      { id: 2, title: '艺术作品 2', artist: '艺术家 2', category: '水彩', imageUrl: 'https://images.unsplash.com/photo-1579783902614-a3fb3927b6a5?w=800&h=1000&fit=crop' },
      { id: 3, title: '艺术作品 3', artist: '艺术家 3', category: '素描', imageUrl: 'https://images.unsplash.com/photo-1549490349-8643362247b5?w=800&h=1000&fit=crop' },
      { id: 4, title: '艺术作品 4', artist: '艺术家 4', category: '雕塑', imageUrl: 'https://images.unsplash.com/photo-1578301978693-85fa9c0320b9?w=800&h=1000&fit=crop' },
      { id: 5, title: '艺术作品 5', artist: '艺术家 5', category: '摄影', imageUrl: 'https://images.unsplash.com/photo-1580136608260-4eb11f4b64fe?w=800&h=1000&fit=crop' },
      { id: 6, title: '艺术作品 6', artist: '艺术家 6', category: '数字艺术', imageUrl: 'https://images.unsplash.com/photo-1547891654-e66ed7ebb968?w=800&h=1000&fit=crop' },
      { id: 7, title: '艺术作品 7', artist: '艺术家 7', category: '油画', imageUrl: 'https://images.unsplash.com/photo-1577720643272-265f09367456?w=800&h=1000&fit=crop' },
      { id: 8, title: '艺术作品 8', artist: '艺术家 8', category: '水彩', imageUrl: 'https://images.unsplash.com/photo-1579783483458-83d02f59ed8c?w=800&h=1000&fit=crop' }
    ]
  }
}

onBeforeUnmount(() => {
  if (renderer) {
    renderer.dispose()
  }
  document.removeEventListener('keydown', onKeyDown)
  document.removeEventListener('keyup', onKeyUp)
  document.removeEventListener('mousemove', onMouseMove)
  document.removeEventListener('click', onClick)
})

function initThreeJS() {
  const width = canvasContainer.value.clientWidth
  const height = canvasContainer.value.clientHeight

  scene = new THREE.Scene()
  scene.background = new THREE.Color(0x2a2a3e)
  scene.fog = new THREE.Fog(0x2a2a3e, 10, 50)

  camera = new THREE.PerspectiveCamera(75, width / height, 0.1, 1000)
  camera.position.set(0, 1.7, 8)

  renderer = new THREE.WebGLRenderer({ antialias: true })
  renderer.setSize(width, height)
  renderer.setPixelRatio(window.devicePixelRatio)
  renderer.shadowMap.enabled = true
  renderer.shadowMap.type = THREE.PCFSoftShadowMap
  renderer.outputColorSpace = THREE.SRGBColorSpace
  canvasContainer.value.appendChild(renderer.domElement)

  raycaster = new THREE.Raycaster()
  mouse = new THREE.Vector2()

  setupLighting()
}

function setupLighting() {
  const ambientLight = new THREE.AmbientLight(0xffffff, 0.8)
  scene.add(ambientLight)

  const mainLight = new THREE.DirectionalLight(0xffffff, 1.2)
  mainLight.position.set(5, 10, 5)
  mainLight.castShadow = true
  mainLight.shadow.mapSize.width = 2048
  mainLight.shadow.mapSize.height = 2048
  mainLight.shadow.camera.near = 0.5
  mainLight.shadow.camera.far = 50
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

function createGallery() {
  const roomWidth = 20
  const roomHeight = 5
  const roomDepth = 15

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

  const ceilingGeometry = new THREE.PlaneGeometry(roomWidth, roomDepth)
  const ceilingMaterial = new THREE.MeshStandardMaterial({ 
    color: 0x3a3a5e,
    roughness: 0.9
  })
  const ceiling = new THREE.Mesh(ceilingGeometry, ceilingMaterial)
  ceiling.rotation.x = Math.PI / 2
  ceiling.position.y = roomHeight
  scene.add(ceiling)

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

  const frontWallGeometry = new THREE.PlaneGeometry(roomWidth, roomHeight)
  const frontWall = new THREE.Mesh(frontWallGeometry, wallMaterial)
  frontWall.position.set(0, roomHeight / 2, roomDepth / 2)
  frontWall.rotation.y = Math.PI
  scene.add(frontWall)

  const leftWallGeometry = new THREE.PlaneGeometry(roomDepth, roomHeight)
  const leftWall = new THREE.Mesh(leftWallGeometry, wallMaterial)
  leftWall.position.set(-roomWidth / 2, roomHeight / 2, 0)
  leftWall.rotation.y = Math.PI / 2
  leftWall.receiveShadow = true
  scene.add(leftWall)

  const rightWallGeometry = new THREE.PlaneGeometry(roomDepth, roomHeight)
  const rightWall = new THREE.Mesh(rightWallGeometry, wallMaterial)
  rightWall.position.set(roomWidth / 2, roomHeight / 2, 0)
  rightWall.rotation.y = -Math.PI / 2
  rightWall.receiveShadow = true
  scene.add(rightWall)

  addArtworks()
  addDecorations()
}

function addArtworks() {
  const textureLoader = new THREE.TextureLoader()
  const frameGeometry = new THREE.BoxGeometry(3, 4, 0.15)
  const frameMaterial = new THREE.MeshStandardMaterial({ 
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

  const images = artworkImages.value || []

  positions.forEach((pos, index) => {
    const artwork = images[index % images.length] || { 
      id: index + 1, 
      title: `艺术作品 ${index + 1}`,
      artist: '未知艺术家',
      category: '未分类',
      imageUrl: 'https://via.placeholder.com/400x500?text=No+Image'
    }

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
    artworks.push(frame)

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
}

function addDecorations() {
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
}

function setupEventListeners() {
  canvasContainer.value.addEventListener('click', () => {
    canvasContainer.value.requestPointerLock()
  })

  document.addEventListener('pointerlockchange', () => {
    isPointerLocked = document.pointerLockElement === canvasContainer.value
  })

  document.addEventListener('keydown', onKeyDown)
  document.addEventListener('keyup', onKeyUp)
  document.addEventListener('mousemove', onMouseMove)
  document.addEventListener('click', onClick)

  window.addEventListener('resize', onWindowResize)
}

function onKeyDown(event) {
  switch (event.code) {
    case 'KeyW':
    case 'ArrowUp':
      keys.forward = true
      break
    case 'KeyS':
    case 'ArrowDown':
      keys.backward = true
      break
    case 'KeyA':
    case 'ArrowLeft':
      keys.left = true
      break
    case 'KeyD':
    case 'ArrowRight':
      keys.right = true
      break
    case 'Space':
      keys.up = true
      break
    case 'ShiftLeft':
    case 'ShiftRight':
      keys.down = true
      break
  }
}

function onKeyUp(event) {
  switch (event.code) {
    case 'KeyW':
    case 'ArrowUp':
      keys.forward = false
      break
    case 'KeyS':
    case 'ArrowDown':
      keys.backward = false
      break
    case 'KeyA':
    case 'ArrowLeft':
      keys.left = false
      break
    case 'KeyD':
    case 'ArrowRight':
      keys.right = false
      break
    case 'Space':
      keys.up = false
      break
    case 'ShiftLeft':
    case 'ShiftRight':
      keys.down = false
      break
  }
}

function onMouseMove(event) {
  if (!isPointerLocked) return

  const movementX = event.movementX || 0
  const movementY = event.movementY || 0

  camera.rotation.y -= movementX * 0.002 * mouseSensitivity.value
  camera.rotation.x -= movementY * 0.002 * mouseSensitivity.value
  camera.rotation.x = Math.max(-Math.PI / 2, Math.min(Math.PI / 2, camera.rotation.x))
}

function onClick(event) {
  if (!isPointerLocked) return

  mouse.x = (event.clientX / window.innerWidth) * 2 - 1
  mouse.y = -(event.clientY / window.innerHeight) * 2 + 1

  raycaster.setFromCamera(mouse, camera)
  const intersects = raycaster.intersectObjects(artworks)

  if (intersects.length > 0) {
    const artwork = intersects[0].object
    if (artwork.userData.type === 'artwork') {
      document.exitPointerLock()
      router.push(`/artwork/${artwork.userData.id}`)
    }
  }
}

function onWindowResize() {
  const width = canvasContainer.value.clientWidth
  const height = canvasContainer.value.clientHeight

  camera.aspect = width / height
  camera.updateProjectionMatrix()
  renderer.setSize(width, height)
}

function resetCamera() {
  camera.position.set(0, 1.7, 8)
  camera.rotation.set(0, 0, 0)
}

function toggleAutoRotate() {
  autoRotate.value = !autoRotate.value
}

function animate() {
  requestAnimationFrame(animate)

  const speed = moveSpeed.value * 0.1

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

  camera.position.addScaledVector(forward, -velocity.z)
  camera.position.addScaledVector(right, -velocity.x)
  camera.position.y += velocity.y

  camera.position.y = Math.max(0.5, Math.min(4.5, camera.position.y))
  camera.position.x = Math.max(-9, Math.min(9, camera.position.x))
  camera.position.z = Math.max(-7, Math.min(7, camera.position.z))

  if (autoRotate.value) {
    camera.rotation.y += 0.003
  }

  renderer.render(scene, camera)
}
</script>

<style scoped>
.virtual-gallery-container {
  position: relative;
  width: 100%;
  height: calc(100vh - 56px);
  overflow: hidden;
}

.canvas-container {
  width: 100%;
  height: 100%;
}

.gallery-controls {
  position: absolute;
  top: 20px;
  right: 20px;
  background: rgba(0, 0, 0, 0.8);
  padding: 20px;
  border-radius: 10px;
  color: white;
  max-width: 250px;
  z-index: 100;
}

.control-panel h5 {
  margin-bottom: 15px;
  color: #ffd700;
}

.control-item {
  margin-bottom: 15px;
}

.control-item label {
  display: block;
  margin-bottom: 5px;
  font-size: 14px;
}

.control-item input[type="range"] {
  width: 100%;
  margin-bottom: 5px;
}

.control-item span {
  font-size: 12px;
  color: #aaa;
}

.control-item button {
  width: 100%;
  margin-top: 5px;
}

.control-item .el-button {
  width: 100%;
}

.instructions {
  margin-top: 20px;
  padding-top: 15px;
  border-top: 1px solid #444;
}

.instructions h6 {
  margin-bottom: 10px;
  color: #ffd700;
}

.instructions p {
  margin: 8px 0;
  font-size: 13px;
  color: #ccc;
}

.instructions i {
  margin-right: 8px;
}

.exit-button {
  position: absolute;
  top: 20px;
  left: 20px;
  z-index: 100;
}

.exit-button a {
  text-decoration: none;
}
</style>
