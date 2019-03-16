// eslint-disable-next-line no-unused-vars
var dateWrapper = (function() {
  function dateWrapper(dateInput, is_ddmmFormat) {
    var dw = new dateWrapper.fn.init(dateInput, is_ddmmFormat);
    return dw._baseDate ? dw : undefined;
  }
  
  dateWrapper.fn = dateWrapper.prototype = {};
  
  dateWrapper.fn.init = function(dateInput, is_ddmmFormat) {
    this._baseDate = convertToDate(dateInput, is_ddmmFormat);
    return this;
  }
  
  dateWrapper.fn.setTime = function(hours, minutes, seconds, milliseconds) {
    return dateWrapper(changeTime([hours, minutes, seconds, milliseconds], this._baseDate, true));
  }
  
  dateWrapper.fn.addTime = function(hours, minutes, seconds, milliseconds) {
    return dateWrapper(changeTime([hours, minutes, seconds, milliseconds], this._baseDate));
  }
  
  dateWrapper.fn.addYears = function(years) {
    return dateWrapper(changeDate(this._baseDate, years, 'y'));
  }
  
  dateWrapper.fn.addMonths = function(months) {
    return dateWrapper(changeDate(this._baseDate, months, 'm'));
  }
  
  dateWrapper.fn.addDays = function(days) {
    return dateWrapper(changeDate(this._baseDate, days, 'd'));
  }
  
  dateWrapper.fn.equals = function(compareToDate, compareTimes) {
    return compare(this._baseDate, compareToDate, '=', compareTimes);
  }
  
  dateWrapper.fn.isAfter = function(compareToDate, compareTimes) {
    return compare(this._baseDate, compareToDate, '>', compareTimes);
  }
  
  dateWrapper.fn.isBefore = function(compareToDate, compareTimes) {
    return compare(this._baseDate, compareToDate, '<', compareTimes);
  }
  
  dateWrapper.fn.isOnOrAfter = function(compareToDate, compareTimes) {
    return compare(this._baseDate, compareToDate, '>=', compareTimes);
  }
  
  dateWrapper.fn.isOnOrBefore = function(compareToDate, compareTimes) {
    return compare(this._baseDate, compareToDate, '<=', compareTimes);
  }
  
  dateWrapper.fn.firstOfMonth = function() {
    return dateWrapper(new Date(this._baseDate.getFullYear(), this._baseDate.getMonth(), 1));
  }
  
  dateWrapper.fn.lastOfMonth = function() {
    return dateWrapper(new Date(this._baseDate.getFullYear(), this._baseDate.getMonth() + 1, 0));
  }
  
  dateWrapper.fn.firstOfYear = function() {
    return dateWrapper(new Date(this._baseDate.getFullYear(), 0, 1));
  }
  
  dateWrapper.fn.lastOfYear = function() {
    return dateWrapper(new Date(this._baseDate.getFullYear(), 11, 31));
  }
  
  dateWrapper.fn.from = function(compareToDate) {
    return timeSpanFrom(this._baseDate, compareToDate)
  }
  
  dateWrapper.fn.toDate = function() {
    return new Date(this._baseDate.getTime());
  }
  
  dateWrapper.fn.toString = function(str) {
    return format(this._baseDate, str);
  }
  
  dateWrapper.fn.isDateWrapper = true;
  dateWrapper.fn.init.prototype = dateWrapper.fn;

  // -------------------------------CORE--------------------------------
  var regex = {
    yyyy: '(19\\d\\d|20\\d\\d)',
    mm: '([1-9]|0[1-9]|1[012])',
    dd: '([1-9]|0[1-9]|[12]\\d|3[01])',
    del: '[/-]',
    upTo3digits: /^\d{1,3}$/,
    posOrNegNum: /^-?\d*$/
  };

  function convertToDate(dateInput, is_ddmmFormat) {
    if (dateInput) {
      if (isValidJsDate(dateInput)) {
        return new Date(dateInput.getTime());
      } else if (dateInput.isDateWrapper) {
        return new Date(dateInput._baseDate.getTime());
      } else if (typeof dateInput === 'string') {
        return parse(dateInput, is_ddmmFormat);
      }
    }
  }

  function changeDate(baseDate, amount, amtType) {
    if (regex.posOrNegNum.test(amount)) {
      var dt = new Date(baseDate.getTime());
      switch (amtType) {
        case 'y':
          dt.setFullYear(dt.getFullYear() + +amount);
          break;
        case 'm':
          dt.setMonth(dt.getMonth() + +amount);
          break;
        case 'd':
          dt.setDate(dt.getDate() + +amount);
      }

      if (isValidYearRange(dt)) {
        return dt;
      }
    }
  }

  function changeTime(args, baseDate, restrict) {
    var valid = restrict ? regex.upTo3digits : regex.posOrNegNum;
    for (var i in args) {
      var arg = args[i];
      if (arg && !valid.test(arg)) {
        return;
      }
      args[i] = arg ? +arg : 0;
    }

    var dt = new Date(baseDate.getTime());
    if (restrict) {
      if (args[0] < 24 && args[1] < 60 && args[2] < 60 && args[3] < 1000) {
        dt.setHours(args[0], args[1], args[2], args[3]);
        return dt;
      }
    } else {
      dt.setHours(dt.getHours() + args[0], dt.getMinutes() + args[1], dt.getSeconds() + args[2], dt.getMilliseconds() + args[3]);
      if (isValidYearRange(dt)) {
        return dt;
      }
    }
  }

  function compare(baseDate, compareToDate, comparator, compareTimes) {
    var compareTo = cloneAsDate(compareToDate);
    if (!compareTo) {
      return;
    }

    var current = new Date(baseDate.getTime());
    if (!compareTimes) {
      compareTo.setHours(0, 0, 0, 0);
      current.setHours(0, 0, 0, 0);
    }

    switch (comparator) {
      case '=':
        return current.getTime() === compareTo.getTime();
      case '>':
        return current.getTime() > compareTo.getTime();
      case '<':
        return current.getTime() < compareTo.getTime();
      case '>=':
        return current.getTime() >= compareTo.getTime();
      case '<=':
        return current.getTime() <= compareTo.getTime();
    }
  }

  function timeSpanFrom(baseDate, compareToDate) {
    var compareTo = cloneAsDate(compareToDate);
    if (!compareTo) {
      return;
    }

    var returnObj = {
      days: 0,
      hours: 0,
      minutes: 0,
      seconds: 0,
      ms: 0
    };

    var timespanMs = baseDate.getTime() - compareTo.getTime();
    var rounder = timespanMs > 0 ? Math.floor : Math.ceil;

    returnObj.days = rounder(timespanMs / (1000 * 60 * 60 * 24));
    timespanMs -=  returnObj.days * 1000 * 60 * 60 * 24;
    returnObj.hours = rounder(timespanMs / (1000 * 60 * 60));
    timespanMs -= returnObj.hours * 1000 * 60 * 60;
    returnObj.minutes = rounder(timespanMs / (1000 * 60));
    timespanMs -= returnObj.minutes * 1000 * 60;
    returnObj.seconds = rounder(timespanMs / 1000);
    returnObj.ms = timespanMs - (returnObj.seconds * 1000);

    return returnObj;
  }

  function format(baseDate, formatStr) {
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

  // ------------------------------UTILITY------------------------------
  function parse (dateInput, is_ddmmFormat) {
    var matches;

    var yyyymmdd = new RegExp('^' + regex.yyyy + regex.del + regex.mm + regex.del + regex.dd + '$');
    matches = yyyymmdd.exec(dateInput);
    if (matches && isValidDate(+matches[1], +matches[2], +matches[3])) {
      return new Date(+matches[1], +matches[2] - 1, +matches[3]);
    }

    if (is_ddmmFormat) {
      var ddmmyyyy = new RegExp('^' + regex.dd + regex.del + regex.mm + regex.del + regex.yyyy + '$');
      matches = ddmmyyyy.exec(dateInput);
      if (matches && isValidDate(+matches[3], +matches[2], +matches[1])) {
        return new Date(+matches[3], +matches[2] - 1, +matches[1]);
      }
    } else {
      var mmddyyyy = new RegExp('^' + regex.mm + regex.del + regex.dd + regex.del + regex.yyyy + '$');
      matches = mmddyyyy.exec(dateInput);
      if (matches && isValidDate(+matches[3], +matches[1], +matches[2])) {
        return new Date(+matches[3], +matches[1] - 1, +matches[2]);
      }
    }
  }

  function isValidDate (y, m, d) {
    if (m === 2) {
      if (d < 29) {
        return true;
      } else if (d > 29) {
        return false;
      }
      return (!(y % 4) && (y % 100)) || !(y % 400);
    } else {
      return d <= [31, 28, 31, 30, 31, 30, 31, 31, 30, 31, 30, 31][m - 1];
    }
  }

  function isValidYearRange (date) {
    var year = date.getFullYear();
    return year >= 1900 && year < 2100;
  }

  function isValidJsDate(obj) {
    return Object.prototype.toString.call(obj) === "[object Date]" && !isNaN(obj.getTime());
  }

  function cloneAsDate(dateObj) {
    if (isValidJsDate(dateObj)) {
      return new Date(dateObj.getTime());
    } else if (dateObj.isDateWrapper) {
      return new Date(dateObj._baseDate.getTime());
    }
  }

  // -----------------------------TOSTRING------------------------------
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

  dateWrapper.fn.init.prototype = dateWrapper.fn;
  return dateWrapper;
})();
