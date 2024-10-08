export interface IOSSInstance {}

export type IOSSIndexs =
  | "list"
  | "put"
  | "putStream"
  | "append"
  | "getObjectUrl"
  | "generateObjectUrl"
  | "head"
  | "getObjectMeta"
  | "get"
  | "getStream"
  | "delete"
  | "copy"
  | "putMeta"
  | "deleteMulti"
  | "signatureUrl"
  | "putACL"
  | "getACL"
  | "restore"
  | "putSymlink"
  | "getSymlink"
  | "initMultipartUpload"
  | "uploadPart"
  | "uploadPartCopy"
  | "completeMultipartUpload"
  | "multipartUpload"
  | "multipartUploadCopy"
  | "listParts"
  | "listUploads"
  | "abortMultipartUpload"
  | "calculatePostSignature"
  | "getObjectTagging"
  | "putObjectTagging"
  | "deleteObjectTagging"
