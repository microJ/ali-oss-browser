
export function extname(path: string): string {
  if (typeof path !== "string") path = path + ""
  let startDot: number = -1
  let startPart: number = 0
  let end: number = -1
  let matchedSlash: boolean = true
  // Track the state of characters (if any) we see before our first dot and
  // after any path separator we find
  let preDotState: number = 0
  for (let i = path.length - 1; i >= 0; --i) {
    const code: number = path.charCodeAt(i)
    if (code === 47 /*/*/) {
      // If we reached a path separator that was not part of a set of path
      // separators at the end of the string, stop now
      if (!matchedSlash) {
        startPart = i + 1
        break
      }
      continue
    }
    if (end === -1) {
      // We saw the first non-path separator, mark this as the end of our
      // extension
      matchedSlash = false
      end = i + 1
    }
    if (code === 46 /*.*/) {
      // If this is our first dot, mark it as the start of our extension
      if (startDot === -1) startDot = i
      else if (preDotState !== 1) preDotState = 1
    } else if (startDot !== -1) {
      // We saw a non-dot and non-path separator before our dot, so we should
      // have a good chance at having a non-empty extension
      preDotState = -1
    }
  }

  if (
    startDot === -1 ||
    end === -1 ||
    // We saw a non-dot character immediately before the dot
    preDotState === 0 ||
    // The (right-most) trimmed path component is exactly '..'
    (preDotState === 1 && startDot === end - 1 && startDot === startPart + 1)
  ) {
    return ""
  }
  return path.slice(startDot, end)
}
