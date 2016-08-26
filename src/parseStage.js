import moment from 'moment'
import {find, findOne, getText, getOuterHTML} from 'domutils'

export default function parseStage(dom) {
  const table = findOne(
    elem => elem.name === 'table' && findOne(e => e.name === 'th' && getText(e).trim() === 'Location', [elem], true),
    dom,
    true
  )
  const result = []
  find(e => e.name === 'tr', [table], true).map(row => {
    const data = find(e => e.name === 'td', [row], true).map(getText)
    const dataWinLink = findOne(e => e.name === 'a', [row], true)
    const dataWinMatch = dataWinLink && /\(([^)]+)\)/.exec(dataWinLink.attribs.href)
    const dataWinArgs = dataWinMatch && dataWinMatch[1].split(',').map(part => {
      part = part.trim()
      if (/^'.*'$/.test(part)) return part.substring(1, part.length - 1)
      return part
    })
    if (data.length >= 4) {
      result.push({
        dataWinArgs,
        location: data[0].trim(),
        date: moment(data[1], 'MMM DD YYYY hh:mmA').toDate(),
        stage: parseFloat(data[2]),
        flow: parseFloat(data[3]),
      })
    }
  })
  return result
}