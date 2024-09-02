import buffer from "buffer"

export function isBuffer(buf: unknown): buf is Buffer {
  return buffer.Buffer.isBuffer(buf)
}

export function isBlob(cont: unknown): cont is Blob {
  return typeof Blob !== "undefined" && cont instanceof Blob
}

export function isFile(cont: unknown): cont is File {
  return typeof File !== "undefined" && cont instanceof File
}

export function isString(cont: unknown): cont is string {
  return typeof cont === "string"
}
