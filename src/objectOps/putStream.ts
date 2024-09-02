import { WebFileReadStream } from "../utils/stream"
import { PutStreamOptions, MultiInternalOptions } from "../types/options.t"
import {
  objectName,
  _convertMetaToHeaders,
  _objectRequestParams,
} from "../utils/utils"
import OSS from ".."
import { encodeCallback } from "../utils/options"
import { RequestParams } from "../types/params.t"
import {_request} from "../core/request"

/**
 * put an object from ReadableStream. If `options.contentLength` is
 * not provided, chunked encoding is used.
 * @param {String} name the object key
 * @param {Readable} stream the ReadableStream
 * @param {Object} options
 * @return {Object}
 */
export async function _putStream(
  this: OSS,
  name: string,
  stream: WebFileReadStream,
  options: MultiInternalOptions = {}
) {
  options.headers = options.headers || {}
  name = objectName(name)

  if (options.contentLength) {
    options.headers["Content-Length"] = options.contentLength
  } else {
    options.headers["Transfer-Encoding"] = "chunked"
  }
  options.meta && _convertMetaToHeaders(options.meta, options.headers)

  const method: requestMethod = options.method || "PUT"
  const params: RequestParams = _objectRequestParams(method, name, options, this.options.bucket)
  encodeCallback(params, options)
  params.mime = options.mime
  params.stream = stream
  params.successStatuses = [200]

  const result = await _request.call(this, params)

  const ret = {
    name,
    url: this._objectUrl(name),
    res: result.res,
  }

  if (params.headers && params.headers["x-oss-callback"]) {
    ret.data = JSON.parse(result.data.toString())
  }

  return ret
}

export async function putStream(
  this: OSS,
  name: string,
  stream: WebFileReadStream,
  options: PutStreamOptions = {}
) {
  return _putStream.call(this, name, stream, options)
}
