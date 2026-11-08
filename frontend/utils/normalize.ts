import { parseCommaSeparated } from "./tags";

export function normalizeTaggable<T extends { tags?: string[] }>(
  entity: T,
): Omit<T, "tags"> & { tags: string[] } {
  return {
    ...entity,
    tags: parseCommaSeparated(entity.tags),
  };
}
