const { readBody, injectScriptToHtml } = require("./utils")

const clientPublicPath = `/vite/client`
const devInjectionCode = `\n<script type="module">import "${clientPublicPath}"</script>\n`

function rewriteHtml (html) {
  return injectScriptToHtml(html, devInjectionCode)
}

function htmlRewritePlugin ({app, root}) {
  app.use(async (ctx, next) => {
    await next()
    if (ctx.response.is('html') && ctx.body) {
      const html = await readBody(ctx.body)
      ctx.body = rewriteHtml(html)
      return
    }
  })
}

exports.clientPublicPath = clientPublicPath
exports.htmlRewritePlugin = htmlRewritePlugin
