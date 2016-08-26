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
    if (data.length >= 4) {
      result.push({
        location: data[0].trim(),
        date: moment(data[1], 'MMM DD YYYY hh:mmA').toDate(),
        stage: parseFloat(data[2]),
        flow: parseFloat(data[3]),
      })
    }
  })
  return result
}