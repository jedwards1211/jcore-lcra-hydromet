import request from 'superagent'
import htmlparser from 'htmlparser2'

async function getHtml(req) {
  console.log(`GET ${req}`)
  if (typeof req === 'string') req = request.get(req)
  return new Promise((resolve, reject) => {
    const handler = new htmlparser.DomHandler((error, dom) => {
      if (error) return reject(error)
      return resolve(dom)
    })
    const parser = new htmlparser.Parser(handler)
    req.pipe(parser)
  })
}

export default getHtml
