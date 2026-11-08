export interface GalleryArtwork {
  id: number;
  title: string;
  artist: string;
  category: string;
  imageUrl: string;
}

export interface GalleryControlState {
  moveSpeed: number;
  mouseSensitivity: number;
  autoRotate: boolean;
}

export interface GalleryConfig {
  roomWidth?: number;
  roomHeight?: number;
  roomDepth?: number;
  cameraHeight?: number;
  fogNear?: number;
  fogFar?: number;
}

export interface GalleryOptions {
  container: HTMLElement;
  artworks: GalleryArtwork[];
  getControls: () => GalleryControlState;
  config?: GalleryConfig;
  onArtworkClick: (id: number) => void;
  onLoadingStart?: () => void;
  onLoadingProgress?: (progress: number) => void;
  onLoadingComplete?: () => void;
}

export interface GalleryInstance {
  mount: () => void;
  dispose: () => void;
  resetCamera: () => void;
}

export interface GalleryFilterState {
  category: string;
  sortBy: string;
  tags: string;
  keyword: string;
}
