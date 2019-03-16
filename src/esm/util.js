'use strict';

export { parse, isValidYearRange, isValidJsDate, cloneAsDate };

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
  } else if (dateObj && dateObj.isDateWrapper) {
    return new Date(dateObj._baseDate.getTime());
  }
}

var regex = {
  yyyy: '(19\\d\\d|20\\d\\d)',
  mm: '([1-9]|0[1-9]|1[012])',
  dd: '([1-9]|0[1-9]|[12]\\d|3[01])',
  del: '[/-]'
};