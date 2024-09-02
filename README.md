# ali-oss-browser

ali-oss for es module, support tree-shaking

将原有仓库中 `lib/common`、`lib/browser` 中代码抽出，使用 TS 重写并简化不必要的依赖包，减少体积。
并将代码变为可 `tree-shaking` 的组织形式。

## 变动

1. 取消控制台关于 IE10 以下浏览器的警告
2. 去除 `humanize-ms` 包的引用. new OSS() 时, timeout 类型为 number, 单位为 ms
3. 不支持自定义 `urllib`
4. 去除 `agentkeepalive` 包的依赖，不支持自定义 `agent`
5. 去除 `debug` 包的依赖
6. 去除 `merge-descriptors` 包的依赖
7. 去除 `is-type-of` 包的依赖
8. 去除 `browserify-fs` 包
9. 去除 `copy-to` 包
10. 不支持 `Bucket Operations`, 初始化 OSS 时，必须传入 `bucket`

## TODO

[] 还原 `platform.description` 设置的 `user-agent` https://github.com/bestiejs/platform.js
[] 去除 `url` 包的依赖