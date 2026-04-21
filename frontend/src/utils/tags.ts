/**
 * Clean and normalize tags
 * @param {string|string[]} tags - Tags as string (comma-separated) or array
 * @returns {string[]} Cleaned array of tags
 */
export function cleanTags(tags: string | string[]): string[] {
  if (!tags) return []
  if (Array.isArray(tags)) {
    return tags.filter(tag => {
      return tag && tag.trim() !== '' && !/^\?+$/.test(tag)
    })
  }
  return tags.split(',').map(tag => tag.trim()).filter(tag => {
    return tag && tag !== '' && !/^\?+$/.test(tag)
  })
}
