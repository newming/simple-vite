const path = require('path')
const fs = require('fs')
const { clientPublicPath } = require('./serverPluginHtml')

const clientFilePath = path.resolve(__dirname, '../client/client.js')

function clientPlugin ({app, root}) {
  const clientCode = fs.readFileSync(clientFilePath, 'utf-8')
  app.use(async (ctx, next) => {
    if (ctx.path === clientPublicPath) {
      ctx.type = 'js'
      ctx.body = clientCode
      return
    }
    await next()
  })
}

exports.clientPlugin = clientPlugin
