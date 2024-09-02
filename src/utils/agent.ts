/*
 * Get User-Agent for browser & node.js
 * @example
 *   aliyun-sdk-nodejs/4.1.2 Node.js 5.3.0 on Darwin 64-bit
 *   aliyun-sdk-js/4.1.2 Safari 9.0 on Apple iPhone(iOS 9.2.1)
 *   aliyun-sdk-js/4.1.2 Chrome 43.0.2357.134 32-bit on Windows Server 2008 R2 / 7 64-bit
 */

export function getUserAgent(): string {
  const agent = "js"
  // fixed ali-oss version 6.1.1
  const sdk = `aliyun-sdk-${agent}/6.1.1`
  let plat = navigator.userAgent

  return checkUserAgent(`${sdk} ${plat}`)
}

function checkUserAgent(ua: string) {
  const userAgent = ua.replace(/\u03b1/, "alpha").replace(/\u03b2/, "beta")
  return userAgent
}
