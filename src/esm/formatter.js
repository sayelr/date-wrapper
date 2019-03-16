'use strict';

export default function format(baseDate, formatStr) {
  if (!formatStr || formatStr === '') {
    return baseDate.toString();
  }
  var formattedOutput = '';
  var outputAndRemaining;
  while (formatStr.length > 0) {
    outputAndRemaining = parseNextSegment(formatStr, baseDate);
    formattedOutput += outputAndRemaining[0];
    formatStr = outputAndRemaining[1];
  }
  return formattedOutput;
}

function parseNextSegment(str, baseDate) {
  var keyOrLiteral = findKeyOrLiteral(str, null, true);
  var remaining = str.substring(keyOrLiteral.length);
  var nextPart = formatKey(keyOrLiteral, baseDate);
  return [nextPart, remaining];
}

function findKeyOrLiteral(str, matchKey, first) {
  if (str.length === 0) {
    return '';
  }
  var nextChar = str[0];

  if (matchKey) {
    return matchKey === nextChar ? nextChar + findKeyOrLiteral(str.substring(1), matchKey) : '';
  } else {
    if (charIsKey(nextChar)) {
      return first ? nextChar + findKeyOrLiteral(str.substring(1), nextChar) : '';
    } else {
      return nextChar + findKeyOrLiteral(str.substring(1));
    }
  }
}

function formatKey(key, baseDate) {
  var keyChr = charIsKey(key[0]);
  if (mapper[keyChr] && mapper[keyChr][key]) {
    return mapper[keyChr][key](baseDate);
  }
  return key;
}

function charIsKey(chr) {
  return constants.keys[constants.keys.indexOf(chr)];
}

function padLeft(num, padding) {
  return String(padding + num).slice(-padding.length);
}

var constants = {
  keys: ['M', 'd', 'y', 'm', 'h', 'H', 's', 'f', 't'],
  MMM: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'],
  MMMM: ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'],
  ddd: ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'],
  dddd: ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'],
}

var mapper = {
  M: {
    M: function(date) {
      return (date.getMonth() + 1).toString();
    },
    MM: function(date) {
      return padLeft(date.getMonth() + 1, '00');
    },
    MMM: function(date) {
      return constants.MMM[date.getMonth()];
    },
    MMMM: function(date) {
      return constants.MMMM[date.getMonth()];
    },
  },
  d: {
    d: function(date) {
      return date.getDate().toString();
    },
    dd: function(date) {
      return padLeft((date.getDate()), '00');
    },
    ddd: function(date) {
      return constants.ddd[date.getDay()];
    },
    dddd: function(date) {
      return constants.dddd[date.getDay()];
    },
  },
  y: {
    yy: function(date) {
      return date.getFullYear().toString().substring(2);
    },
    yyyy: function(date) {
      return date.getFullYear().toString();
    },
  },
  h: {
    h: function(date) {
      return this.getHours(date).toString();
    },
    hh: function(date) {
      return padLeft(this.getHours(date), '00');
    },
    getHours: function(date) {
      var hours = date.getHours();
      return hours > 12 ? hours - 12 : hours;
    }
  },
  H: {
    H: function(date) {
      return date.getHours().toString();
    },
    HH: function(date) {
      return padLeft(date.getHours(), '00');
    },
  },
  m: {
    mm: function(date) {
      return padLeft(date.getMinutes(), '00');
    }
  },
  s: {
    ss: function(date) {
      return padLeft(date.getSeconds(), '00');
    }
  },
  f: {
    fff: function(date) {
      return padLeft(date.getMilliseconds(), '000');
    }
  },
  t: {
    tt: function(date) {
      return date.getHours() < 12 ? 'AM' : 'PM';
    }
  }
}