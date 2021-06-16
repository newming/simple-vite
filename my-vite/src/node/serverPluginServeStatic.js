const path = require('path')
const static = require('koa-static')

function serveStaticPlugin({app, root}) {
  app.use(static(root))
  app.use(static(path.resolve(root, 'public')))
}

exports.serveStaticPlugin = serveStaticPlugin
