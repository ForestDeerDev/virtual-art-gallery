function normalizeTag(tag: string): string {
  return tag.trim()
}

function isValidTag(tag: string): boolean {
  return tag !== '' && !/^\?+$/.test(tag)
}

export function parseCommaSeparated(str: string | string[] | undefined, separator = ','): string[] {
  if (str == null) return []

  const arr = Array.isArray(str) ? str : str.split(separator)

  return arr.map(normalizeTag).filter(isValidTag)
}

export function cleanTags(tags: string | string[] | undefined): string[] {
  if (tags == null) return []
  return parseCommaSeparated(tags)
}
