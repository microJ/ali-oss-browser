import { AppendOptions, MultiInternalOptions } from "../types/options.t"
import { _put } from "./put"
import OSS from ".."

/**
 * append an object from Buffer
 * @param {String} name the object key
 * @param {Mixed} file Buffer
 * @param {Object} options
 * @return {Object}
 */
export async function append(
  this: OSS,
  name: string,
  file: Buffer,
  options: AppendOptions = {}
) {
  return _append.call(this, name, file, options as MultiInternalOptions)
}

export async function _append(
  this: OSS,
  name: string,
  file: Buffer,
  options: MultiInternalOptions
) {
  if (options.position === undefined) options.position = "0"
  options.subres = {
    append: "",
    position: options.position,
  }
  options.method = "POST"

  const result = await _put.call(this, name, file, options)
  result.nextAppendPosition = result.res.headers["x-oss-next-append-position"]
  return result
}
