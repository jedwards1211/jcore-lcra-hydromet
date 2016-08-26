import getHtml from './getHtml'
import parseStage from './parseStage'
import {promisify} from 'bluebird'
import {connect} from 'jcore-api'
import camelCase from 'lodash.camelCase'
import memoize from 'lodash.memoize'

require('dotenv').config()

const {API_TOKEN} = process.env
if (!API_TOKEN) {
  console.error("You must set the API_TOKEN environment variable")
  return 1
}

const STAGE_URL = process.env.STAGE_URL || 'http://hydromet.lcra.org/repstage.asp'

const getChannelId = memoize(location => `lcraHydromet^${camelCase(location)}`)
const _metadata = {}
const realTimeData = {}

connect(API_TOKEN, async (err, jcore) => {
  if (err) {
    console.error(err.stack)
    return 1
  }

  const setMetadata = promisify(jcore.setMetadata, {context: jcore})
  const setRealTimeData = promisify(jcore.setRealTimeData, {context: jcore})

  try {
    await setMetadata({
      lcraHydromet: {name: ['LCRA Hydromet']}
    })
  } catch (error) {
    console.error(error.stack)
  }
  async function update() {
    try {
      const data = parseStage(await getHtml(STAGE_URL))
      const metadata = {}
      data.forEach(({location, date, stage, flow}) => {
        const channelId = getChannelId(location)
        const item = _metadata[channelId]
        if (!item) {
          _metadata[channelId] = metadata[channelId] = { name: [location] }
          metadata[`${channelId}^stage`] = { name: ['Stage'], timeout: 9 * 60000, units: 'ft' }
          metadata[`${channelId}^flow`] = { name: ['Flow'] , timeout: 9 * 60000, units: 'cfs' }
        }
        const t = date.getTime()
        realTimeData[`${channelId}^stage`] = {t, v: stage}
        realTimeData[`${channelId}^flow`] = {t, v: flow}
      })
      const metadataCount = Object.keys(metadata).length
      if (metadataCount) {
        await setMetadata(metadata)
        console.log(`Set metadata for ${metadataCount} channels`)
      }
      await setRealTimeData(realTimeData)
    } catch (error) {
      console.error(error.stack)
    }
  }

  await update()

  setInterval(update, 5 * 60000)
})
