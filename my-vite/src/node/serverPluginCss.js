const { readBody, genRandomStr } = require("./utils")
const { clientPublicPath } = require('./serverPluginHtml')

function codegenCss(
  id,
  css
) {
  let code =
    `import { updateStyle } from "${clientPublicPath}"\n` +
    `const css = ${JSON.stringify(css)}\n` +
    `updateStyle(${JSON.stringify(id)}, css)\n`
  code += `export default css`
  return code
}

function cssPlugin ({app, root}) {
  app.use(async (ctx, next) => {
    await next()

    if (ctx.path.endsWith('.css') && ctx.body) {
      // console.log(ctx.path)
      ctx.type = 'js'
      const css = await readBody(ctx.body)
      // console.log(css)
      ctx.body = codegenCss(genRandomStr(), css)
      return
    }
  })
}

exports.cssPlugin = cssPlugin
