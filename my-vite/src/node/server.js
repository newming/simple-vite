const Koa = require('koa')
const { serveStaticPlugin } = require('./serverPluginServeStatic')
const { moduleRewritePlugin } = require('./serverPluginModuleRewrite')
const { moduleResolvePlugin } = require('./serverPluginModuleResolve')
const { htmlRewritePlugin } = require('./serverPluginHtml')
const { vuePlugin } = require('./serverPluginVue')
const { clientPlugin } = require('./serverPluginClient')
const { cssPlugin } = require('./serverPluginCss')

function createServer() {
  const app = new Koa()

  // 实现静态资源服务功能
  const context = {
    app,
    root: process.cwd() // 执行该命令所在位置
  }

  const resolvePlugin = [
    moduleRewritePlugin, // 模块重写
    htmlRewritePlugin, // html重写
    moduleResolvePlugin, // 捕获 /@module/ 文件，要早于 moduleRewrite，因为捕获到的文件中还可能存在依赖其他 node_modules 中的东西
    clientPlugin, // 注入到前端模版文件路由处理
    vuePlugin, // 解析 vue 文件
    cssPlugin,
    serveStaticPlugin, // 静态服务插件
  ]

  resolvePlugin.forEach(plugin => plugin(context))

  return app
}

createServer().listen(4000, () => {
  console.log('vite start 4000')
})

// plugin 触发顺序
