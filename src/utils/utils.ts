import { isBuffer, isBlob, isFile } from "./is"
import { RequestParams } from "../types/params.t"
import { RequestHeaders } from "../types/base.t"
import { MultiInternalOptions } from "../types/options.t"

export function objectName(name: string) {
  return name.replace(/^\/+/, "")
}

/**
 * Get file size
 */
export function _getFileSize(file: Buffer | Blob | File): number {
  if (isBuffer(file)) {
    return file.length
  } else if (isBlob(file) || isFile(file)) {
    return file.size
  }

  throw new Error("_getFileSize requires Buffer/File/Blob.")
}

export function _convertMetaToHeaders(
  meta: PureObject,
  headers: PureObject
): void {
  if (!meta) {
    return
  }

  Object.keys(meta).forEach(k => {
    headers[`x-oss-meta-${k}`] = meta[k]
  })
}

export function _objectRequestParams(
  method: requestMethod,
  name: string,
  options: MultiInternalOptions,
  bucket: string
): RequestParams {
  name = objectName(name)
  const params: RequestParams = {
    object: name,
    bucket,
    method,
    subres: options.subres,
    timeout: options.timeout,
  }

  if (options.headers) {
    params.headers = {}
    Object.assign(params.headers, options.headers)
  }
  return params
}

export function getHeader(headers: RequestHeaders, name: string) {
  return headers[name] || headers[name.toLowerCase()]
}
