import { RequestHeaders } from "./base.t"
import { WebFileReadStream } from "../utils/stream"

export interface RequestParams {
  object: string
  bucket: string
  method: requestMethod
  subres?: {
    append: ""
    position: string
  }
  timeout?: number
  headers?: RequestHeaders

  mime?: string
  stream?: WebFileReadStream
  writeStream?: WebFileReadStream
  successStatuses?: number[]

  query?: PureObject
  content?: Buffer

  xmlResponse?: boolean
  customResponse?: boolean
}
