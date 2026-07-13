export interface Artwork {
  id: number
  title: string
  artist: string
  category: string
  imageUrl: string
}

// 用户实时操作的状态
export interface GalleryControlState {
  moveSpeed: number
  mouseSensitivity: number
  autoRotate: boolean
}

// 初始化配置（与控制状态分离）
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
  artworks: Artwork[]
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

// API 响应类型
export interface ArtworkResponse {
  id: number
  title: string
  artist: string
  category: string
  imageUrl: string
  description?: string
  year?: number
  createdAt?: string
  updatedAt?: string
}

export interface ArtworkListResponse {
  data: ArtworkResponse[]
  page: number
  pageSize: number
  total: number
  totalPages: number
  hasPrevious: boolean
  hasNext: boolean
}

export interface ArtworkDetailResponse extends ArtworkResponse {
  videoUrl?: string
  tags?: string
  createTime?: string
  dimensions?: string
  material?: string
}
