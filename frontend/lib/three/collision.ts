import * as THREE from "three";

export class Capsule {
  start: THREE.Vector3;
  end: THREE.Vector3;
  radius: number;

  constructor(start: THREE.Vector3, end: THREE.Vector3, radius: number) {
    this.start = start;
    this.end = end;
    this.radius = radius;
  }

  setPosition(position: THREE.Vector3) {
    const height = this.start.distanceTo(this.end);
    const direction = new THREE.Vector3()
      .subVectors(this.end, this.start)
      .normalize();
    const halfHeight = height / 2;

    this.start.copy(position).addScaledVector(direction, -halfHeight);
    this.end.copy(position).addScaledVector(direction, halfHeight);
  }
}

class OctreeNode {
  bounds: THREE.Box3;
  children: OctreeNode[] = [];
  objects: THREE.Object3D[] = [];
  depth: number;
  maxDepth: number;
  maxObjects: number;

  constructor(
    bounds: THREE.Box3,
    depth: number = 0,
    maxDepth: number = 8,
    maxObjects: number = 8,
  ) {
    this.bounds = bounds;
    this.depth = depth;
    this.maxDepth = maxDepth;
    this.maxObjects = maxObjects;
  }

  insert(object: THREE.Object3D): boolean {
    if (!this.bounds.intersectsBox(new THREE.Box3().setFromObject(object))) {
      return false;
    }

    if (this.children.length > 0) {
      for (const child of this.children) {
        if (child.insert(object)) {
          return true;
        }
      }
      return false;
    }

    this.objects.push(object);

    if (this.objects.length > this.maxObjects && this.depth < this.maxDepth) {
      this.subdivide();
    }

    return true;
  }

  subdivide() {
    const { min, max } = this.bounds;
    const size = new THREE.Vector3().subVectors(max, min).multiplyScalar(0.5);

    for (let x = 0; x < 2; x++) {
      for (let y = 0; y < 2; y++) {
        for (let z = 0; z < 2; z++) {
          const newMin = new THREE.Vector3(
            min.x + x * size.x,
            min.y + y * size.y,
            min.z + z * size.z,
          );
          const newMax = new THREE.Vector3(
            newMin.x + size.x,
            newMin.y + size.y,
            newMin.z + size.z,
          );
          const child = new OctreeNode(
            new THREE.Box3(newMin, newMax),
            this.depth + 1,
            this.maxDepth,
            this.maxObjects,
          );

          for (const obj of this.objects) {
            child.insert(obj);
          }

          this.children.push(child);
        }
      }
    }

    this.objects = [];
  }

  query(capsule: Capsule): THREE.Object3D[] {
    const results: THREE.Object3D[] = [];

    if (!this.intersectsCapsule(capsule)) {
      return results;
    }

    if (this.children.length > 0) {
      for (const child of this.children) {
        results.push(...child.query(capsule));
      }
    } else {
      results.push(...this.objects);
    }

    return results;
  }

  intersectsCapsule(capsule: Capsule): boolean {
    const capsuleBox = new THREE.Box3();
    capsuleBox.expandByPoint(capsule.start);
    capsuleBox.expandByPoint(capsule.end);
    capsuleBox.min.subScalar(capsule.radius);
    capsuleBox.max.addScalar(capsule.radius);

    return this.bounds.intersectsBox(capsuleBox);
  }
}

export class Octree {
  root: OctreeNode;
  bounds: THREE.Box3;

  constructor(
    bounds: THREE.Box3,
    maxDepth: number = 8,
    maxObjects: number = 8,
  ) {
    this.bounds = bounds;
    this.root = new OctreeNode(bounds, 0, maxDepth, maxObjects);
  }

  add(object: THREE.Object3D) {
    this.root.insert(object);
  }

  query(capsule: Capsule): THREE.Object3D[] {
    return this.root.query(capsule);
  }

  static capsuleIntersectsTriangle(
    capsule: Capsule,
    triangle: THREE.Triangle,
  ): boolean {
    const { start, end, radius } = capsule;
    const closestPoint = new THREE.Vector3();

    triangle.closestPointToPoint(start, closestPoint);
    let minDist = start.distanceTo(closestPoint);

    triangle.closestPointToPoint(end, closestPoint);
    minDist = Math.min(minDist, end.distanceTo(closestPoint));

    const direction = new THREE.Vector3().subVectors(end, start);
    const length = direction.length();
    direction.normalize();

    for (let i = 0; i <= 10; i++) {
      const t = i / 10;
      const point = new THREE.Vector3()
        .copy(start)
        .addScaledVector(direction, t * length);
      triangle.closestPointToPoint(point, closestPoint);
      minDist = Math.min(minDist, point.distanceTo(closestPoint));
    }

    return minDist < radius;
  }

  static capsuleIntersectsBox(capsule: Capsule, box: THREE.Box3): boolean {
    const { start, end, radius } = capsule;

    const expandedBox = box.clone();
    expandedBox.min.subScalar(radius);
    expandedBox.max.addScalar(radius);

    if (expandedBox.containsPoint(start) || expandedBox.containsPoint(end)) {
      return true;
    }

    const midPoint = new THREE.Vector3()
      .addVectors(start, end)
      .multiplyScalar(0.5);
    if (expandedBox.containsPoint(midPoint)) {
      return true;
    }

    return false;
  }

  checkCollision(capsule: Capsule): boolean {
    const potentialCollisions = this.query(capsule);

    for (const object of potentialCollisions) {
      const box = new THREE.Box3().setFromObject(object);

      if (Octree.capsuleIntersectsBox(capsule, box)) {
        return true;
      }
    }

    return false;
  }
}

export function createPlayerCapsule(
  position: THREE.Vector3,
  height: number = 1.8,
  radius: number = 0.3,
): Capsule {
  const halfHeight = height / 2;
  const start = new THREE.Vector3(
    position.x,
    position.y - halfHeight + radius,
    position.z,
  );
  const end = new THREE.Vector3(
    position.x,
    position.y + halfHeight - radius,
    position.z,
  );
  return new Capsule(start, end, radius);
}
