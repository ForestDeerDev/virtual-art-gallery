import request from "@/utils/request";
import type {
  Artwork,
  ArtworkListResponse,
  ArtworkCreateRequest,
  ArtworkUpdateRequest,
  UploadResponse,
  PageQuery,
  BatchDeleteRequest,
  BatchUpdateRequest,
  CategoryStats,
} from "@/types";

const artworkApi = {
  getArtworks(params: PageQuery): Promise<ArtworkListResponse> {
    return request<ArtworkListResponse>({
      url: "/artworks",
      method: "get",
      params,
    });
  },

  getArtworkById(id: number): Promise<Artwork> {
    return request<Artwork>({
      url: `/artworks/${id}`,
      method: "get",
    });
  },

  createArtwork(artworkData: ArtworkCreateRequest): Promise<Artwork> {
    return request<Artwork>({
      url: "/artworks",
      method: "post",
      data: artworkData,
    });
  },

  updateArtwork(
    id: number,
    artworkData: ArtworkUpdateRequest,
  ): Promise<Artwork> {
    return request<Artwork>({
      url: `/artworks/${id}`,
      method: "put",
      data: artworkData,
    });
  },

  deleteArtwork(id: number): Promise<void> {
    return request<void>({
      url: `/artworks/${id}`,
      method: "delete",
    });
  },

  batchDeleteArtworks(requestData: BatchDeleteRequest): Promise<void> {
    return request<void>({
      url: "/artworks/batch",
      method: "delete",
      data: requestData,
    });
  },

  batchUpdateArtworks(requestData: BatchUpdateRequest): Promise<void> {
    return request<void>({
      url: "/artworks/batch",
      method: "put",
      data: requestData,
    });
  },

  searchArtworks(
    keyword: string,
    page?: number,
    pageSize?: number,
  ): Promise<ArtworkListResponse> {
    return request<ArtworkListResponse>({
      url: "/artworks/search",
      method: "get",
      params: { keyword, page, pageSize },
    });
  },

  getRecommendations(): Promise<Artwork[]> {
    return request<Artwork[]>({
      url: "/artworks/recommendations",
      method: "get",
    });
  },

  getCategories(): Promise<string[]> {
    return request<string[]>({
      url: "/artworks/categories",
      method: "get",
    });
  },

  getCategoryStats(): Promise<CategoryStats[]> {
    return request<CategoryStats[]>({
      url: "/artworks/category-stats",
      method: "get",
    });
  },

  uploadArtworkImage(file: File): Promise<UploadResponse> {
    const formData = new FormData();
    formData.append("file", file);
    return request({
      url: "/upload/artwork",
      method: "post",
      data: formData,
    }) as Promise<UploadResponse>;
  },
};

export default artworkApi;
