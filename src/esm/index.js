'use strict';

import { convertToDate, changeDate, changeTime, compare, timeSpanFrom } from './core.js';
import format from './formatter.js';

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
export default dateWrapper;