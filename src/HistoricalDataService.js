import moment from 'moment'

const GAUGE_SELECTOR = 'select[name=DropDownList1]'
const SENSOR_TYPE_SELECTOR = 'select[name=DropDownList2]'
const BEGIN_DATE = '#Date1'
const END_DATE = '#Date2'
const TABLE = '#GridView2'

export default class HistoricalDataService {
  constructor(browser) {
    this.browser = browser
  }
  async getGauges() {
    const {browser} = this
    await browser.url('http://hydromet.lcra.org/chronhist.aspx')
    const gaugeSelector = await browser.getText(GAUGE_SELECTOR)
    return gaugeSelector.split(/\n/g).map(g => g.trim())
  }
  async getSensorTypes(gauge) {
    const {browser} = this
    await browser.url('http://hydromet.lcra.org/chronhist.aspx')
    await browser.selectByVisibleText(GAUGE_SELECTOR, gauge)
    const sensorTypeSelector = await browser.getText(SENSOR_TYPE_SELECTOR)
    return sensorTypeSelector.split(/\n/g).map(g => g.trim())
  }
  async _getHistoricalData(gauge, sensorType, beginDate, endDate) {
    const {browser} = this
    await browser.url('http://hydromet.lcra.org/chronhist.aspx')
    console.log('Setting gauge...')
    await browser.selectByVisibleText(GAUGE_SELECTOR, gauge)
    console.log('Setting sensor type...')
    await browser.selectByVisibleText(SENSOR_TYPE_SELECTOR, sensorType)
    console.log('Setting begin date...')
    await browser.setValue(BEGIN_DATE, moment(beginDate).format('DD/MM/YYYY'))
    console.log('Setting end date...')
    await browser.setValue(END_DATE, moment(endDate).format('DD/MM/YYYY'))
    console.log('Submitting...')
    await browser.click('input[type=submit]')
    console.log('Getting table...')
    return await browser.getHTML(TABLE)
  }
}
