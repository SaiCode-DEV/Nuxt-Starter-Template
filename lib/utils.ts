/**
 * Simple object check.
 * @param item
 * @returns {boolean}
 */
export function isObject(item: any): item is Record<string, any> {
  return item && typeof item === 'object' && !Array.isArray(item)
}

/**
 * Deep merge two objects.
 * The first object (target) will be mutated.
 * @param target The target object to merge into.
 * @param ...sources Source objects to merge from.
 * @returns The mutated target object.
 */
export function mergeDeep(target: any, ...sources: any[]): any {
  if (!sources.length) return target
  const source = sources.shift()

  if (isObject(target) && isObject(source)) {
    for (const key in source) {
      if (isObject(source[key])) {
        if (!target[key] || !isObject(target[key])) {
          // Ensure target[key] is an object
          Object.assign(target, { [key]: {} })
        }
        mergeDeep(target[key], source[key])
      } else {
        Object.assign(target, { [key]: source[key] }) // This will overwrite arrays, which is fine for 'sections'
      }
    }
  }

  return mergeDeep(target, ...sources)
}
