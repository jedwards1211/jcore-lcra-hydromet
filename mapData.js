import mapDataUrl from './src/mapDataUrl'
import get from './src/getMapData'
import parseMapData from './src/parseMapData'
import {getText} from 'domutils'

async function run () {
  const dom = await get(mapDataUrl())
  console.log(dom)
  const data = parseMapData(dom)
  console.log(JSON.stringify(data, null, 2))
}

run()
// run().then(() => {
//   process.exit(0)
// }).catch(error => {
//   console.error(error.stack)
//   process.exit(1)
// })
