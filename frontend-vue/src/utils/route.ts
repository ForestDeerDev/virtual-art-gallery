/**
 * 从路由查询参数中提取字符串值
 * Vue Router 的 query 参数类型为 string | (string | null)[] | null | undefined
 * 此函数统一处理这些情况，返回标准化的字符串或 undefined
 *
 * @param value - 路由查询参数值
 * @returns 提取的字符串值，如果无法提取则返回 undefined
 */
export function getQueryString(
  value: string | (string | null)[] | null | undefined,
): string | undefined {
  if (typeof value === 'string') return value
  if (Array.isArray(value)) return value[0] ?? undefined
  return undefined
}
