import { createGallery } from '@/modules/virtual-gallery'
import type { GalleryOptions, GalleryInstance } from '@/types/gallery'

export function useThreeGallery(options: GalleryOptions): GalleryInstance {
  return createGallery(options)
}
