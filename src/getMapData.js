import request from 'superagent'
import htmlparser from 'htmlparser2'
import charset from 'superagent-charset'

async function getMapData(req) {
  console.log(`GET ${req}`)
  if (typeof req === 'string') req = charset(request).get(req).charset('ucs2')
  return new Promise((resolve, reject) => {
    req.end((err, res) => {
      if (err) return reject(err)
      const handler = new htmlparser.DomHandler((error, dom) => {
        if (error) return reject(error)
        return resolve(dom)
      })
      const parser = new htmlparser.Parser(handler, {xmlMode: true})
      parser.write(res.text)
      parser.end()
    })
  })
}

export default getMapData
