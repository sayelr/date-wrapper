'use strict';

import { parse, isValidYearRange, isValidJsDate, cloneAsDate } from './util.js';
export { convertToDate, changeDate, changeTime, compare, timeSpanFrom };

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

function changeDate(baseDate, amount, unit) {
  if (regex.posOrNegNum.test(amount)) {
    var dt = new Date(baseDate.getTime());
    switch (unit) {
      case 'y':
        dt.setFullYear(dt.getFullYear() + +amount);
        break;
      case 'm':
        dt.setMonth(dt.getMonth() + +amount);
        break;
      case 'd':
        dt.setDate(dt.getDate() + +amount);
        break;
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

var regex = {
  upTo3digits: /^\d{1,3}$/,
  posOrNegNum: /^-?\d*$/
};