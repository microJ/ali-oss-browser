import { RequestHeaders } from "./base.t"

export type AliOSSRegion =
  | "oss-cn-hangzhou"
  | "oss-cn-shanghai"
  | "oss-cn-qingdao"
  | "oss-cn-beijing"
  | "oss-cn-zhangjiakou"
  | "oss-cn-huhehaote"
  | "oss-cn-shenzhen"
  | "oss-cn-heyuan"
  | "oss-cn-chengdu"
  | "oss-cn-hongkong"
  | "oss-us-west-1"
  | "oss-us-east-1"
  | "oss-ap-southeast-1"
  | "oss-ap-southeast-2"
  | "oss-ap-southeast-3"
  | "oss-ap-southeast-5"
  | "oss-ap-northeast-1"
  | "oss-ap-south-1"
  | "oss-eu-central-1"
  | "oss-eu-west-1"
  | "oss-me-east-1"
  | string

// The callback parameter is composed of a JSON string encoded in Base64,detail see https://www.alibabacloud.com/help/doc-detail/31989.htm
export interface OptionsCallback {
  // After a file is uploaded successfully, the OSS sends a callback request to this URL.
  url: string
  // The host header value for initiating callback requests.
  host?: string
  // The value of the request body when a callback is initiated, for example, key=$(key)&etag=$(etag)&my_var=$(x:my_var).
  body: string
  // The Content-Type of the callback requests initiatiated, It supports application/x-www-form-urlencoded and application/json, and the former is the default value.
  contentType?: string
  // Custom parameters are a map of key-values . e.g.:var customValue = {var1: 'value1', var2: 'value2'}
  customValue: PureObject
}

export interface InitialOptions {
  /**
   * access key you create on aliyun console website
   */
  accessKeyId: string
  /**
   * access secret you create
   */
  accessKeySecret: string
  /**
   * used by temporary authorization, detail see https://help.aliyun.com/document_detail/32077.html
   */
  stsToken?: string
  /**
   * the default bucket you want to access.
   */
  bucket: string
  /**
   * oss region domain. It takes priority over region.
   */
  endpoint?: string | null
  /**
   * default is oss-cn-hangzhou, the bucket data region location, please see Data Regions.
   * see more https://help.aliyun.com/document_detail/31837.html
   */
  region?: AliOSSRegion
  /**
   * default false, access OSS with aliyun internal network or not. If your servers are running on aliyun too, you can set true to save lot of money.
   */
  internal?: boolean
  /**
   * instruct OSS client to use HTTPS (secure: true) or HTTP (secure: false) protocol.
   */
  secure?: boolean
  /**
   * default is 60 * 1000 ms, instance level timeout for all operations.
   */
  timeout?: number
  /**
   * default false, access oss with custom domain name. if true, you can fill endpoint field with your custom domain name,
   */
  cname?: boolean
  /**
   * default false, whether request payer function of the bucket is open, if true, will send headers 'x-oss-request-payer': 'requester' to oss server. the details you can see requestPay
   */
  isRequestPay?: boolean
  /**
   * default false, it just work in Browser, if true,it means upload object with fetch mode ,else XMLHttpRequest
   */
  useFetch?: boolean
}

export interface InternalOptions extends InitialOptions {
  // covered property
  region: AliOSSRegion
  internal: boolean
  timeout: number
  cname: boolean
  isRequestPay: boolean
  secure: boolean
  useFetch: boolean

  inited?: boolean
  /**
   * SecondLevelDomain ali-oss#729
   */
  sldEnable: boolean
  /**
   * default false cancel flag: if true need to be cancelled
   */
  cancelFlag: boolean
  /**
   * record the time difference between client and server
   */
  amendTimeSkewed: number
}

export type MultiInternalOptions = AppendOptions &
  PutOptions &
  PutStreamOptions & {
    method?: requestMethod
    subres?: {
      append: ""
      position: string
    }
    contentLength?: number
  }

export interface AppendOptions {
  //  specify the position which is the content length of the latest object
  position?: string
  //  the operation timeout
  timeout?: number
  //  custom mime, will send with Content-Type entity header
  mime?: string | null
  //  user meta, will send with x-oss-meta- prefix string e.g.: { uid: 123, pid: 110 }
  meta?: PureObject
  // extra headers, detail see [RFC 2616](http://www.w3.org/Protocols/rfc2616/rfc2616.html)
  headers?: RequestHeaders
}

export interface PutOptions {
  // the operation timeout
  timeout?: number
  // custom mime, will send with Content-Type entity header
  mime?: string
  // user meta, will send with x-oss-meta- prefix string e.g.: { uid: 123, pid: 110 }
  meta?: PureObject
  // The callback parameter is composed of a JSON string encoded in Base64,detail see https://www.alibabacloud.com/help/doc-detail/31989.htm
  callback?: OptionsCallback
  // extra headers, detail see [RFC 2616](http://www.w3.org/Protocols/rfc2616/rfc2616.html)
  headers?: RequestHeaders
}

export interface PutStreamOptions {
  // the stream length, chunked encoding will be used if absent
  contentLength?: number
  // the operation timeout
  timeout?: number
  // custom mime, will send with Content-Type entity header
  mime?: string
  // user meta, will send with x-oss-meta- prefix string e.g.: { uid: 123, pid: 110 }
  meta?: PureObject
  // The callback parameter is composed of a JSON string encoded in Base64,detail see https://www.alibabacloud.com/help/doc-detail/31989.htm
  callback?: OptionsCallback
  // extra headers, detail see [RFC 2616](http://www.w3.org/Protocols/rfc2616/rfc2616.html)
  headers?: RequestHeaders
}
