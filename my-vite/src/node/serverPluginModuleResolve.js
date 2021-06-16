const path = require('path')
const fs = require('fs').promises

const reg = /^\/@modules\//;

function moduleResolvePlugin ({app, root}) {
  app.use(async (ctx, next) => {
    // 如果没有匹配到 /@modules/ 就往下执行即可
    if (!reg.test(ctx.path)) {
      return next()
    }
    const id = ctx.path.replace(reg, '')
    // 解析 node_modules 中文件，这里仅支持 vue，源码见 src/node/resolver.ts: resolveNodeModule
    let mapping = {
      vue: path.resolve(root, 'node_modules', '@vue/runtime-dom/dist/runtime-dom.esm-browser.js')
    }

    const content = await fs.readFile(mapping[id], 'utf8')

    ctx.type = 'js'
    ctx.body = content
  })
}

exports.moduleResolvePlugin = moduleResolvePlugin
