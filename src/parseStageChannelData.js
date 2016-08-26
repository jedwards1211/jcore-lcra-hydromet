import {find, findOne, getText, getChildren} from 'domutils'

export default function parseStageChannelData(dom) {
  const bankfullStage = findOne(elem => elem.name === 'td' && /Bankfull Stage/i.test(getText(elem)), dom, true)
  const floodStage = findOne(elem => elem.name === 'td' && /Flood Stage/i.test(getText(elem)), dom, true)
  const bankfullMatch = bankfullStage && /[0-9.]+\s*$/.exec(getText(bankfullStage))
  const floodMatch = floodStage && /[0-9.]+\s*$/.exec(getText(floodStage))
  const rows = find(elem => elem.name === 'tr' && elem.children && elem.children.length === 3, dom, true)
  const stages = rows.map(row => parseFloat(getText(row.children[1]))).filter(Number.isFinite)
  const flows = rows.map(row => parseFloat(getText(row.children[2]))).filter(Number.isFinite)
  const maxStage = stages.length ? Math.max(...stages) : 0
  const maxFlow = flows.length ? Math.max(...flows) : 0
  return {
    bankfullStage: bankfullMatch && parseFloat(bankfullMatch[0]),
    floodStage: floodMatch && parseFloat(floodMatch[0]),
    maxStage,
    maxFlow,
  }
}
