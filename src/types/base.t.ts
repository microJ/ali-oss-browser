export interface RequestHeaders {
  // cache control for download, e.g.: Cache-Control: public, no-cache
  "Cache-Control"?: string
  // object name for download, e.g.: Content-Disposition: somename
  "Content-Disposition"?: string
  // object content encoding for download, e.g.: Content-Encoding: gzip
  "Content-Encoding"?: string
  // expires time (milliseconds) for download, e.g.: Expires: 3600000
  Expires?: string

  "Content-Length"?: number

  "Transfer-Encoding"?: "chunked"

  [key: string]: string | number | undefined
}
