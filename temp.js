import phantomjs from 'phantomjs-prebuilt'
import * as webdriverio from 'webdriverio'
import HistoricalDataService from './src/HistoricalDataService'

async function run () {
  const program = await phantomjs.run('--webdriver=4444')
  console.log("Started PhantomJS")
  process.on('exit', () => program.kill())

  const browser = webdriverio.remote({
    desiredCapabilities: {
      browserName: 'phantomjs'
    }
  }).init()
  process.on('exit', () => browser.end())

  const server = new HistoricalDataService(browser)
  const html = await server._getHistoricalData('Bangs 6 W', 'Rainfall at Site', new Date('2015/09/01'), new Date('2015/10/01'))
  console.log(html)
}

run().then(() => {
  process.exit(0)
}).catch(error => {
  console.error(error.stack)
  process.exit(1)
})
