import { _checkBucketName } from "./check"
import urlutil from "url"
import { Buffer } from "buffer"
import {
  InitialOptions,
  InternalOptions,
  MultiInternalOptions,
  AliOSSRegion,
  OptionsCallback,
} from "../types/options.t"
import { RequestParams } from "../types/params.t"

export function initOptions(options: InitialOptions): InternalOptions {
  if (!options.stsToken) {
    console.warn(
      "Please use STS Token for safety, see more details at https://help.aliyun.com/document_detail/32077.html"
    )
  }

  if (!options.accessKeyId || !options.accessKeySecret) {
    throw new Error("require accessKeyId, accessKeySecret")
  }

  options.bucket && _checkBucketName(options.bucket)

  return _initOptions(options)
}

function _initOptions(options: InitialOptions): InternalOptions {
  const opts: InternalOptions = Object.assign(
    {
      region: "oss-cn-hangzhou",
      internal: false,
      timeout: 60000,
      bucket: null,
      endpoint: null,
      cname: false,
      isRequestPay: false,
      sldEnable: false,
      secure: isHttpsWebProtocol(),
      useFetch: false,
      cancelFlag: false,
      amendTimeSkewed: 0,
    },
    options
  )

  opts.accessKeyId = opts.accessKeyId.trim()
  opts.accessKeySecret = opts.accessKeySecret.trim()

  if (opts.endpoint) {
    opts.endpoint = setEndpoint(opts.endpoint, opts.secure)
  } else if (opts.region) {
    opts.endpoint = setRegion(opts.region, opts.internal, opts.secure)
  } else {
    throw new Error("require options.endpoint or options.region")
  }

  opts.inited = true
  return opts
}

/**
 *
 * @param endpoint for example: oss-cn-hangzhou.aliyuncs.com
 * @param secure use HTTPS
 */
function setEndpoint(endpoint: string, secure: boolean): string {
  let url = urlutil.parse(endpoint)

  if (!url.protocol) {
    url = urlutil.parse(`http${secure ? "s" : ""}://${endpoint}`)
  }

  if (url.protocol !== "http:" && url.protocol !== "https:") {
    throw new Error("Endpoint protocol must be http or https.")
  }

  return urlutil.format(url)
}

function setRegion(region: AliOSSRegion, internal: boolean, secure: boolean) {
  const protocol = secure ? "https://" : "http://"
  let suffix = internal ? "-internal.aliyuncs.com" : ".aliyuncs.com"
  const prefix = "vpc100-oss-cn-"
  // aliyun VPC region: https://help.aliyun.com/knowledge_detail/38740.html
  if (region.substr(0, prefix.length) === prefix) {
    suffix = ".aliyuncs.com"
  }

  return urlutil.format(urlutil.parse(protocol + region + suffix))
}

// check local web protocol,if https secure default set true , if http secure default set false
function isHttpsWebProtocol(): boolean {
  // for web worker not use window.location.
  // eslint-disable-next-line no-restricted-globals
  return !!(location && location.protocol === "https:")
}

/**
 * deal callback in RequestParams
 * @param reqParams
 * @param options
 */
export function encodeCallback(
  reqParams: RequestParams,
  options: MultiInternalOptions
) {
  reqParams.headers = reqParams.headers || {}
  if (
    !Object.prototype.hasOwnProperty.call(
      reqParams.headers,
      "x-oss-callback"
    ) &&
    options.callback
  ) {
    const json: {
      callbackUrl: string
      callbackBody: string
      callbackHost?: string
      callbackBodyType?: string
    } = {
      callbackUrl: encodeURI(options.callback.url),
      callbackBody: options.callback.body,
    }
    if (options.callback.host) {
      json.callbackHost = options.callback.host
    }
    if (options.callback.contentType) {
      json.callbackBodyType = options.callback.contentType
    }
    const callback: string = Buffer.from(JSON.stringify(json)).toString(
      "base64"
    )
    reqParams.headers["x-oss-callback"] = callback

    if (options.callback.customValue) {
      const callbackVar: PureObject = {}
      const opsCb: OptionsCallback = options.callback
      Object.keys(opsCb.customValue).forEach(key => {
        callbackVar[`x:${key}`] = opsCb.customValue[key]
      })
      reqParams.headers["x-oss-callback-var"] = Buffer.from(
        JSON.stringify(callbackVar)
      ).toString("base64")
    }
  }
}
