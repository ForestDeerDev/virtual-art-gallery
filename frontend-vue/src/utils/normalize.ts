import { cleanTags } from './tags'

/**
 * 规范化带有 tags 字段的领域实体
 * 返回新对象，确保 tags 字段始终为清洗后的字符串数组（必选，非 undefined）
 *
 * 用于 Artwork / User 等实体的统一后处理
 */
export function normalizeTaggable<T extends { tags?: string[] }>(
  entity: T,
): Omit<T, 'tags'> & { tags: string[] } {
  return {
    ...entity,
    tags: cleanTags(entity.tags),
  }
}
