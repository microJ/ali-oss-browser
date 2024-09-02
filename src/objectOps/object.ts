import mime from "mime"

import {
  AppendOptions,
  AppendInternalOptions,
  PutOptions,
  PutStreamOptions,
  PutStreamInternalOptions,
} from "./types/object.t"
import { objectName, _getFileSize, _convertMetaToHeaders, _objectRequestParams } from "../utils/utils"
import { isBuffer, isBlob, isFile } from "../utils/is"
import { extname } from "../utils/path"
import { _createStream } from "../utils/stream"
import {WebFileReadStream} from "../utils/stream"


// proto.head = async function head(name, options) {
//   const params = this._objectRequestParams('HEAD', name, options);
//   params.successStatuses = [200, 304];

//   const result = await this.request(params);

//   const data = {
//     meta: null,
//     res: result.res,
//     status: result.status
//   };

//   if (result.status === 200) {
//     Object.keys(result.headers).forEach((k) => {
//       if (k.indexOf('x-oss-meta-') === 0) {
//         if (!data.meta) {
//           data.meta = {};
//         }
//         data.meta[k.substring(11)] = result.headers[k];
//       }
//     });
//   }
//   return data;
// };

// proto.get = async function get(name, file, options) {
//   let writeStream = null;
//   let needDestroy = false;

//   if (is.writableStream(file)) {
//     writeStream = file;
//   } else if (is.string(file)) {
//     writeStream = fs.createWriteStream(file);
//     needDestroy = true;
//   } else {
//     // get(name, options)
//     options = file;
//   }

//   options = options || {};
//   if (options.process) {
//     options.subres = options.subres || {};
//     options.subres['x-oss-process'] = options.process;
//   }

//   let result;
//   try {
//     const params = this._objectRequestParams('GET', name, options);
//     params.writeStream = writeStream;
//     params.successStatuses = [200, 206, 304];

//     result = await this.request(params);

//     if (needDestroy) {
//       writeStream.destroy();
//     }
//   } catch (err) {
//     if (needDestroy) {
//       writeStream.destroy();
//       // should delete the exists file before throw error
//       this.debug('get error: %s, delete the exists file %s', err, file, 'error');
//       await this._deleteFileSafe(file);
//     }
//     throw err;
//   }

//   return {
//     res: result.res,
//     content: result.data
//   };
// };

// proto.delete = async function _delete(name, options) {
//   const params = this._objectRequestParams('DELETE', name, options);
//   params.successStatuses = [204];

//   const result = await this.request(params);

//   return {
//     res: result.res
//   };
// };

// proto.deleteMulti = async function deleteMulti(names, options) {
//   options = options || {};
//   let xml = '<?xml version="1.0" encoding="UTF-8"?>\n<Delete>\n';
//   if (options.quiet) {
//     xml += '  <Quiet>true</Quiet>\n';
//   } else {
//     xml += '  <Quiet>false</Quiet>\n';
//   }
//   for (let i = 0; i < names.length; i++) {
//     xml += `  <Object><Key>${
//       utility.escape(objectName(names[i]))}</Key></Object>\n`;
//   }
//   xml += '</Delete>';
//   this.debug('delete multi objects: %s', xml, 'info');

//   options.subres = 'delete';
//   const params = this._objectRequestParams('POST', '', options);
//   params.mime = 'xml';
//   params.content = xml;
//   params.xmlResponse = true;
//   params.successStatuses = [200];
//   const result = await this.request(params);

//   const r = result.data;
//   let deleted = (r && r.Deleted) || null;
//   if (deleted) {
//     if (!Array.isArray(deleted)) {
//       deleted = [deleted];
//     }
//     deleted = deleted.map(item => item.Key);
//   }
//   return {
//     res: result.res,
//     deleted
//   };
// };

// merge(proto, require('../common/object/copyObject'));
// merge(proto, require('../common/object/getObjectTagging'));
// merge(proto, require('../common/object/putObjectTagging'));
// merge(proto, require('../common/object/deleteObjectTagging'));

// proto.putMeta = async function putMeta(name, meta, options) {
//   const copyResult = await this.copy(name, name, {
//     meta: meta || {},
//     timeout: options && options.timeout,
//     ctx: options && options.ctx
//   });
//   return copyResult;
// };

// proto.list = async function list(query, options) {
//   // prefix, marker, max-keys, delimiter

//   const params = this._objectRequestParams('GET', '', options);
//   params.query = query;
//   params.xmlResponse = true;
//   params.successStatuses = [200];

//   const result = await this.request(params);
//   let objects = result.data.Contents;
//   const that = this;
//   if (objects) {
//     if (!Array.isArray(objects)) {
//       objects = [objects];
//     }
//     objects = objects.map(obj => ({
//       name: obj.Key,
//       url: that._objectUrl(obj.Key),
//       lastModified: obj.LastModified,
//       etag: obj.ETag,
//       type: obj.Type,
//       size: Number(obj.Size),
//       storageClass: obj.StorageClass,
//       owner: {
//         id: obj.Owner.ID,
//         displayName: obj.Owner.DisplayName
//       }
//     }));
//   }
//   let prefixes = result.data.CommonPrefixes || null;
//   if (prefixes) {
//     if (!Array.isArray(prefixes)) {
//       prefixes = [prefixes];
//     }
//     prefixes = prefixes.map(item => item.Prefix);
//   }
//   return {
//     res: result.res,
//     objects,
//     prefixes,
//     nextMarker: result.data.NextMarker || null,
//     isTruncated: result.data.IsTruncated === 'true'
//   };
// };

// /*
//  * Set object's ACL
//  * @param {String} name the object key
//  * @param {String} acl the object ACL
//  * @param {Object} options
//  */
// proto.putACL = async function putACL(name, acl, options) {
//   options = options || {};
//   options.subres = 'acl';
//   options.headers = options.headers || {};
//   options.headers['x-oss-object-acl'] = acl;
//   name = objectName(name);

//   const params = this._objectRequestParams('PUT', name, options);
//   params.successStatuses = [200];

//   const result = await this.request(params);

//   return {
//     res: result.res
//   };
// };

// /*
//  * Get object's ACL
//  * @param {String} name the object key
//  * @param {Object} options
//  * @return {Object}
//  */
// proto.getACL = async function getACL(name, options) {
//   options = options || {};
//   options.subres = 'acl';
//   name = objectName(name);

//   const params = this._objectRequestParams('GET', name, options);
//   params.successStatuses = [200];
//   params.xmlResponse = true;

//   const result = await this.request(params);

//   return {
//     acl: result.data.AccessControlList.Grant,
//     owner: {
//       id: result.data.Owner.ID,
//       displayName: result.data.Owner.DisplayName
//     },
//     res: result.res
//   };
// };

// /**
//  * Restore Object
//  * @param {String} name the object key
//  * @param {Object} options
//  * @returns {{res}}
//  */
// proto.restore = async function restore(name, options) {
//   options = options || {};
//   options.subres = 'restore';
//   const params = this._objectRequestParams('POST', name, options);
//   params.successStatuses = [202];

//   const result = await this.request(params);

//   return {
//     res: result.res
//   };
// };

// proto.signatureUrl = function signatureUrl(name, options) {
//   options = options || {};
//   name = objectName(name);
//   options.method = options.method || 'GET';
//   const expires = utility.timestamp() + (options.expires || 1800);
//   const params = {
//     bucket: this.options.bucket,
//     object: name
//   };

//   const resource = this._getResource(params);

//   if (this.options.stsToken) {
//     options['security-token'] = this.options.stsToken;
//   }

//   const signRes = signHelper._signatureForURL(this.options.accessKeySecret, options, resource, expires);

//   const url = urlutil.parse(this._getReqUrl(params));
//   url.query = {
//     OSSAccessKeyId: this.options.accessKeyId,
//     Expires: expires,
//     Signature: signRes.Signature
//   };

//   copy(signRes.subResource).to(url.query);

//   return url.format();
// };

// /**
//  * Get Object url by name
//  * @param {String} name - object name
//  * @param {String} [baseUrl] - If provide `baseUrl`,
//  *        will use `baseUrl` instead the default `endpoint`.
//  * @return {String} object url
//  */
// proto.getObjectUrl = function getObjectUrl(name, baseUrl) {
//   if (!baseUrl) {
//     baseUrl = this.options.endpoint.format();
//   } else if (baseUrl[baseUrl.length - 1] !== '/') {
//     baseUrl += '/';
//   }
//   return baseUrl + this._escape(objectName(name));
// };

// proto._objectUrl = function _objectUrl(name) {
//   return this._getReqUrl({ bucket: this.options.bucket, object: name });
// };

// /**
//  * Get Object url by name
//  * @param {String} name - object name
//  * @param {String} [baseUrl] - If provide `baseUrl`, will use `baseUrl` instead the default `endpoint and bucket`.
//  * @return {String} object url include bucket
//  */
// proto.generateObjectUrl = function (name, baseUrl) {
//   if (!baseUrl) {
//     baseUrl = this.options.endpoint.format();
//     const copyUrl = urlutil.parse(baseUrl);
//     const { bucket } = this.options;

//     copyUrl.hostname = `${bucket}.${copyUrl.hostname}`;
//     copyUrl.host = `${bucket}.${copyUrl.host}`;
//     baseUrl = copyUrl.format();
//   } else if (baseUrl[baseUrl.length - 1] !== '/') {
//     baseUrl += '/';
//   }
//   return baseUrl + this._escape(objectName(name));
// };

// /**
//  * generator request params
//  * @return {Object} params
//  *
//  * @api private
//  */


// proto._statFile = function _statFile(filepath) {
//   return new Promise((resolve, reject) => {
//     fs.stat(filepath, (err, stats) => {
//       if (err) {
//         reject(err);
//       } else {
//         resolve(stats);
//       }
//     });
//   });
// };

// proto._deleteFileSafe = function _deleteFileSafe(filepath) {
//   return new Promise((resolve) => {
//     fs.exists(filepath, (exists) => {
//       if (!exists) {
//         resolve();
//       } else {
//         fs.unlink(filepath, (err) => {
//           if (err) {
//             this.debug('unlink %j error: %s', filepath, err, 'error');
//           }
//           resolve();
//         });
//       }
//     });
//   });
// };
