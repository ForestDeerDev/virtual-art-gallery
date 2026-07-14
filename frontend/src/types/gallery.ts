/**
 * 简化的艺术品 - 用于 3D 画廊展示
 */
export interface GalleryArtwork {
  id: number
  title: string
  artist: string
  category: string
  imageUrl: string
}

/**
 * 用户实时操作的状态
 */
export interface GalleryControlState {
  moveSpeed: number
  mouseSensitivity: number
  autoRotate: boolean
}

/**
 * 初始化配置（与控制状态分离）
 */
export interface GalleryConfig {
  roomWidth?: number
  roomHeight?: number
  roomDepth?: number
  cameraHeight?: number
  fogNear?: number
  fogFar?: number
}

export interface GalleryOptions {
  container: HTMLElement
  artworks: GalleryArtwork[]
  getControls: () => GalleryControlState
  config?: GalleryConfig
  onArtworkClick: (id: number) => void
  onLoadingStart?: () => void
  onLoadingProgress?: (progress: number) => void
  onLoadingComplete?: () => void
}

export interface GalleryInstance {
  mount: () => void
  dispose: () => void
  resetCamera: () => void
}
