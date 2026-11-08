import type { User } from "./user";
import type { ArtworkUpdateRequest } from "./artwork";

export interface ArtworkBatchUpdateForm {
  category?: string;
}

export interface AdminStats {
  totalUsers: number;
  totalArtworks: number;
  totalComments: number;
  totalLikes: number;
  totalViews: number;
  enabledArtworks: number;
  enabledUsers: number;
  featuredArtworks: number;
  categoryStats: Record<string, number>;
  roleStats: Record<string, number>;
}

export interface UserManagement extends User {
  artworkCount?: number;
}

export interface BatchDeleteRequest {
  ids: number[];
}

export interface BatchUpdateItem {
  id: number;
  data: ArtworkUpdateRequest;
}

export interface BatchUpdateRequest {
  updates: BatchUpdateItem[];
}
