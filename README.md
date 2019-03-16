
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)
[![Build Status](https://travis-ci.org/sayelr/date-wrapper.svg?branch=master)](https://travis-ci.org/sayelr/date-wrapper)
[![codecov](https://codecov.io/gh/sayelr/date-wrapper/branch/master/graph/badge.svg)](https://codecov.io/gh/sayelr/date-wrapper)

# Date Wrapper
A simple library to wrap js dates with extra functionality, easy validation, immutability, chainability, and string formatting 
- **No external dependencies**  

## Usage
**Available as npm package including cjs, esm, umd, and iife**  
```npm install date-wrapper```  

**In browser using script tags**  
(iife or umd)  
```date-wrapper.umd.js```  ```date-wrapper.umd.min.js```     
```date-wrapper.iife.js``` ```date-wrapper.iife.min.js```  

## Features and Examples
**Create an object using strings or standard js Dates**
```javascript
dateWrapper(dateInput, is_ddmmFormat?) => dateWrapper Object
```
```javascript
const D = dateWrapper;  // Alias

D(new Date());     // js Date()

D('2019/01/01');   // yyyy/mm/dd
D('2019/1/1');     // yyyy/m/d

// mm/dd/yyyy format
D('01/01/2019');         // mm/dd/yyyy
D('1/1/2019');           // m/d/yyyy
// pass optional parameter to create using dd/mm/yyyy format
D('31/12/2019', true);   // dd/mm/yyyy
D('1/1/2019', true);     // d/m/yyyy

// separator can be / or -
D('01-01-2019');
```
---
**Invalid dates will return undefined, making for easy string validation**
```javascript
D('13/01/2019');  // undefined       
D('01/32/2019');  // undefined
D('02/29/2019');  // undefined
                  // (leap year)
D('02/29/2020');  // Sat Feb 29 2020 00:00:00
```
---
**Setting the time**
```javascript
.setTime(hours, minutes, seconds, milliseconds) => dateWrapper object 
// returns undefined if arg out of range: (h 0-23, m 0-59, s 0-59, ms 0-999)
```
```javascript
D('01/01/2019');                          // Tue Jan 01 2019 00:00:00              
D('01/01/2019').setTime(8, 30, 59, 999);  // Tue Jan 01 2019 08:30:59
D('01/01/2019').setTime(8);               // Tue Jan 01 2019 08:00:00
```
---
**Adding to or Subtracting from the date**
```javascript
.addDays(days) => dateWrapper object
.addYears(years) => dateWrapper object
```
```javascript
D('01/01/2019').addDays(9);      // Thu Jan 10 2019 00:00:00
D('01/01/2019').addDays(-1);     // Mon Dec 31 2018 00:00:00
D('01/01/2019').addYears(1);     // Wed Jan 01 2020 00:00:00
D('01/01/2019').addYears(-19);   // Sat Jan 01 2000 00:00:00
```
---

**Adding to or Subtracting from the time**
```javascript
.addTime(hours, minutes, seconds, milliseconds) => dateWrapper object
```
```javascript
D('01/01/2019').addTime(25, 10, -20, 0);  // Wed Jan 02 2019 01:09:40
D('01/01/2019').addTime(0, -1);           // Mon Dec 31 2018 23:59:00
```
---

**Immutability and chaining**
```javascript
// all operations create a new copy
var today = D('01/01/2019');               // Tue Jan 01 2019 00:00:00
// chain operations
var dt = today.addDays(32).addYears(1);
var tomorrow = today.addDays(1);           // Wed Jan 02 2019 00:00:00
// today remains unchanged
today;                                     // Tue Jan 01 2019 00:00:00
var jsDate = today.toDate();               
jsDate.setDate(jsDate.getDate() + 10);     // Tue Jan 11 2019 00:00:00
// today remains unchanged
today;                                     // Tue Jan 01 2019 00:00:00
```
---

**Comparing dates with or without the time component**
```javascript
.equals(dateOrDateWrapper, compareIncludingTime?) => boolean
.isOnOrBefore(dateOrDateWrapper, compareIncludingTime?) => boolean
.isBefore(dateOrDateWrapper, compareIncludingTime?) => boolean
.isOnOrAfter(dateOrDateWrapper, compareIncludingTime?) => boolean
.isAfter(dateOrDateWrapper, compareIncludingTime?) => boolean
```
```javascript
// comparison functions accept DateWrapper objects or js Dates
var isSame = D(inputStr).equals(D('1/1/2019'));
var isSame = D(inputStr).equals(new Date(2019, 0, 1));

// examples
var D_now = D(new Date());              // Fri Mar 08 2019 20:46:23
var D_userInput = D(getUserInput());    // Fri Mar 08 2019 00:00:00              

// compare dates ignoring their time
D_userInput.equals(D_now);              // true
// compare dates including their time
D_userInput.equals(D_now, true);        // false

D_userInput.isOnOrAfter(D_now);         // true
D_userInput.isOnOrAfter(D_now, true);   // false
D_userInput.isOnOrBefore(D_now);        // true
D_userInput.isOnOrBefore(D_now, true);  // true
D_userInput.isAfter(D_now);             // false
D_userInput.isAfter(D_now, true);       // false
D_userInput.isBefore(D_now);            // false
D_userInput.isBefore(D_now, true);      // true
```
---

**Timespan between two dates**
```javascript
.from(dateOrDateWrapper) => { 
  days: number, 
  hours: number, 
  minutes: number, 
  seconds: number, 
  ms: number 
}
```
```javascript
var timespan = D(tomorrow).from(D(today));  
// { days: 1, hours: 0, minutes: 0, seconds: 0, ms: 0 }
var timespan = D(today).from(D(tomorrow));  
// { days: -1, hours: 0, minutes: 0, seconds: 0, ms: 0 }
```

---
**Getting first and last days of the current month or year**
```javascript
.firstOfMonth() => DateWrapper object
.lastOfMonth() => DateWrapper object
.firstOfYear() => DateWrapper object
.lastOfYear() => DateWrapper object
```
```javascript
D('05/15/2019').firstOfMonth();  // Wed May 01 2019 00:00:00
D('05/15/2019').lastOfMonth();   // Fri May 31 2019 00:00:00
D('05/15/2019').firstOfYear();   // Tue Jan 01 2019 00:00:00
D('05/15/2019').lastOfYear();    // Tue Dec 31 2019 00:00:00
```
---

**String and js Date representation**
```javascript
.toDate() => Date
.toString() => string   // the default js Date.toString() output
```
---

**Custom formatting using** ```toString()``` **parameter**
```javascript
.toString(formatString) => string
```

|code| example | |code| example | |code| example | |code| example |
|----|---------|-|----|---------|-|----|---------|-|----|---------|
|yyyy|2019     | |M   |1        | |d   |1        | |h   |4        |
|yy  |19       | |MM  |01       | |dd  |01       | |hh  |04       |
|    |         | |MMM |Jan      | |ddd |Tue      | |mm  |29       |
|    |         | |MMMM|January  | |dddd|Tuesday  | |ss  |59       |
|    |         | |    |         | |    |         | |fff |050      | 
|    |         | |    |         | |    |         | |tt  |PM       |
```javascript
var date = D('01/01/2019').setTime(16, 29, 59, 50);
date.toString('MM/dd/yy');                           // '01/01/19'
date.toString('dddd MMMM d, yyyy hh:mm:ss.fff tt');  // 'Tuesday January 1, 2019 04:29:59.050 PM'
var timestamp = date.toString('yyyyMMdd-hhmmss');    // '20190101-042959'
```
