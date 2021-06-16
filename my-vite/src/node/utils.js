const { Readable } = require('stream')

async function readBody (stream) {
  if (stream instanceof Readable) {
    // 如果是流
    return new Promise((resolve, reject) => {
      let res = ''
      stream.on('data', function (chunk) {
        res += chunk
      })
      stream.on('end', function () {
        resolve(res)
      })
    })
  } else {
    return stream
  }
}

exports.readBody = readBody


const injectReplaceRE = [/<head>/, /<!doctype html>/i]

function injectScriptToHtml (html, script) {
  // inject after head or doctype
  for (const re of injectReplaceRE) {
    if (re.test(html)) {
      return html.replace(re, `$&${script}`)
    }
  }
  // if no <head> tag or doctype is present, just prepend
  return script + html
}

exports.injectScriptToHtml = injectScriptToHtml

function genRandomStr () {
  return Math.random().toString().slice(-8)
}
exports.genRandomStr = genRandomStr

// function codegenCss(
//   id,
//   css
// ) {
//   let code =
//     `import { updateStyle } from "${clientPublicPath}"\n` +
//     `const css = ${JSON.stringify(css)}\n` +
//     `updateStyle(${JSON.stringify(id)}, css)\n`
//   code += `export default css`
//   return code
// }

// exports.codegenCss = codegenCss
