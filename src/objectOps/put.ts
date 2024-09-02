import { PutOptions, MultiInternalOptions } from "../types/options.t"
import { objectName, _getFileSize } from "../utils/utils"
import { isBuffer, isBlob, isFile } from "../utils/is"
import { extname } from "../utils/path"
import mime from "mime"
import { _createStream } from "../utils/stream"
import { _putStream } from "./putStream"
import OSS from ".."

/**
 * put an object from String(file path)/Buffer/ReadableStream
 * @param {String} name the object key
 * @param {Mixed} file {String|Buffer|ReadStream|File(only support Browser)|Blob(only support Browser)} object local path, content buffer or ReadStream content instance use in Node, Blob and html5 File
 * @param {Object} options
 *        {Object} options.callback The callback parameter is composed of a JSON string encoded in Base64
 *        {String} options.callback.url  the OSS sends a callback request to this URL
 *        {String} options.callback.host  The host header value for initiating callback requests
 *        {String} options.callback.body  The value of the request body when a callback is initiated
 *        {String} options.callback.contentType  The Content-Type of the callback requests initiatiated
 *        {Object} options.callback.customValue  Custom parameters are a map of key-values, e.g:
 *                  customValue = {
 *                    key1: 'value1',
 *                    key2: 'value2'
 *                  }
 * @return {Object}
 */
export async function _put(
  this: OSS,
  name: string,
  file: Buffer | File | Blob,
  options: MultiInternalOptions
) {
  let content: Buffer
  name = objectName(name)
  if (isBuffer(file)) {
    content = file
  } else if (isBlob(file) || isFile(file)) {
    if (!options.mime) {
      if (isFile(file)) {
        options.mime = mime.getType(extname(file.name)) || undefined
      } else {
        options.mime = file.type
      }
    }

    const stream = _createStream(file, 0, file.size)
    options.contentLength = _getFileSize(file)
    try {
      const result = await _putStream.call(this, name, stream, options)
      return result
    } catch (err) {
      if (err.code === "RequestTimeTooSkewed") {
        this.options.amendTimeSkewed = +new Date(err.serverTime) - +new Date()
        return await _put.call(this, name, file, options)
      }
    }
  } else {
    throw new TypeError("Must provide Buffer/Blob for put.")
  }

  options.headers = options.headers || {}
  this._convertMetaToHeaders(options.meta, options.headers)

  const method = options.method || "PUT"
  const params = this._objectRequestParams(method, name, options)
  callback.encodeCallback(params, options)
  params.mime = options.mime
  params.content = content
  params.successStatuses = [200]

  const result = await this.request(params)

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

export async function put(
  this: OSS,
  name: string,
  file: Buffer | File | Blob,
  options: PutOptions = {}
) {
  return _put.call(this, name, file, options)
}
