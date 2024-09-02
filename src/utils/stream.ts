import { isBlob, isFile } from "./is"

/*
 * Readable stream for Web File
 */
import { Readable } from "stream-browserify"
import { ReadableOptions } from "stream"

const DEFAULT_READER_SIZE = 16 * 1024

export class WebFileReadStream extends Readable {
  public file: Blob | null = null
  public reader!: FileReader
  public start!: number
  public finish!: boolean
  public fileBuffer: Buffer | null = null

  constructor(file: Blob, options?: ReadableOptions) {
    super(options)
    if (!new.target) {
      return new WebFileReadStream(file, options)
    }

    this.file = file
    this.reader = new FileReader()
    this.start = 0
    this.finish = false
    this.fileBuffer = null
  }

  public _read(size: number) {
    if (
      (this.file && this.start >= this.file.size) ||
      (this.fileBuffer && this.start >= this.fileBuffer.length) ||
      this.finish ||
      (this.start === 0 && !this.file)
    ) {
      if (!this.finish) {
        this.fileBuffer = null
        this.finish = true
      }
      this.push(null)
      return
    }

    size = size || DEFAULT_READER_SIZE

    if (this.start === 0) {
      this.reader.onload = e => {
        if (e.target && e.target.result) {
          this.fileBuffer = Buffer.from(
            new Uint8Array(e.target.result as ArrayBuffer)
          )
          this.file = null
          this.readFileAndPush(size)
        }
      }
      this.reader.readAsArrayBuffer(this.file!)
    } else {
      this.readFileAndPush(size)
    }
  }

  public readFileAndPush(size: number) {
    if (this.fileBuffer) {
      let pushRet = true
      while (
        pushRet &&
        this.fileBuffer &&
        this.start < this.fileBuffer.length
      ) {
        const { start } = this
        let end = start + size
        end = end > this.fileBuffer.length ? this.fileBuffer.length : end
        this.start = end
        pushRet = this.push(this.fileBuffer.slice(start, end))
      }
    }
  }
}

export function _createStream(file: Blob | File, start: number, end: number) {
  if (isBlob(file) || isFile(file)) {
    return new WebFileReadStream(file.slice(start, end))
  }

  throw new Error("_createStream requires File/Blob.")
}
