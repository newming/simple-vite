const { readBody } = require("./utils")
const { parse } = require('es-module-lexer')
const MagicString = require('magic-string')
const { clientPublicPath } = require('./serverPluginHtml')

function rewriteImports (source) {
  let imports = parse(source)[0]
  // console.log(imports)
  let ms = new MagicString(source)
  if (imports.length > 0) {
    for (let i = 0; i < imports.length; i++) {
      const {s, e} = imports[i] // 每行 import 文件路径的开始和结束
      let id = source.slice(s, e)
      // 如果开头不是 ./ 或者 /
      if (/^[^\/\.]/.test(id)) {
        id = `/@modules/${id}`
        ms.overwrite(s, e, id)
      }
    }
  }
  return ms.toString()
}

function moduleRewritePlugin({app, root}) {
  app.use(async (ctx, next) => {
    // 先让后边的中间件触发，比如 静态资源服务器，然后处理静态资源处理器已经处理后的结果
    await next()
    // 此时如果是 静态资源服务器中间件执行完毕，ctx.body是一个可读流，我们只需要处理 js 中的引用
    // 也有可能是其他格式，比如 text: https://developer.mozilla.org/en-US/docs/Web/HTTP/Basics_of_HTTP/MIME_types
    if (ctx.body && ctx.response.is('js') &&
      ctx.path !== clientPublicPath &&
      !(ctx.path.endsWith('.vue') && ctx.query.type === 'style')) {
      let r = await readBody(ctx.body)

      const result = rewriteImports(r)
      ctx.body = result
    }
  })
}

exports.moduleRewritePlugin = moduleRewritePlugin
