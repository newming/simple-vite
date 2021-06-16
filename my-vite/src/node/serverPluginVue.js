const path = require('path')
const fs = require('fs').promises
const { genRandomStr } = require("./utils")
const { clientPublicPath } = require('./serverPluginHtml')

function vuePlugin ({app, root}) {
  app.use(async (ctx, next) => {
    if (!ctx.path.endsWith('.vue')) {
      return next()
    }

    const filePath = path.join(root, ctx.path)
    const content = await fs.readFile(filePath, 'utf8')

    // 解析模版 https://www.npmjs.com/package/@vue/compiler-sfc
    const { compileTemplate, parse } = require(path.resolve(root, 'node_modules/@vue/compiler-sfc/dist/compiler-sfc.cjs.js'))
    let { descriptor } = parse(content)
    console.log(descriptor)

    if (!ctx.query.type) {
      // /App.vue
      let code = ''
      if (descriptor.script) {
        let content = descriptor.script.content
        code += content.replace(/((?:^|\n|;)\s*)export default/, '$1const __script=')
      }
      // 如果vue文件中存在 <style>
      if (descriptor.styles) {
        descriptor.styles.forEach((s, i) => {
          const styleRequest = ctx.path + `?type=style&index=${i}`
          code += `\nimport ${JSON.stringify(styleRequest)}`
        })
      }
      // 如果vue文件中存在 <template>
      if (descriptor.template) {
        const requestPath = ctx.path + '?type=template'
        code += `\nimport { render as __render } from "${requestPath}"`
        code += `\n__script.render = __render`
      }
      code += `\nexport default __script`
      ctx.type = 'js'
      ctx.body = code
      // console.log(descriptor)
    }

    // 如果是 template
    if (ctx.query.type === 'template') {
      ctx.type = 'js'
      let content = descriptor.template.content
      const { code } = compileTemplate({
        id: ctx.path,
        source: content,
        transformAssetUrls: {
          base: path.posix.dirname(ctx.path) // 模版中静态资源路径处理
        }
      }) // 将模版template转换为render函数
      ctx.body = code
    }

    // 如果是 style
    if (ctx.query.type === 'style') {
      const index = Number(ctx.query.index)
      const styleBlock = descriptor.styles[index]
      ctx.type = 'js'
      ctx.body = codegenCss(`${genRandomStr()}-${index}`, styleBlock.content)
    }
  })
}

exports.vuePlugin = vuePlugin

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