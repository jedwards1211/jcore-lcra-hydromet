export default function mapDataUrl(date = new Date()) {
  var curHour = date.getHours()
  var curMin = date.getMinutes()
  if (curHour > 12) curHour = curHour - 12
  if (curHour == 0) curHour = 12
  var curTime = curHour + ":" + ((curMin < 10) ? "0" : "") + parseInt(curMin).toString()
  return 'http://hydromet.lcra.org/data/datafull.xml?' + curTime
}
