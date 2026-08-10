import * as THREE from 'three'

// 胶囊体碰撞体
export class Capsule {
  start: THREE.Vector3
  end: THREE.Vector3
  radius: number

  constructor(start: THREE.Vector3, end: THREE.Vector3, radius: number) {
    this.start = start
    this.end = end
    this.radius = radius
  }

  // 设置胶囊体位置
  setPosition(position: THREE.Vector3) {
    const height = this.start.distanceTo(this.end)
    const direction = new THREE.Vector3().subVectors(this.end, this.start).normalize()
    const halfHeight = height / 2

    this.start.copy(position).addScaledVector(direction, -halfHeight)
    this.end.copy(position).addScaledVector(direction, halfHeight)
  }
}

// 八叉树节点
class OctreeNode {
  bounds: THREE.Box3
  children: OctreeNode[] = []
  objects: THREE.Object3D[] = []
  depth: number
  maxDepth: number
  maxObjects: number

  constructor(bounds: THREE.Box3, depth: number = 0, maxDepth: number = 8, maxObjects: number = 8) {
    this.bounds = bounds
    this.depth = depth
    this.maxDepth = maxDepth
    this.maxObjects = maxObjects
  }

  // 插入对象
  insert(object: THREE.Object3D): boolean {
    if (!this.bounds.intersectsBox(new THREE.Box3().setFromObject(object))) {
      return false
    }

    if (this.children.length > 0) {
      for (const child of this.children) {
        if (child.insert(object)) {
          return true
        }
      }
      return false
    }

    this.objects.push(object)

    if (this.objects.length > this.maxObjects && this.depth < this.maxDepth) {
      this.subdivide()
    }

    return true
  }

  // 细分节点
  subdivide() {
    const { min, max } = this.bounds
    const size = new THREE.Vector3().subVectors(max, min).multiplyScalar(0.5)

    for (let x = 0; x < 2; x++) {
      for (let y = 0; y < 2; y++) {
        for (let z = 0; z < 2; z++) {
          const newMin = new THREE.Vector3(
            min.x + x * size.x,
            min.y + y * size.y,
            min.z + z * size.z,
          )
          const newMax = new THREE.Vector3(newMin.x + size.x, newMin.y + size.y, newMin.z + size.z)
          const child = new OctreeNode(
            new THREE.Box3(newMin, newMax),
            this.depth + 1,
            this.maxDepth,
            this.maxObjects,
          )

          // 将当前节点的对象重新分配到子节点
          for (const obj of this.objects) {
            child.insert(obj)
          }

          this.children.push(child)
        }
      }
    }

    this.objects = []
  }

  // 查询可能碰撞的对象
  query(capsule: Capsule): THREE.Object3D[] {
    const results: THREE.Object3D[] = []

    if (!this.intersectsCapsule(capsule)) {
      return results
    }

    if (this.children.length > 0) {
      for (const child of this.children) {
        results.push(...child.query(capsule))
      }
    } else {
      results.push(...this.objects)
    }

    return results
  }

  // 检测与胶囊体的相交
  intersectsCapsule(capsule: Capsule): boolean {
    const capsuleBox = new THREE.Box3()
    capsuleBox.expandByPoint(capsule.start)
    capsuleBox.expandByPoint(capsule.end)
    capsuleBox.min.subScalar(capsule.radius)
    capsuleBox.max.addScalar(capsule.radius)

    return this.bounds.intersectsBox(capsuleBox)
  }
}

// 八叉树碰撞世界
export class Octree {
  root: OctreeNode
  bounds: THREE.Box3

  constructor(bounds: THREE.Box3, maxDepth: number = 8, maxObjects: number = 8) {
    this.bounds = bounds
    this.root = new OctreeNode(bounds, 0, maxDepth, maxObjects)
  }

  // 添加对象到八叉树
  add(object: THREE.Object3D) {
    this.root.insert(object)
  }

  // 查询可能碰撞的对象
  query(capsule: Capsule): THREE.Object3D[] {
    return this.root.query(capsule)
  }

  // 胶囊体与三角形的碰撞检测
  static capsuleIntersectsTriangle(capsule: Capsule, triangle: THREE.Triangle): boolean {
    const { start, end, radius } = capsule
    const closestPoint = new THREE.Vector3()

    // 找到线段上距离三角形最近的点
    triangle.closestPointToPoint(start, closestPoint)
    let minDist = start.distanceTo(closestPoint)

    triangle.closestPointToPoint(end, closestPoint)
    minDist = Math.min(minDist, end.distanceTo(closestPoint))

    // 检查线段内部点
    const direction = new THREE.Vector3().subVectors(end, start)
    const length = direction.length()
    direction.normalize()

    for (let i = 0; i <= 10; i++) {
      const t = i / 10
      const point = new THREE.Vector3().copy(start).addScaledVector(direction, t * length)
      triangle.closestPointToPoint(point, closestPoint)
      minDist = Math.min(minDist, point.distanceTo(closestPoint))
    }

    return minDist < radius
  }

  // 胶囊体与盒子的碰撞检测
  static capsuleIntersectsBox(capsule: Capsule, box: THREE.Box3): boolean {
    const { start, end, radius } = capsule

    // 扩展盒子以包含半径
    const expandedBox = box.clone()
    expandedBox.min.subScalar(radius)
    expandedBox.max.addScalar(radius)

    // 检查起点和终点是否在扩展的盒子内
    if (expandedBox.containsPoint(start) || expandedBox.containsPoint(end)) {
      return true
    }

    // 简化检测：检查线段中点
    const midPoint = new THREE.Vector3().addVectors(start, end).multiplyScalar(0.5)
    if (expandedBox.containsPoint(midPoint)) {
      return true
    }

    return false
  }

  // 完整的碰撞检测
  checkCollision(capsule: Capsule): boolean {
    const potentialCollisions = this.query(capsule)

    for (const object of potentialCollisions) {
      const box = new THREE.Box3().setFromObject(object)

      if (Octree.capsuleIntersectsBox(capsule, box)) {
        return true
      }
    }

    return false
  }
}

// 创建玩家胶囊体
export function createPlayerCapsule(
  position: THREE.Vector3,
  height: number = 1.8,
  radius: number = 0.3,
): Capsule {
  const halfHeight = height / 2
  const start = new THREE.Vector3(position.x, position.y - halfHeight + radius, position.z)
  const end = new THREE.Vector3(position.x, position.y + halfHeight - radius, position.z)
  return new Capsule(start, end, radius)
}
