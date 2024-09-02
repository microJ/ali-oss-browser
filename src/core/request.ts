import { RequestParams } from "../types/params.t"
import { RequestHeaders } from "../types/base.t"
import dateFormat from "dateformat"
import OSS from ".."
import { getHeader } from "../utils/utils"
import mime from "mime"
import { extname } from "../utils/path"
import {Buffer} from "buffer"
import jsSHA256 from "jssha/dist/sha256"

/**
 * create request params
 * See `request`
 */
export function createRequest(this: OSS, params: RequestParams) {
  const headers: RequestHeaders = {
    "x-oss-date": dateFormat(
      +new Date() + this.options.amendTimeSkewed,
      "UTC:ddd, dd mmm yyyy HH:MM:ss 'GMT'"
    ),
    "x-oss-user-agent": this.userAgent,
  }

  if (this.options.isRequestPay) {
    Object.assign(headers, { "x-oss-request-payer": "requester" })
  }

  if (this.options.stsToken) {
    headers["x-oss-security-token"] = this.options.stsToken
  }

  Object.assign(headers, params.headers)

  if (!getHeader(headers, "Content-Type")) {
    if (params.mime && params.mime.indexOf("/") > 0) {
      headers["Content-Type"] = params.mime
    } else {
      headers["Content-Type"] =
        mime.getType(params.mime || extname(params.object || "")) ||
        "application/octet-stream"
    }
  }

  if (params.content) {
    headers["Content-Md5"] = jsSHA256
      .createHash("md5")
      .update(Buffer.from(params.content, "utf8"))
      .digest("base64")
    if (!headers["Content-Length"]) {
      headers["Content-Length"] = params.content.length
    }
  }

  const authResource = this._getResource(params)
  headers.authorization = this.authorization(
    params.method,
    authResource,
    params.subres,
    headers
  )

  const url = this._getReqUrl(params)
  this.debug(
    "request %s %s, with headers %j, !!stream: %s",
    params.method,
    url,
    headers,
    !!params.stream,
    "info"
  )
  const timeout = params.timeout || this.options.timeout
  const reqParams = {
    agent: this.agent,
    method: params.method,
    content: params.content,
    stream: params.stream,
    headers,
    timeout,
    writeStream: params.writeStream,
    customResponse: params.customResponse,
    ctx: params.ctx || this.ctx,
  }

  return {
    url,
    params: reqParams,
  }
}

/**
 * request oss server
 * @param {Object} params
 *   - {String} object
 *   - {String} bucket
 *   - {Object} [headers]
 *   - {Object} [query]
 *   - {Buffer} [content]
 *   - {Stream} [stream]
 *   - {Stream} [writeStream]
 *   - {String} [mime]
 *   - {Boolean} [xmlResponse]
 *   - {Boolean} [customResponse]
 *   - {Number} [timeout]
 *   - {Object} [ctx] request context, default is `this.ctx`
 */
export async function _request(this: OSS, params: RequestParams) {
  const reqParams = createRequest.call(this, params)

  if (!this.options.useFetch) {
    reqParams.params.mode = "disable-fetch"
  }
  let result
  let reqErr
  const useStream = !!params.stream
  try {
    result = await this.urllib.request(reqParams.url, reqParams.params)
    this.debug(
      "response %s %s, got %s, headers: %j",
      params.method,
      reqParams.url,
      result.status,
      result.headers,
      "info"
    )
  } catch (err) {
    reqErr = err
  }
  let err
  if (
    result &&
    params.successStatuses &&
    params.successStatuses.indexOf(result.status) === -1
  ) {
    err = await this.requestError(result)
    // not use stream
    if (err.code === "RequestTimeTooSkewed" && !useStream) {
      this.options.amendTimeSkewed = +new Date(err.serverTime) - new Date()
      return await this.request(params)
    }
    err.params = params
  } else if (reqErr) {
    err = await this.requestError(reqErr)
  }

  if (err) {
    throw err
  }

  if (params.xmlResponse) {
    const parseData = await this.parseXML(result.data)
    result.data = parseData
  }
  return result
}
