const assert = chai.assert;
var D = dateWrapper;
const inst = 'an instance of DateWrapper';


describe('Initialization', () => {
  it('returns ' + inst + ' when initialized with a Date() object', () => {
    assert(D(new Date()) instanceof dateWrapper);
  });
  it('returns undefined when initialized with an invalid Date() object', () => {
    assert(!D(new Date('asdfasf')));
  });
  it('returns ' + inst + ' when initialized with another DateWrapper object', () => {
    assert(D(D(new Date())) instanceof dateWrapper);
  });
  it('returns undefined if initialized with args other than Date, string, or instance of itself', () => {
    assert(!D(111111));
    assert(!D({}));
    assert(!D([]));
    assert(!D());
  });
  describe('String Parser', () => {
    describe('yyyy/mm/dd format', () => {
      it('returns ' + inst + ' when initialized with a valid yyyymmdd date string', () => {
        assert(D('2000/01/01') instanceof dateWrapper);
        assert(D('2000/12/31') instanceof dateWrapper);
      });
      it('returns undefined when initialized with an invalid yyyymmdd date string', () => {
        assert(!D('2000/00/01') && !D('2000/01/00') && !D('2000/13/01') && !D('2000/01/32') && !D('2000/04/31') && !D('2000/02/30'));
      });
      it('accounts for leap years', () => {
        assert(D('2020/02/29') instanceof dateWrapper);
        assert(!D('2019/02/29'));
      });
    });
    describe('mm/dd/yyyy format', () => {
      it('returns ' + inst + ' when initialized with a valid mmddyyyy date string', () => {
        assert(D('2000/01/01') instanceof dateWrapper);
        assert(D('2000/12/31') instanceof dateWrapper);
      });
      it('returns undefined when initialized with an invalid mmddyyyy date string', () => {
        assert(!D('2000/00/01'));
        assert(!D('2000/01/00'));
        assert(!D('2000/13/01'));
        assert(!D('2000/01/32'));
        assert(!D('2000/04/31'));
        assert(!D('2000/02/30'));
      });
      it('accounts for leap years', () => {
        assert(D('02/29/2020') instanceof dateWrapper);
        assert(!D('02/29/2019'));
      });
    });
    describe('dd/mm/yyyy format', () => {
      it('returns ' + inst + ' when initialized with a valid ddmmyyy date string', () => {
        assert(D('01/01/2000', true) instanceof dateWrapper);
        assert(D('31/12/2000', true) instanceof dateWrapper);
      });
      it('returns undefined when initialized with an invalid ddmmyyy date string', () => {
        assert(!D('00/01/2000', true));
        assert(!D('01/00/2000', true));
        assert(!D('01/13/2000', true));
        assert(!D('32/01/2000', true));
        assert(!D('31/04/2000', true));
        assert(!D('30/02/2000', true));
      });
      it('accounts for leap years', () => {
        assert(D('29/02/2020', true) instanceof dateWrapper);
        assert(!D('29/02/2019', true));
      });
    });
  });
});

describe('Manipulation', () => {
  describe('.addDays(days)', () => {
    it('addDays(10) works', () => {
      const dt = new Date(2000, 0, 1);
      const dtPlus10 = new Date(dt.getTime());
      dtPlus10.setDate(dt.getDate() + 10);
      assert.equal(D('01/01/2000').addDays(10).toDate().getTime(), dtPlus10.getTime());
    });
    it('addDays(-5) works', () => {
      const dt = new Date(2000, 0, 6);
      const dtMinus5 = new Date(dt.getTime());
      dtMinus5.setDate(dt.getDate() - 5);
      assert.equal(D('01/06/2000').addDays(-5).toDate().getTime(), dtMinus5.getTime());
    });
    it('addDays(0) works', () => {
      const dt = new Date(2000, 0, 1);
      assert.equal(D('01/01/2000').addDays(0).toDate().getTime(), dt.getTime());
    });
    it('addDays() returns undefined if arg is not numeric', () => {
      assert(!D('01/01/2000').addDays('s'));
      assert(!D('01/01/2000').addDays());
    });
  });
  describe('.addMonths(months)', () => {
    it('addMonths(10) works', () => {
      const dt = new Date(2000, 0, 1);
      const dtPlus10 = new Date(dt.getTime());
      dtPlus10.setMonth(dt.getMonth() + 10);
      assert.equal(D(dt).addMonths(10).toDate().getTime(), dtPlus10.getTime());
    });
    it('addMonths(-5) works', () => {
      const dt = new Date(2000, 0, 1);
      const dtMinus5 = new Date(dt.getTime());
      dtMinus5.setMonth(dt.getMonth() - 5);
      assert.equal(D('01/01/2000').addMonths(-5).toDate().getTime(), dtMinus5.getTime());
    });
    it('addMonths(0) works', () => {
      const dt = new Date(2000, 0, 1);
      assert.equal(D('01/01/2000').addMonths(0).toDate().getTime(), dt.getTime());
    });
    it('addMonths() returns undefined if arg is not numeric', () => {
      assert(!D('01/01/2000').addMonths('s'));
      assert(!D('01/01/2000').addMonths());
    });
  });
  describe('.addYears(years)', () => {
    it('addYears(10) works', () => {
      const dt = new Date(2000, 0, 1);
      const dtPlus10 = new Date(dt.getTime());
      dtPlus10.setFullYear(dt.getFullYear() + 10);
      assert.equal(D('01/01/2000').addYears(10).toDate().getTime(), dtPlus10.getTime());
    });
    it('addYears(-5) works', () => {
      const dt = new Date(2000, 0, 1);
      const dtMinus5 = new Date(dt.getTime());
      dtMinus5.setFullYear(dt.getFullYear() - 5);
      assert.equal(D('01/01/2000').addYears(-5).toDate().getTime(), dtMinus5.getTime());
    });
    it('addYears(0) works', () => {
      const dt = new Date(2000, 0, 1);
      assert.equal(D('01/01/2000').addYears(0).toDate().getTime(), dt.getTime());
    });
    it('addYears() returns undefined if arg is not numeric', () => {
      assert(!D('01/01/2000').addYears('s'));
      assert(!D('01/01/2000').addYears());
    });
  });
  describe('.addTime(h, m, s, ms)', () => {
    it('addTime(48, 10, 30, 500) works', () => {
      const dt = new Date(2000, 0, 1);
      const dtAddTime = new Date(dt.getTime());
      dtAddTime.setHours(dt.getHours() + 48, dt.getMinutes() + 10, dt.getSeconds() + 30, dt.getMilliseconds() + 500);
      assert.equal(D('01/01/2000').addTime(48, 10, 30, 500).toDate().getTime(), dtAddTime.getTime());
    });
    it('addTime(-48, -10, -30, -500) works', () => {
      const dt = new Date(2000, 0, 1);
      const dtAddTime = new Date(dt.getTime());
      dtAddTime.setHours(dt.getHours() - 48, dt.getMinutes() - 10, dt.getSeconds() - 30, dt.getMilliseconds() - 500);
      assert.equal(D('01/01/2000').addTime(-48, -10, -30, -500).toDate().getTime(), dtAddTime.getTime());
    });
    it('addTime(0, 0, 0, 0) works', () => {
      const dt = new Date(2000, 0, 1);
      const dtAddTime = new Date(dt.getTime());
      assert.equal(D('01/01/2000').addTime(0, 0, 0, 0).toDate().getTime(), dtAddTime.getTime());
    });
    it('addTime() returns undefined if arg is not numeric', () => {
      assert(!D('01/01/2000').addTime('s'));
      assert(!D('01/01/2000').addTime(0, 's'));
      assert(!D('01/01/2000').addTime(0, 0, 's'));
      assert(!D('01/01/2000').addTime(0, 0, 0, 's'));
    });
  });
  describe('.setTime(h, m, s, ms)', () => {
    it('setTime(23, 59, 59, 999) works', () => {
      const dt = new Date(2000, 0, 1);
      dt.setHours(23, 59, 59, 999);
      const dw = D('01/01/2000').setTime(23, 59, 59, 999);
      assert.equal(dw.toDate().getTime(), dt.getTime());
    });
    it('setTime(0, 0, 0, 0) works', () => {
      const dt = new Date(2000, 0, 1);
      const originalTime = dt.getTime();
      dt.setHours(23, 59, 59, 999);
      const dw = D('01/01/2000').setTime(0, 0, 0, 0);
      assert.equal(dw.toDate().getTime(), originalTime);
    });
    it('setTime() returns undefined if args out of range', () => {
      const dw = D('01/01/2000');
      assert(!dw.setTime(24, 0, 0, 0));
      assert(!dw.setTime(0, 60, 0, 0));
      assert(!dw.setTime(0, 0, 60, 0));
      assert(!dw.setTime(0, 0, 0, 1000));
      assert(!dw.setTime(-1, 0, 0, 0));
      assert(!dw.setTime(0, -1, 0, 0));
      assert(!dw.setTime(0, 0, -1, 0));
      assert(!dw.setTime(0, 0, 0, -1));
    });
  });
  describe('.firstOfMonth()', () => {
    it('firstOfMonth() works', () => {
      const first = new Date(2000, 0, 1).getTime();
      assert.equal(D('01/15/2000').firstOfMonth().toDate().getTime(), first);
    });
  });
  describe('.lastOfMonth()', () => {
    it('lastOfMonth() works', () => {
      const last = new Date(2000, 0, 31).getTime();
      assert.equal(D('01/15/2000').lastOfMonth().toDate().getTime(), last);
    });
  });
  describe('.firstOfYear()', () => {
    it('firstOfYear() works', () => {
      const first = new Date(2000, 0, 1).getTime();
      assert.equal(D('01/15/2000').firstOfYear().toDate().getTime(), first);
    });
  });
  describe('.lastOfYear()', () => {
    it('lastOfYear() works', () => {
      const last = new Date(2000, 11, 31).getTime();
      assert.equal(D('01/15/2000').lastOfYear().toDate().getTime(), last);
    });
  });
});

describe('Comparing', () => {
  describe('.equals(date, compareTimes?)', () => {
    it('equals ignoring times works', () => {
      const startOfDay = D('01/01/2000');
      const noon = D('01/01/2000').setTime(12);
      const tomorrow = D('01/02/2000');
      assert(startOfDay.equals(noon));
      assert(!startOfDay.equals(tomorrow));
    });
    it('equals comparing with times works', () => {
      const startOfDay = D('01/01/2000');
      const noon = D('01/01/2000').setTime(12);
      assert(!startOfDay.equals(noon, true));
      assert(startOfDay.equals(D('01/01/2000', true)));
    });
  });
  describe('.isOnOrBefore(date, compareTimes?)', () => {
    it('isOnOrBefore ignoring times works', () => {
      const startOfDay = D('01/01/2000');
      const noon = D('01/01/2000').setTime(12);
      const tomorrow = D('01/02/2000');
      assert(noon.isOnOrBefore(startOfDay));
      assert(startOfDay.isOnOrBefore(tomorrow));
      assert(!tomorrow.isOnOrBefore(startOfDay));
    });
    it('isOnOrBefore comparing with times works', () => {
      const startOfDay = D('01/01/2000');
      const noon = D('01/01/2000').setTime(12);
      const tomorrow = D('01/02/2000');
      assert(!noon.isOnOrBefore(startOfDay, true));
      assert(startOfDay.isOnOrBefore(tomorrow, true));
      assert(!tomorrow.isOnOrBefore(startOfDay, true));
    });
  });
  describe('.isOnOrAfter(date, compareTimes?)', () => {
    it('isOnOrAfter ignoring times works', () => {
      const startOfDay = D('01/01/2000');
      const noon = D('01/01/2000').setTime(12);
      const tomorrow = D('01/02/2000');
      assert(startOfDay.isOnOrAfter(noon));
      assert(!startOfDay.isOnOrAfter(tomorrow));
      assert(tomorrow.isOnOrAfter(startOfDay));
    });
    it('isOnOrAfter comparing with times works', () => {
      const startOfDay = D('01/01/2000');
      const noon = D('01/01/2000').setTime(12);
      const tomorrow = D('01/02/2000');
      assert(!startOfDay.isOnOrAfter(noon, true));
      assert(tomorrow.isOnOrAfter(startOfDay, true));
      assert(!startOfDay.isOnOrAfter(tomorrow, true));
    });
  });
  describe('.isBefore(date, compareTimes?)', () => {
    it('isBefore ignoring times works', () => {
      const startOfDay = D('01/01/2000');
      const noon = D('01/01/2000').setTime(12);
      const tomorrow = D('01/02/2000');
      assert(!startOfDay.isBefore(noon));
      assert(startOfDay.isBefore(tomorrow));
    });
    it('isBefore comparing with times works', () => {
      const startOfDay = D('01/01/2000');
      const noon = D('01/01/2000').setTime(12);
      assert(!noon.isBefore(startOfDay, true));
      assert(startOfDay.isBefore(noon, true));
    });
  });
  describe('.isAfter(date, compareTimes?)', () => {
    it('isAfter ignoring times works', () => {
      const startOfDay = D('01/01/2000');
      const noon = D('01/01/2000').setTime(12);
      const tomorrow = D('01/02/2000');
      assert(!noon.isAfter(startOfDay));
      assert(tomorrow.isAfter(startOfDay));
    });
    it('isAfter comparing with times works', () => {
      const startOfDay = D('01/01/2000');
      const noon = D('01/01/2000').setTime(12);
      assert(!startOfDay.isAfter(noon, true));
      assert(noon.isAfter(startOfDay, true));
    });
  });
  describe('.from(date)', () => {
    it('from() works with Dates or DateWrapper objects', () => {
      assert(D('02/01/2000').from(D('01/01/2000')) instanceof Object);
      assert(D('02/01/2000').from(D(new Date(2000, 0, 1))) instanceof Object);
    });
    it('from() counts timespan days correctly', () => {
      // leap year
      const tsFromFuture = D('02/28/2000').from(D('03/01/2000'));
      const tsFromPast = D('03/01/2000').from(D('02/28/2000'));
      assert.equal(tsFromFuture.days, -2);
      assert.equal(tsFromPast.days, 2);
    });
    it('from() counts timespan time correctly', () => {
      const ts = D('01/01/2000').from(D('01/02/2000').setTime(2, 3, 4, 5));
      assert.equal(ts.days, -1);
      assert.equal(ts.hours, -2);
      assert.equal(ts.minutes, -3);
      assert.equal(ts.seconds, -4);
      assert.equal(ts.ms, -5);
    });
  });
});

describe('Chaining', () => {
  it('Chaining works', () => {
    const date = new Date(2002, 0, 11);
    date.setHours(11, 1, 1, 1);
    const dw = D('01/01/2000').setTime(10).addYears(2).addDays(10).addTime(1, 1, 1, 1);
    assert.equal(date.getTime(), dw.toDate().getTime());
  });
});

describe('Immutability', () => {
  it('returns a new copy when initialized with another DateWrapper object', () => {
    let firstObject = D(new Date());
    let secondObject = D(firstObject);
    firstObject = firstObject.setTime(5,5,5,5);
    assert.notEqual(firstObject.toDate().getTime(), secondObject.toDate().getTime());
  });
  it('contains a new copy of the Date when initialized with a Date', () => {
    const date = new Date();
    const wrapper = D(date);
    date.setHours(3,3,3,3);
    assert.notEqual(date.getTime(), wrapper._baseDate.getTime());
  });
  it('returns a new copy when chained with .addDays()', () => {
    const dw = D(new Date());
    const newDw = dw.addDays(1);
    assert.notEqual(dw, newDw);
    assert.notEqual(dw._baseDate.getTime(), newDw._baseDate.getTime());
  });
  it('returns a new copy when chained with .addYears()', () => {
    const dw = D(new Date());
    const newDw = dw.addYears(1);
    assert.notEqual(dw, newDw);
    assert.notEqual(dw._baseDate.getTime(), newDw._baseDate.getTime());
  });
  it('returns a new copy when chained with .setTime()', () => {
    const dw = D(new Date());
    const newDw = dw.setTime(1, 1, 1, 1);
    assert.notEqual(dw, newDw);
    assert.notEqual(dw._baseDate.getTime(), newDw._baseDate.getTime());
  });
  it('returns a new copy when chained with .addTime()', () => {
    const dw = D(new Date());
    const newDw = dw.addTime(1, 1, 1, 1);
    assert.notEqual(dw, newDw);
    assert.notEqual(dw._baseDate.getTime(), newDw._baseDate.getTime());
  });
  it('returns a new copy when using .toDate()', () => {
    const wrapper = D(new Date());
    const wrapperModifiedToDate = wrapper.toDate();
    wrapperModifiedToDate.setHours(1,3,3,3);
    assert.notEqual(wrapper._baseDate.getTime(), wrapperModifiedToDate.getTime());
  });
});

describe('ToString() Formatting', () => {
  it('key yyyy works', () => {
    const dw = D('07/04/2019').setTime(21, 30, 15, 402);
    assert.equal(dw.toString('yyyy'), '2019');
  });
  it('key yy works', () => {
    const dw = D('07/04/2019').setTime(21, 30, 15, 402);
    assert.equal(dw.toString('yy'), '19');
  });
  it('key M works', () => {
    const dw = D('07/04/2019').setTime(21, 30, 15, 402);
    assert.equal(dw.toString('M'), '7');
  });
  it('key MM works', () => {
    const dw = D('07/04/2019').setTime(21, 30, 15, 402);
    assert.equal(dw.toString('MM'), '07');
  });
  it('key MMM works', () => {
    const dw = D('07/04/2019').setTime(21, 30, 15, 402);
    assert.equal(dw.toString('MMM'), 'Jul');
  });
  it('key MMMM works', () => {
    const dw = D('07/04/2019').setTime(21, 30, 15, 402);
    assert.equal(dw.toString('MMMM'), 'July');
  });
  it('key d works', () => {
    const dw = D('07/04/2019').setTime(21, 30, 15, 402);
    assert.equal(dw.toString('d'), '4');
  });
  it('key dd works', () => {
    const dw = D('07/04/2019').setTime(21, 30, 15, 402);
    assert.equal(dw.toString('dd'), '04');
  });
  it('key ddd works', () => {
    const dw = D('07/04/2019').setTime(21, 30, 15, 402);
    assert.equal(dw.toString('ddd'), 'Thu');
  });
  it('key dddd works', () => {
    const dw = D('07/04/2019').setTime(21, 30, 15, 402);
    assert.equal(dw.toString('dddd'), 'Thursday');
  });
  it('key h works', () => {
    const dw = D('07/04/2019').setTime(21, 30, 15, 402);
    assert.equal(dw.toString('h'), '9');
  });
  it('key hh works', () => {
    const dw = D('07/04/2019').setTime(21, 30, 15, 402);
    assert.equal(dw.toString('hh'), '09');
  });
  it('key HH works', () => {
    const dw = D('07/04/2019').setTime(21, 30, 15, 402);
    assert.equal(dw.toString('HH'), '21');
  });
  it('key mm works', () => {
    const dw = D('07/04/2019').setTime(21, 30, 15, 402);
    assert.equal(dw.toString('mm'), '30');
  });
  it('key ss works', () => {
    const dw = D('07/04/2019').setTime(21, 30, 15, 402);
    assert.equal(dw.toString('ss'), '15');
  });
  it('key fff works', () => {
    const dw = D('07/04/2019').setTime(21, 30, 15, 402);
    assert.equal(dw.toString('fff'), '402');
  });
  it('key tt works', () => {
    const dw = D('07/04/2019');
    assert.equal(dw.toString('tt'), 'AM');
    assert.equal(dw.setTime(21, 30, 15, 402).toString('tt'), 'PM');
  });
  it('long combination works', () => {
    const dw = D('07/04/2019').setTime(21, 30, 15, 402);
    assert.equal(dw.toString('dddd MMMM d, yyyy at h:mm:ss.fff tt'), 'Thursday July 4, 2019 at 9:30:15.402 PM');
  });
});