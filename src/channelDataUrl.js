export default function channelDataUrl(senType, siteNum, siteNam, siteOwnerOptional) {
  let lowType = senType
  lowType = lowType.toLowerCase() 
  let siteNumInt = parseInt(siteNum)
  if (typeof siteOwnerOptional === 'undefined') siteOwnerOptional = 'default'
  let lowOwner = siteOwnerOptional
  lowOwner = lowOwner.toLowerCase()
  let siteNum2, siteNum3
  if(lowType == "avmfl1") {
    siteNum = siteNumInt-2 
    siteNum2 = siteNumInt 
    siteNum3 = siteNumInt + 6 
  }
  else if(lowType == "avmle1") {
    siteNum = siteNumInt 
    siteNum2 = siteNumInt + 2 
    siteNum3 = siteNumInt + 8 
  }
  else if(lowType == "windsp") {
    siteNum = siteNumInt 
    siteNum2 = siteNumInt + 1 
    siteNum3 = siteNumInt 
  }
  else {
    siteNum2 = siteNumInt + 2 
    siteNum3 = "" 
  }
  let sName = siteNam.replace(/ /gi,"_")
  sName = escape(sName) 
  return `recent.asp?Snum=${siteNum}&Snum2=${siteNum2}&Snum3=${siteNum3}&Stype=${lowType}&Sname=${siteNam}&own=${lowOwner}`
}
