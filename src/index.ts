import { initOptions } from "./utils/options"
import { getUserAgent } from "./utils/agent"
import { IOSSIndexs } from "./types/OSS.t"
import { InternalOptions, InitialOptions } from "./types/options.t"

class OSS {
  public options!: InternalOptions
  public userAgent!: string

  constructor(options: InitialOptions) {
    if (!new.target) {
      return new OSS(options)
    }

    if ((options as InternalOptions).inited) {
      this.options = options as InternalOptions
    } else {
      this.options = initOptions(options)
    }

    // no use
    // this.agent = globalHttpAgent
    this.userAgent = getUserAgent()
  }

  /**
   * Object Operations
   */

  public list!: Function
  public put!: Function
  public putStream!: Function
  public append!: Function
  public getObjectUrl!: Function
  public generateObjectUrl!: Function
  public head!: Function
  public getObjectMeta!: Function
  public get!: Function
  public getStream!: Function
  public delete!: Function
  public copy!: Function
  public putMeta!: Function
  public deleteMulti!: Function
  public signatureUrl!: Function
  public putACL!: Function
  public getACL!: Function
  public restore!: Function
  public putSymlink!: Function
  public getSymlink!: Function
  public initMultipartUpload!: Function
  public uploadPart!: Function
  public uploadPartCopy!: Function
  public completeMultipartUpload!: Function
  public multipartUpload!: Function
  public multipartUploadCopy!: Function
  public listParts!: Function
  public listUploads!: Function
  public abortMultipartUpload!: Function
  public calculatePostSignature!: Function
  public getObjectTagging!: Function
  public putObjectTagging!: Function
  public deleteObjectTagging!: Function

  public use(...fns: Function[]) {
    fns.forEach(fn => {
      const name: IOSSIndexs = fn.name as IOSSIndexs
      OSS.prototype[name] = fn
    })
  }
}

export default OSS
