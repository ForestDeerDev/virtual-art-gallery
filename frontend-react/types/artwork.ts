import type { PageResponse } from "./pagination";

export interface Artwork {
  id: number;
  title: string;
  artist: string;
  artistId: number;
  category: string;
  description?: string;
  imageUrl: string;
  videoUrl?: string;
  tags?: string[];
  dimensions?: string;
  material?: string;
  artworkCreateTime?: string;
  viewCount: number;
  likeCount: number;
  featured: boolean;
  enabled: boolean;
  createTime: string;
  updateTime: string;
}

export interface ArtworkCreateRequest {
  title: string;
  category: string;
  description?: string;
  imageUrl?: string;
  videoUrl?: string;
  tags?: string[];
  dimensions?: string;
  material?: string;
  featured?: boolean;
}

export interface AdminArtworkCreateRequest extends ArtworkCreateRequest {
  artist?: string;
}

export interface ArtworkUpdateRequest {
  title?: string;
  category?: string;
  description?: string;
  imageUrl?: string;
  videoUrl?: string;
  tags?: string[];
  dimensions?: string;
  material?: string;
  featured?: boolean;
  enabled?: boolean;
}

export type ArtworkListResponse = PageResponse<Artwork>;

export interface UploadResponse {
  url: string;
}

export interface Recommendation extends Artwork {
  matchingTags: string[];
  relevanceScore: string;
  randomScore?: number;
}

export interface CategoryStats {
  category: string;
  count: number;
}
