import { useQuery } from "@tanstack/react-query";
import artworkApi from "@/api/artwork";
import type { Artwork } from "@/types";

export function useCurationArtworks() {
  const query = useQuery<Artwork[]>({
    queryKey: ["artworks", "curation"],
    queryFn: async () => {
      const featuredResponse = await artworkApi.getArtworks({
        featured: true,
        page: 0,
        pageSize: 12,
      });
      if (featuredResponse.data.length > 0) {
        return featuredResponse.data;
      }
      const latestResponse = await artworkApi.getArtworks({
        page: 0,
        pageSize: 12,
      });
      return latestResponse.data;
    },
    staleTime: 5 * 60 * 1000,
  });

  return {
    artworks: query.data ?? [],
    isLoading: query.isLoading,
    isError: query.isError,
    refetch: () => query.refetch(),
  };
}
