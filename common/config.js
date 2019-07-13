// const host = 'http://192.168.1.4:10881/api/'
const host = 'http://webvirtmgr.coffee-ease.com/gcfapi/'

export const CONFIG = {
  URL: {
    // ----------- 请求链接拼接地址 -----------------
    project: host + 'Project',
		subProject: host + 'SubProject',
		filter: host + 'DetailType',
		house: host + 'Detail'
  },
  multiple (value1, value2) {
    if (!value1 || !value2) {
      return null
    }
    let m = 0
    let s1 = value1.toString()
    let s2 = value2.toString()
    try {
      m += s1.split('.')[1].length
    } catch (e) {
    }
    try {
      m += s2.split('.')[1].length
    } catch (e) {
    }
    return Number(s1.replace('.', '')) * Number(s2.replace('.', '')) / Math.pow(10, m)
  },
  // 三位一撇
  formatMoney (s, type) {
    if (/[^0-9\\.]/.test(s)) {
      return '0'
    }
    if (s == null || s == '') {
      return '0'
    }
    s = s.toString().replace(/^(\d*)$/, '$1.')
    s = (s + '00').replace(/(\d*\.\d\d)\d*/, '$1')
    s = s.replace('.', ',')
    let re = /(\d)(\d{3},)/
    while (re.test(s)) {
      s = s.replace(re, '$1,$2')
    }
    s = s.replace(/,(\d\d)$/, '.$1')
    if (type == 0) { // 不带小数位(默认是有小数位)
      let a = s.split('.')
      if (a[1] == '00') {
        s = a[0]
      }
    }
    return s
  },
  strfmoney (yuan) {
    return '￥' + CONFIG.formatMoney(yuan)
  },
  strftime (sFormat, date) {
    if (!date) {
      return '-'
    }
    let tt = Date.parse(date)
    if (tt < 0) {
      return '-'
    }
    date = new Date(tt)
    // if (!(date instanceof Date)) date = new Date();
    if (!(date instanceof Date)) {
      console.log('not valid')
      return '-'
    }
    let nDay = date.getDay()
    let nDate = date.getDate()
    let nMonth = date.getMonth()
    let nYear = date.getFullYear()
    let nHour = date.getHours()
    let aDays = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday']
    let aMonths = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December']
    let aDayCount = [0, 31, 59, 90, 120, 151, 181, 212, 243, 273, 304, 334]
    let isLeapYear = function () {
      return (nYear % 4 === 0 && nYear % 100 !== 0) || nYear % 400 === 0
    }
    let getThursday = function () {
      let target = new Date(date)
      target.setDate(nDate - ((nDay + 6) % 7) + 3)
      return target
    }
    let zeroPad = function (nNum, nPad) {
      return ((Math.pow(10, nPad) + nNum) + '').slice(1)
    }
    return sFormat.replace(/%[a-z]/gi, function (sMatch) {
      return (({
        '%a': aDays[nDay].slice(0, 3),
        '%A': aDays[nDay],
        '%b': aMonths[nMonth].slice(0, 3),
        '%B': aMonths[nMonth],
        '%c': date.toUTCString(),
        '%C': Math.floor(nYear / 100),
        '%d': zeroPad(nDate, 2),
        '%e': nDate,
        '%F': date.toISOString().slice(0, 10),
        '%G': getThursday().getFullYear(),
        '%g': (getThursday().getFullYear() + '').slice(2),
        '%H': zeroPad(nHour, 2),
        '%I': zeroPad((nHour + 11) % 12 + 1, 2),
        '%j': zeroPad(aDayCount[nMonth] + nDate + ((nMonth > 1 && isLeapYear()) ? 1 : 0), 3),
        '%k': nHour,
        '%l': (nHour + 11) % 12 + 1,
        '%m': zeroPad(nMonth + 1, 2),
        '%n': nMonth + 1,
        '%M': zeroPad(date.getMinutes(), 2),
        '%p': (nHour < 12) ? 'AM' : 'PM',
        '%P': (nHour < 12) ? 'am' : 'pm',
        '%s': Math.round(date.getTime() / 1000),
        '%S': zeroPad(date.getSeconds(), 2),
        '%u': nDay || 7,
        '%V': (function () {
          let target = getThursday()
          let n1stThu = target.valueOf()
          target.setMonth(0, 1)
          let nJan1 = target.getDay()
          if (nJan1 !== 4) target.setMonth(0, 1 + ((4 - nJan1) + 7) % 7)
          return zeroPad(1 + Math.ceil((n1stThu - target) / 604800000), 2)
        })(),
        '%w': nDay,
        '%x': date.toLocaleDateString(),
        '%X': date.toLocaleTimeString(),
        '%y': (nYear + '').slice(2),
        '%Y': nYear,
        '%z': date.toTimeString().replace(/.+GMT([+-]\d+).+/, '$1'),
        '%Z': date.toTimeString().replace(/.+\((.+?)\)$/, '$1')
      }[sMatch] || '') + '') || sMatch
    })
  }
}
