import superagent from 'superagent-use'
import getHtml from './getHtml'
import parseStage from './parseStage'
import channelDataUrl from './channelDataUrl'
import parseStageChannelData from './parseStageChannelData'
import niceCeiling from './niceCeiling'
import Promise, {promisify} from 'bluebird'
import {connect} from 'jcore-api'
import camelCase from 'lodash.camelcase'
import memoize from 'lodash.memoize'
import mapDataUrl from './mapDataUrl'
import getMapData from './getMapData'
import parseMapData from './parseMapData'

import Throttle from 'superagent-throttle'

const throttle = new Throttle({
  active: true,
  rate: 1,
  ratePer: 1000,
  concurrent: 1
})

superagent.use(throttle.plugin())

if (process.env.NODE_ENV !== 'production') {
  require('dotenv').config()
}

const mapChannels = {
  stage: {name: 'River stage', units: 'feet', min: 0, max: 200},
  flow: {name: 'Streamflow', units: 'cfs', min: 0, max: 200},
  humidity: {name: 'Relative humidity', units: '%', min: 0, max: 100},
  rain: {name: 'Rainfall - most recent', units: 'in', min: 0, max: 10},
  rain30min: {name: 'Rainfall - past half hour', units: 'in', min: 0, max: 10},
  rain1: {name: 'Rainfall - past hour', units: 'in', min: 0, max: 10},
  rain2: {name: 'Rainfall - past 2 hours', units: 'in', min: 0, max: 10},
  rain3: {name: 'Rainfall - past 3 hours', units: 'in', min: 0, max: 10},
  rain6: {name: 'Rainfall - past 6 hours', units: 'in', min: 0, max: 10},
  rain12: {name: 'Rainfall - past 12 hours', units: 'in', min: 0, max: 10},
  raintoday: {name: 'Rainfall - since midnight', units: 'in', min: 0, max: 10},
  rain1day: {name: 'Rainfall - past 24 hours', units: 'in', min: 0, max: 10},
  rain2day: {name: 'Rainfall - past 48 hours', units: 'in', min: 0, max: 10},
  rain1wk: {name: 'Rainfall - past week', units: 'in', min: 0, max: 10},
  rain2wk: {name: 'Rainfall - past 2 weeks', units: 'in', min: 0, max: 10},
  temp: {name: 'Temperature', units: '°F', min: 0, max: 100},
}

const {API_TOKEN} = process.env
if (!API_TOKEN) {
  console.error("You must set the API_TOKEN environment variable")
  process.exit(1)
}

const BASE_URL = process.env.BASE_URL || 'http://hydromet.lcra.org/'
const STAGE_URL = process.env.STAGE_URL || BASE_URL + 'repstage.asp'

const getChannelId = memoize(location => `lcraHydromet/${camelCase(location)}`)

connect(API_TOKEN, async (err, jcore) => {
  if (err) {
    console.error(err.stack)
    process.exit(1)
  }

  const setMetadata = promisify(jcore.setMetadata, {context: jcore})
  const getMetadata = promisify(jcore.getMetadata, {context: jcore})
  const setRealTimeData = promisify(jcore.setRealTimeData, {context: jcore})
  const setLocations = promisify(jcore.setLocations, {context: jcore})

  try {
    await setMetadata({
      lcraHydromet: {name: ['LCRA Hydromet']}
    })
  } catch (error) {
    console.error(error.stack)
  }
  // async function update() {
  //   try {
  //     const data = parseStage(await getHtml(STAGE_URL))
  //     const metadata = {}
  //     const realTimeData = {}
  //     const channelIds = data.map(({location}) => getChannelId(location))
  //     const existingMetadata = await getMetadata({channelIds})
  //     await Promise.all(data.map(async ({location, date, stage, flow, dataWinArgs}) => {
  //       const channelId = getChannelId(location)
  //       const stageChannel = channelId + '/stage'
  //       const flowChannel = channelId + '/flow'
  //       if (!existingMetadata || (!existingMetadata[channelId])) {
  //         metadata[channelId] = {name: [location]}
  //         metadata[stageChannel] = {name: ['Stage'], timeout: 9 * 60000, units: 'ft', min: 0, max: 200}
  //         metadata[flowChannel] = {name: ['Flow'], timeout: 9 * 60000, units: 'cfs', min: 0, max: 200}
  //
  //         if (dataWinArgs) {
  //           const stageChannelData = parseStageChannelData(await getHtml(BASE_URL + channelDataUrl(...dataWinArgs)))
  //           metadata[stageChannel].max = niceCeiling(Math.max(stageChannelData.maxStage, stageChannelData.floodStage || 0) * 3 / 2)
  //           if (stageChannelData.maxFlow) metadata[flowChannel].max = niceCeiling(stageChannelData.maxFlow * 3 / 2)
  //         }
  //       }
  //       const t = date.getTime()
  //       realTimeData[stageChannel] = {t, v: stage}
  //       realTimeData[flowChannel] = {t, v: flow}
  //     }))
  //     const metadataCount = Object.keys(metadata).length
  //     if (metadataCount) {
  //       await setMetadata(metadata)
  //       console.log(`Set metadata for ${metadataCount} channels`)
  //     }
  //     await setRealTimeData(realTimeData)
  //     console.log(realTimeData)
  //   } catch (error) {
  //     console.error(error.stack)
  //   }
  // }

//   await update()
//
//   setInterval(update, 5 * 60000)

  async function updateMapData() {
    try {
      const date = new Date()
      const now = date.getTime()
      const data = parseMapData(await getMapData(mapDataUrl(date)))
      const metadata = {}
      const locations = []
      const realTimeData = {}
      const channelIds = data.map(({sitenumber}) => `lcraHydromet/${sitenumber}`)
      const existingMetadata = await getMetadata({channelIds})
      data.forEach(site => {
        const locationChannelId = `lcraHydromet/${site.sitenumber}`
        if (isNaN(site.zoom)) return
        locations.push({
          channelId: locationChannelId,
          // name: site.name,
          zoom: site.zoom,
          lat: site.lat,
          lng: site.lng,
        })
        if (!existingMetadata[locationChannelId]) {
          metadata[locationChannelId] = {name: [site.name]}
          for (let gauge in mapChannels) {
            if (site.hasOwnProperty(gauge)) {
              const gaugeChannelId = `${locationChannelId}/${gauge}`
              metadata[gaugeChannelId] = {
                ...mapChannels[gauge],
                timeout: 9 * 60000,
                locationChannelId
              }
            }
          }
          if (site.stage != null) metadata[`${locationChannelId}/stage`].max = site.floodstage || 200
        }
        for (let gauge in mapChannels) {
          if (site.hasOwnProperty(gauge)) {
            realTimeData[`${locationChannelId}/${gauge}`] = {t: now, v: site[gauge]}
          }
        }
      })
      if (locations.length) {
        await setLocations(locations)
        console.log(`Set positions for ${locations.length} locations`)
      }
      const metadataCount = Object.keys(metadata).length
      console.log("Metadata Count: " + metadataCount)
      if (metadataCount) {
        await setMetadata(metadata)
        console.log(`Set metadata for ${metadataCount} channels`)
      }
      await setRealTimeData(realTimeData)
      console.log(realTimeData)
    } catch (error) {
      console.error(error.stack)
    }
  }

  await updateMapData()

  setInterval(updateMapData, 5 * 60000)
})
