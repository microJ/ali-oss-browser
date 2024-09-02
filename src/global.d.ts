declare type requestMethod =
  | "OPTIONS"
  | "GET"
  | "HEAD"
  | "POST"
  | "PUT"
  | "DELETE"
  | "TRACE"
  | "CONNECT"

declare module "stream-browserify" {
  import { Readable as IReadable } from "stream"
  export class Readable extends IReadable {}
}

declare type objectURL = string

declare interface PureObject {
  [key: string]: string | number | undefined | null | boolean
}
