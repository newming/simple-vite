# vite 使用

## 初始化

```bash
# 启动 vite
npm init vite-app <project-name>
npm install
npm run dev

# 启动 my-vite
# my-vite下
npm link
# 回到上层
nodemon

# 调试 vite 源码
# vite下装包
npm run dev
npm link
# playground 下
yarn install
npm run dev
```

无需打包，按需加载

## 实现vite

1. 实现静态资源服务器
2. es module 的路径必须以 '/', './', '../' 开头

- 浏览器识别到 es6 模块后会自动发起请求，查找相应文件
- 后端需要对文件中文件路径进行改写，所有不带 '/', './', '../' 的增加 '/@modules'


## 原始vite node/server 下插件功能

- [参考文档](https://zhuanlan.zhihu.com/p/161950643)

1. sourceMapPlugin: 在返回文档结尾追加 sourceMap 内容，是最后一个执行的插件
2. moduleRewritePlugin: 重写 /module/ -> /@modules/module/dist/*，以下情况不需要重写，同时检查了文件中是否需要引入 env 变量，如果需要的话注入
```
ctx.body &&
ctx.response.is('js') &&
!isCSSRequest(ctx.path) &&
!ctx.url.endsWith('.map') &&
!resolver.isPublicRequest(ctx.path) &&
// skip internal client
publicPath !== clientPublicPath &&
// need to rewrite for <script>\<template> part in vue files
!((ctx.path.endsWith('.vue') || ctx.vue) && ctx.query.type === 'style')
```
3. htmlRewritePlugin: 追加引入 client 的脚本，同时如果配置了 html transforms 也是在这里执行
4. envPlugin: 如果请求的是 /vite/env 返回环境变量js文件
