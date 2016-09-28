import {find, findOne, getChildren} from 'domutils'

function wtemp(value) {
  if (value === -998) return null
  return Math.round(value = value * 1.8 + 32)
}

function parseNumber(value) {
  const number = parseFloat(value)
  return number <= -998 ? NaN : number
}

export default function parseMapData(dom) {
  return findOne(e => e.name === 'rows', dom, true).children.filter(c => c.name === 'row').map(({attribs}) => ({
    sitenumber: parseInt(attribs.a),
    zoom: parseInt(attribs.b),
    name: attribs.c,
    lat: parseNumber(attribs.d),
    lng: parseNumber(attribs.e),
    type: attribs.f,
    disclaimer: attribs.a4,
    stage: parseNumber(attribs.t),
    flow: parseNumber(attribs.u),
    wtemp: wtemp(parseNumber(attribs.a3)),
    humidity: Math.round(parseNumber(attribs.a2)),
    head: parseNumber(attribs.v),
    tail: parseNumber(attribs.w),
    rain: parseNumber(attribs.h),
    rain30min: parseNumber(attribs.i),
    rain1: parseNumber(attribs.j),
    rain2: parseNumber(attribs.k),
    rain3: parseNumber(attribs.l),
    rain6: parseNumber(attribs.m),
    rain12: parseNumber(attribs.n),
    raintoday: parseNumber(attribs.o),
    rain1day: parseNumber(attribs.p),
    rain2day: parseNumber(attribs.q),
    rain1wk: parseNumber(attribs.r),
    rain2wk: parseNumber(attribs.s),
    bankfull: Math.round(parseNumber(attribs.x)),
    floodstage: Math.round(parseNumber(attribs.y)),
    temp: Math.round(parseNumber(attribs.g)),
    mintemp: Math.round(parseNumber(attribs.z)),
    maxtemp: Math.round(parseNumber(attribs.a1)),
  }))
}

// function loadMarkerAndLabel(markerData, i) {
//   var point = new google.maps.LatLng(
//     parseFloat(markerData.getAttribute("d")),
//     parseFloat(markerData.getAttribute("e")));
//   gmarkers[i] = new google.maps.Marker({
//     position: point
//   });
//   gmarkers[i].sitenumber = markerData.getAttribute("a");
//   gmarkers[i].name = markerData.getAttribute("c");
//   gmarkers[i].zoom = markerData.getAttribute("b");
//   gmarkers[i].type = markerData.getAttribute("f");
//   gmarkers[i].disclaimer = markerData.getAttribute("a4");
//   gmarkers[i].stage = Math.max(markerData.getAttribute("t"));
//   gmarkers[i].flow = Math.round(markerData.getAttribute("u"));
//   gmarkers[i].wtemp = markerData.getAttribute("a3");
//   if (gmarkers[i].wtemp != -998) {
//     gmarkers[i].wtemp = gmarkers[i].wtemp * 1.8 + 32;
//   }
//   gmarkers[i].wtemp = Math.round(gmarkers[i].wtemp);
//   gmarkers[i].humidity = Math.round(markerData.getAttribute("a2"));
//   gmarkers[i].head = markerData.getAttribute("v");
//   gmarkers[i].tail = markerData.getAttribute("w");
//   gmarkers[i].rain = markerData.getAttribute("h");
//   gmarkers[i].rain30min = markerData.getAttribute("i");
//   gmarkers[i].rain1 = markerData.getAttribute("j");
//   gmarkers[i].rain2 = markerData.getAttribute("k");
//   gmarkers[i].rain3 = markerData.getAttribute("l");
//   gmarkers[i].rain6 = markerData.getAttribute("m");
//   gmarkers[i].rain12 = markerData.getAttribute("n");
//   gmarkers[i].raintoday = markerData.getAttribute("o");
//   gmarkers[i].rain1day = markerData.getAttribute("p");
//   gmarkers[i].rain2day = markerData.getAttribute("q");
//   gmarkers[i].rain1wk = markerData.getAttribute("r");
//   gmarkers[i].rain2wk = markerData.getAttribute("s");
//   gmarkers[i].bankfull = Math.round(markerData.getAttribute("x"));
//   gmarkers[i].floodstage = Math.round(markerData.getAttribute("y"));
//   gmarkers[i].temp = Math.round(markerData.getAttribute("g"));
//   gmarkers[i].mintemp = Math.round(markerData.getAttribute("z"));
//   gmarkers[i].maxtemp = Math.round(markerData.getAttribute("a1"));
//   if (dataNew == 1) {
//     var label = new Label({
//       map: map,
//       labelClass: "marker",
//       text: ""
//     });
//     label.bindTo('position', gmarkers[i], 'position');
//     labels.push(label);
//     var tooltip = new Tooltip({
//       map: map
//     });
//     tooltip.bindTo('position', label, 'position');
//     google.maps.event.addDomListener(label.div_, "click", function() {
//       urchinTracker('/From Map ' + datatype);
//       currentSite = gmarkers[i].sitenumber;
//       document.getElementById("selectGauge").style.visibility = "visible";
//       document.getElementById("dataFrame").src = "chron.aspx?sNum=" + gmarkers[i].sitenumber + "&sType=" + datatype + "&sName=" + gmarkers[i].name;
//     });
//     google.maps.event.addDomListener(label.div_, "mouseover", function(e) {
//       label.div_.style.cursor = "pointer";
//       buildToolTip(gmarkers[i]);
//       tooltip.onAdd();
//     });
//     google.maps.event.addDomListener(label.div_, "mouseout", function(e) {
//       tooltip.onRemove();
//     });
//     //gmarkers.push(marker);
//   }else{
//     //gmarkers[num] = marker;
//   }
//   markerData = null;
// }
// function buildToolTip(marker) {
//   tooltiptext = '<b>' + marker.name + ' </b><br />Site number: ' + marker.sitenumber + '<br /><br />';
//   if (marker.wtemp != -998) {
//     tooltiptext = tooltiptext + "<b>Water temperature: </b>" + marker.wtemp + " °F<br />";
//   }
//   if (marker.flow != -998) {
//     tooltiptext = tooltiptext + "<b>Streamflow: </b>" + marker.flow + " cfs<br />";
//   }
//   if (marker.stage != -998 && marker.type != "lake") {
//     tooltiptext = tooltiptext + "<b>River stage: </b>" + marker.stage + " feet<br />";
//   }
//   if (marker.bankfull != -998) {
//     tooltiptext = tooltiptext + "<b>Bank-full stage: </b>" + marker.bankfull + " feet<br />";
//   }
//   if (marker.floodstage != -998) {
//     tooltiptext = tooltiptext + "<b>Flood stage: </b>" + marker.floodstage + " feet<br />";
//   }
//   if (marker.rain != -998) {
//     tooltiptext = tooltiptext + "<b>Rainfall - most recent: </b>" + marker.rain + " in<br />";
//   }
//   if (marker.rain1 != -998) {
//     tooltiptext = tooltiptext + "<b>Rainfall - past hour: </b>" + marker.rain1 + " in<br />";
//   }
//   if (marker.rain2 != -998) {
//     tooltiptext = tooltiptext + "<b>Rainfall - past 2 hours: </b>" + marker.rain2 + " in<br />";
//   }
//   if (marker.rain3 != -998) {
//     tooltiptext = tooltiptext + "<b>Rainfall - past 3 hours: </b>" + marker.rain3 + " in<br />";
//   }
//   if (marker.rain6 != -998) {
//     tooltiptext = tooltiptext + "<b>Rainfall - past 6 hours: </b>" + marker.rain6 + " in<br />";
//   }
//   if (marker.rain12 != -998) {
//     tooltiptext = tooltiptext + "<b>Rainfall - past 12 hours: </b>" + marker.rain12 + " in<br />";
//   }
//   if (marker.raintoday != -998) {
//     tooltiptext = tooltiptext + "<b>Rainfall - since midnight: </b>" + marker.raintoday + " in<br />";
//   }
//   if (marker.rain1day != -998) {
//     tooltiptext = tooltiptext + "<b>Rainfall - past 24 hours: </b>" + marker.rain1day + " in<br />";
//   }
//   if (marker.rain2day != -998) {
//     tooltiptext = tooltiptext + "<b>Rainfall - past 48 hours: </b>" + marker.rain2day + " in<br />";
//   }
//   if (marker.rain1wk != -998) {
//     tooltiptext = tooltiptext + "<b>Rainfall - past week: </b>" + marker.rain1wk + " in<br />";
//   }
//   if (marker.rain2wk != -998) {
//     tooltiptext = tooltiptext + "<b>Rainfall - past 2 weeks: </b>" + marker.rain2wk + " in<br />";
//   }
//   if (marker.temp != -998) {
//     tooltiptext = tooltiptext + "<b>Temperature - current: </b>" + marker.temp + " °F<br />";
//   }
//   if (marker.mintemp != -998) {
//     tooltiptext = tooltiptext + "<b>Temperature - min - since midnight: </b>" + marker.mintemp + " °F<br />";
//   }
//   if (marker.maxtemp != -998) {
//     tooltiptext = tooltiptext + "<b>Temperature - max - since midnight: </b>" + marker.maxtemp + " °F<br />";
//   }
//   if (marker.humidity != -998) {
//     tooltiptext = tooltiptext + "<b>Relative humidity: </b>" + marker.humidity + " %<br />";
//   }
// }