/**
 * @flow
 */

import expect from 'expect.js';
import M from 'moment';
import { DateRange, extendMoment } from './moment-range';

const moment = extendMoment(M);

describe('Moment', function() {
  let dr = moment.range(new Date(Date.UTC(2011, 2, 5)), new Date(Date.UTC(2011, 5, 5)));
  const m1 = moment('2011-04-15', 'YYYY-MM-DD');
  const m2 = moment('2012-12-25', 'YYYY-MM-DD');
  const mStart = moment('2011-03-05', 'YYYY-MM-DD');
  const mEnd = moment('2011-06-05', 'YYYY-MM-DD');
  const or = moment.range(null, '2011-05-05');
  const or2 = moment.range('2011-03-05', null);

  describe('#range()', function() {
    it('should return a DateRange with start & end properties', function() {
      dr = moment.range(m1, m2);
      expect(moment.isMoment(dr.start)).to.be(true);
      expect(moment.isMoment(dr.end)).to.be(true);
    });

    it('should support string units like `year`, `month`, `week`, `day`, `minute`, `second`, etc...', function() {
      dr = m1.range('year');
      expect(dr.start.valueOf()).to.equal(moment(m1).startOf('year').valueOf());
      expect(dr.end.valueOf()).to.equal(moment(m1).endOf('year').valueOf());
    });
  });

  describe('#within()', function() {
    it('should determine if the current moment is within a given range', function() {
      expect(m1.within(dr)).to.be(true);
      expect(m2.within(dr)).to.be(false);
      expect(m1.within(or)).to.be(true);
      expect(m1.within(or2)).to.be(true);
      expect(m2.within(or)).to.be(false);
      expect(m2.within(or2)).to.be(true);
    });

    it('should consider the edges to be within the range', function() {
      expect(mStart.within(dr)).to.be(true);
      expect(mEnd.within(dr)).to.be(true);
    });
  });
});

describe('DateRange', function() {
  const d1 = new Date(Date.UTC(2011, 2, 5));
  const d2 = new Date(Date.UTC(2011, 5, 5));
  const d3 = new Date(Date.UTC(2011, 4, 9));
  const d4 = new Date(Date.UTC(1988, 0, 1));
  const m1 = moment.utc('06-05-1996', 'MM-DD-YYYY');
  const m2 = moment.utc('11-05-1996', 'MM-DD-YYYY');
  const m3 = moment.utc('08-12-1996', 'MM-DD-YYYY');
  const m4 = moment.utc('01-01-2012', 'MM-DD-YYYY');
  const sStart = '1996-08-12T00:00:00.000Z';
  const sEnd = '2012-01-01T00:00:00.000Z';

  describe('constructor', function() {
    it('should allow initialization with date string', function() {
      const dr = moment.range(sStart, sEnd);

      expect(moment.isMoment(dr.start)).to.be(true);
      expect(moment.isMoment(dr.end)).to.be(true);
    });

    it('should allow initialization with Date object', function() {
      const dr = moment.range(d1, d2);

      expect(moment.isMoment(dr.start)).to.be(true);
      expect(moment.isMoment(dr.end)).to.be(true);
    });

    it('should allow initialization with Moment object', function() {
      const dr = moment.range(m1, m2);

      expect(moment.isMoment(dr.start)).to.be(true);
      expect(moment.isMoment(dr.end)).to.be(true);
    });

    it('should allow initialization with an ISO 8601 Time Interval string', function() {
      const start = '2015-01-17T09:50:04+00:00';
      const end   = '2015-04-17T08:29:55+00:00';
      const dr = moment.range(start + '/' + end);

      expect(moment.utc(start).isSame(dr.start)).to.be(true);
      expect(moment.utc(end).isSame(dr.end)).to.be(true);
    });

    it('should allow initialization with an array', function() {
      const dr = moment.range([m1, m2]);

      expect(m1.isSame(dr.start)).to.be(true);
      expect(m2.isSame(dr.end)).to.be(true);
    });

    it('should allow initialization with open-ended ranges', function() {
      let dr = moment.range(null, m1);

      expect(moment.isMoment(dr.start)).to.be(true);

      dr = moment.range(m1, null);

      expect(moment.isMoment(dr.end)).to.be(true);
    });

    it('should allow initialization without any arguments', function() {
      const dr = moment.range();

      expect(moment.isMoment(dr.start)).to.be(true);
      expect(moment.isMoment(dr.end)).to.be(true);
    });

    it('should allow initialization with undefined arguments', function() {
      const dr = moment.range(undefined, undefined);

      expect(moment.isMoment(dr.start)).to.be(true);
      expect(moment.isMoment(dr.end)).to.be(true);
    });
  });

  describe('#clone()', function() {
    it('should deep clone range', function() {
      const dr1 = moment().range(sStart, sEnd);
      const dr2 = dr1.clone();

      dr2.start.add('days', 2);
      expect(dr1.start.toDate()).to.not.equal(dr2.start.toDate());
    });
  });

  describe('#by()', function() {
    it('should iterate correctly by range', function() {
      const acc = [];
      const d1 = new Date(Date.UTC(2012, 2, 1));
      const d2 = new Date(Date.UTC(2012, 2, 5));
      const dr1 = moment.range(d1, d2);
      const dr2 = 1000 * 60 * 60 * 24;

      dr1.by(dr2, function(m) {
        acc.push(m);
      });

      expect(acc.length).to.eql(5);
      expect(acc[0].utc().date()).to.eql(1);
      expect(acc[1].utc().date()).to.eql(2);
      expect(acc[2].utc().date()).to.eql(3);
      expect(acc[3].utc().date()).to.eql(4);
      expect(acc[4].utc().date()).to.eql(5);
    });

    it('should iterate correctly by duration', function() {
      const acc = [];
      const d1 = new Date(Date.UTC(2014, 9, 6, 0, 0));
      const d2 = new Date(Date.UTC(2014, 9, 6, 23, 59));
      const dr1 = moment.range(d1, d2);
      const dr2 = moment.duration(15, 'minutes');

      dr1.by(dr2, function(m) {
        acc.push(m);
      });

      expect(acc.length).to.eql(96);
      expect(acc[0].minute()).to.eql(0);
      expect(acc[95].minute()).to.eql(45);
    });

    it('should iterate correctly by shorthand string', function() {
      const acc = [];
      const d1 = new Date(Date.UTC(2012, 2, 1));
      const d2 = new Date(Date.UTC(2012, 2, 5));
      const dr1 = moment.range(d1, d2);
      const dr2 = 'days';

      dr1.by(dr2, function(m) {
        acc.push(m);
      });

      expect(acc.length).to.eql(5);
      expect(acc[0].utc().date()).to.eql(1);
      expect(acc[1].utc().date()).to.eql(2);
      expect(acc[2].utc().date()).to.eql(3);
      expect(acc[3].utc().date()).to.eql(4);
      expect(acc[4].utc().date()).to.eql(5);
    });

    it('should iterate correctly by year over a Date-constructed range when leap years are involved', function() {
      const acc = [];
      const d1 = new Date(Date.UTC(2011, 1, 1));
      const d2 = new Date(Date.UTC(2013, 1, 1));
      const dr1 = moment.range(d1, d2);
      const dr2 = 'years';

      dr1.by(dr2, function(m) {
        acc.push(m.utc().year());
      });

      expect(acc).to.eql([2011, 2012, 2013]);
    });

    it('should iterate correctly by year over a moment()-constructed range when leap years are involved', function() {
      const acc = [];
      const dr1 = moment.range(moment('2011', 'YYYY'), moment('2013', 'YYYY'));
      const dr2 = 'years';

      dr1.by(dr2, function(m) {
        acc.push(m.year());
      });

      expect(acc).to.eql([2011, 2012, 2013]);
    });

    it('should iterate correctly by month over a moment()-constructed range when leap years are involved', function() {
      const acc = [];
      const dr1 = moment.range(moment.utc('2012-01', 'YYYY-MM'), moment.utc('2012-03', 'YYYY-MM'));
      const dr2 = 'months';

      dr1.by(dr2, function(m) {
        acc.push(m.utc().format('YYYY-MM'));
      });

      expect(acc).to.eql(['2012-01', '2012-02', '2012-03']);
    });

    it('should iterate correctly by month over a Date-contstructed range when leap years are involved', function() {
      const acc = [];
      const d1 = new Date(Date.UTC(2012, 0));
      const d2 = new Date(Date.UTC(2012, 2));
      const dr1 = moment.range(d1, d2);
      const dr2 = 'months';

      dr1.by(dr2, function(m) {
        acc.push(m.utc().format('YYYY-MM'));
      });

      expect(acc).to.eql(['2012-01', '2012-02', '2012-03']);
    });

    it('should not include .end in the iteration if exclusive is set to true when iterating by string', function() {
      const my1 = moment('2014-04-02T00:00:00.000Z');
      const my2 = moment('2014-04-04T00:00:00.000Z');
      const dr1 = moment.range(my1, my2);
      let acc = [];

      dr1.by('d', (function(d) {
        acc.push(d.utc().format('YYYY-MM-DD'));
      }), false);

      expect(acc).to.eql(['2014-04-02', '2014-04-03', '2014-04-04']);

      acc = [];

      dr1.by('d', (function(d) {
        acc.push(d.utc().format('YYYY-MM-DD'));
      }), true);

      expect(acc).to.eql(['2014-04-02', '2014-04-03']);

      acc = [];

      dr1.by('d', (function(d) {
        acc.push(d.utc().format('YYYY-MM-DD'));
      }));

      expect(acc).to.eql(['2014-04-02', '2014-04-03', '2014-04-04']);
    });

    it('should not include .end in the iteration if exclusive is set to true when iterating by range', function() {
      const my1 = moment('2014-04-02T00:00:00.000Z');
      const my2 = moment('2014-04-04T00:00:00.000Z');
      const dr1 = moment.range(my1, my2);
      const dr2 = moment.range(my1, moment('2014-04-03T00:00:00.000Z'));
      let acc = [];

      dr1.by(dr2, function(d) {
        acc.push(d.utc().format('YYYY-MM-DD'));
      });

      expect(acc).to.eql(['2014-04-02', '2014-04-03', '2014-04-04']);

      acc = [];

      dr1.by(dr2, (function(d) {
        acc.push(d.utc().format('YYYY-MM-DD'));
      }), false);

      expect(acc).to.eql(['2014-04-02', '2014-04-03', '2014-04-04']);

      acc = [];

      dr1.by(dr2, (function(d) {
        acc.push(d.utc().format('YYYY-MM-DD'));
      }), true);

      expect(acc).to.eql(['2014-04-02', '2014-04-03']);
    });

    it('should be exlusive when using by with minutes as well', function() {
      const d1 = moment('2014-01-01T00:00:00.000Z');
      const d2 = moment('2014-01-01T00:06:00.000Z');
      const dr = moment.range(d1, d2);
      let acc = [];

      dr.by('m', (function(d) {
        acc.push(d.utc().format('mm'));
      }));

      expect(acc).to.eql(['00', '01', '02', '03', '04', '05', '06']);

      acc = [];

      dr.by('m', (function(d) {
        acc.push(d.utc().format('mm'));
      }), true);

      expect(acc).to.eql(['00', '01', '02', '03', '04', '05']);
    });
  });

  describe('#toArray()', function() {
    it('should return array by range', function() {
      const d1 = new Date(Date.UTC(2012, 2, 1));
      const d2 = new Date(Date.UTC(2012, 2, 5));
      const dr1 = moment.range(d1, d2);
      const dr2 = 1000 * 60 * 60 * 24;

      const acc = dr1.toArray(dr2);

      expect(acc.length).to.eql(5);
      expect(acc[0].utc().date()).to.eql(1);
      expect(acc[1].utc().date()).to.eql(2);
      expect(acc[2].utc().date()).to.eql(3);
      expect(acc[3].utc().date()).to.eql(4);
      expect(acc[4].utc().date()).to.eql(5);
    });

    it('should return array by shorthand string with exclusive', function() {
      const d1 = new Date(Date.UTC(2012, 2, 1));
      const d2 = new Date(Date.UTC(2012, 2, 5));
      const dr1 = moment.range(d1, d2);
      const dr2 = 'days';

      const acc = dr1.toArray(dr2, true);

      expect(acc.length).to.eql(4);
      expect(acc[0].utc().date()).to.eql(1);
      expect(acc[1].utc().date()).to.eql(2);
      expect(acc[2].utc().date()).to.eql(3);
      expect(acc[3].utc().date()).to.eql(4);
    });
  });

  describe('#contains()', function() {
    it('should work with Date objects', function() {
      const dr = moment.range(d1, d2);

      expect(dr.contains(d3)).to.be(true);
      expect(dr.contains(d4)).to.be(false);
    });

    it('should work with Moment objects', function() {
      const dr = moment.range(m1, m2);

      expect(dr.contains(m3)).to.be(true);
      expect(dr.contains(m4)).to.be(false);
    });

    it('should work with DateRange objects', function() {
      const dr1 = moment.range(m1, m4);
      const dr2 = moment.range(m3, m2);

      expect(dr1.contains(dr2)).to.be(true);
      expect(dr2.contains(dr1)).to.be(false);
    });

    it('should be an inclusive comparison', function() {
      const dr1 = moment.range(m1, m4);

      expect(dr1.contains(m1)).to.be(true);
      expect(dr1.contains(m4)).to.be(true);
      expect(dr1.contains(dr1)).to.be(true);
    });

    it('should be exlusive when the exclusive param is set', function() {
      const dr1 = moment.range(m1, m2);

      expect(dr1.contains(dr1, true)).to.be(false);
      expect(dr1.contains(dr1, false)).to.be(true);
      expect(dr1.contains(dr1)).to.be(true);
      expect(dr1.contains(m2, true)).to.be(false);
      expect(dr1.contains(m2, false)).to.be(true);
      expect(dr1.contains(m2)).to.be(true);
    });
  });

  describe('#overlaps()', function() {
    it('should work with DateRange objects', function() {
      const dr1 = moment.range(m1, m2);
      const dr2 = moment.range(m3, m4);
      const dr3 = moment.range(m2, m4);
      const dr4 = moment.range(m1, m3);

      expect(dr1.overlaps(dr2)).to.be(true);
      expect(dr1.overlaps(dr3)).to.be(false);
      expect(dr4.overlaps(dr3)).to.be(false);
    });
  });

  describe('#intersect()', function() {
    const d5 = new Date(Date.UTC(2011, 2, 2));
    const d6 = new Date(Date.UTC(2011, 4, 4));
    const d7 = new Date(Date.UTC(2011, 6, 6));
    const d8 = new Date(Date.UTC(2011, 8, 8));

    it('should work with [---{==]---} overlaps where (a=[], b={})', function() {
      const dr1 = moment.range(d5, d7);
      const dr2 = moment.range(d6, d8);

      expect(dr1.intersect(dr2).isSame(moment.range(d6, d7))).to.be(true);
    });

    it('should work with {---[==}---] overlaps where (a=[], b={})', function() {
      const dr1 = moment.range(d6, d8);
      const dr2 = moment.range(d5, d7);

      expect(dr1.intersect(dr2).isSame(moment.range(d6, d7))).to.be(true);
    });

    it('should work with [{===]---} overlaps where (a=[], b={})', function() {
      const dr1 = moment.range(d5, d6);
      const dr2 = moment.range(d5, d7);

      expect(dr1.intersect(dr2).isSame(moment.range(d5, d6))).to.be(true);
    });

    it('should work with {[===}---] overlaps where (a=[], b={})', function() {
      const dr1 = moment.range(d5, d7);
      const dr2 = moment.range(d5, d6);

      expect(dr1.intersect(dr2).isSame(moment.range(d5, d6))).to.be(true);
    });

    it('should work with [---{===]} overlaps where (a=[], b={})', function() {
      const dr1 = moment.range(d5, d7);
      const dr2 = moment.range(d6, d7);

      expect(dr1.intersect(dr2).isSame(moment.range(d6, d7))).to.be(true);
    });

    it('should work with {---[===}] overlaps where (a=[], b={})', function() {
      const dr1 = moment.range(d6, d7);
      const dr2 = moment.range(d5, d7);

      expect(dr1.intersect(dr2).isSame(moment.range(d6, d7))).to.be(true);
    });

    it('should work with [---] {---} overlaps where (a=[], b={})', function() {
      const dr1 = moment.range(d5, d6);
      const dr2 = moment.range(d7, d8);

      expect(dr1.intersect(dr2)).to.be(null);
    });

    it('should work with {---} [---] overlaps where (a=[], b={})', function() {
      const dr1 = moment.range(d7, d8);
      const dr2 = moment.range(d5, d6);

      expect(dr1.intersect(dr2)).to.be(null);
    });

    it('should work with [---]{---} overlaps where (a=[], b={})', function() {
      const dr1 = moment.range(d5, d6);
      const dr2 = moment.range(d6, d7);

      expect(dr1.intersect(dr2)).to.be(null);
    });

    it('should work with {---}[---] overlaps where (a=[], b={})', function() {
      const dr1 = moment.range(d6, d7);
      const dr2 = moment.range(d5, d6);
      expect(dr1.intersect(dr2)).to.be(null);
    });

    it('should work with {--[===]--} overlaps where (a=[], b={})', function() {
      const dr1 = moment.range(d6, d7);
      const dr2 = moment.range(d5, d8);

      expect(dr1.intersect(dr2).isSame(dr1)).to.be(true);
    });

    it('should work with [--{===}--] overlaps where (a=[], b={})', function() {
      const dr1 = moment.range(d5, d8);
      const dr2 = moment.range(d6, d7);

      expect(dr1.intersect(dr2).isSame(dr2)).to.be(true);
    });

    it('should work with [{===}] overlaps where (a=[], b={})', function() {
      const dr1 = moment.range(d5, d6);
      const dr2 = moment.range(d5, d6);

      expect(dr1.intersect(dr2).isSame(dr2)).to.be(true);
    });

    it('should work with [--{}--] overlaps where (a=[], b={})', function() {
      const dr1 = moment.range(d6, d6);
      const dr2 = moment.range(d5, d7);

      expect(dr1.intersect(dr2).isSame(dr1)).to.be(true);
    });
  });

  describe('#add()', function() {
    const d5 = new Date(Date.UTC(2011, 2, 2));
    const d6 = new Date(Date.UTC(2011, 4, 4));
    const d7 = new Date(Date.UTC(2011, 6, 6));
    const d8 = new Date(Date.UTC(2011, 8, 8));

    it('should add ranges with [---{==]---} overlaps where (a=[], b={})', function() {
      const dr1 = moment.range(d5, d7);
      const dr2 = moment.range(d6, d8);

      expect(dr1.add(dr2).isSame(moment.range(d5, d8))).to.be(true);
    });

    it('should add ranges with {---[==}---] overlaps where (a=[], b={})', function() {
      const dr1 = moment.range(d6, d8);
      const dr2 = moment.range(d5, d7);

      expect(dr1.add(dr2).isSame(moment.range(d5, d8))).to.be(true);
    });

    it('should add ranges with [{===]---} overlaps where (a=[], b={})', function() {
      const dr1 = moment.range(d5, d6);
      const dr2 = moment.range(d5, d7);

      expect(dr1.add(dr2).isSame(moment.range(d5, d7))).to.be(true);
    });

    it('should add ranges with {[===}---] overlaps where (a=[], b={})', function() {
      const dr1 = moment.range(d5, d7);
      const dr2 = moment.range(d5, d6);

      expect(dr1.add(dr2).isSame(moment.range(d5, d7))).to.be(true);
    });

    it('should add ranges with [---{===]} overlaps where (a=[], b={})', function() {
      const dr1 = moment.range(d5, d7);
      const dr2 = moment.range(d6, d7);

      expect(dr1.add(dr2).isSame(moment.range(d5, d7))).to.be(true);
    });

    it('should add ranges with {---[===}] overlaps where (a=[], b={})', function() {
      const dr1 = moment.range(d6, d7);
      const dr2 = moment.range(d5, d7);

      expect(dr1.add(dr2).isSame(moment.range(d5, d7))).to.be(true);
    });

    it('should not add ranges with [---] {---} overlaps where (a=[], b={})', function() {
      const dr1 = moment.range(d5, d6);
      const dr2 = moment.range(d7, d8);

      expect(dr1.add(dr2)).to.be(null);
    });

    it('should not add ranges with {---} [---] overlaps where (a=[], b={})', function() {
      const dr1 = moment.range(d7, d8);
      const dr2 = moment.range(d5, d6);

      expect(dr1.add(dr2)).to.be(null);
    });

    it('should not add ranges with [---]{---} overlaps where (a=[], b={})', function() {
      const dr1 = moment.range(d5, d6);
      const dr2 = moment.range(d6, d7);

      expect(dr1.add(dr2)).to.be(null);
    });

    it('should not add ranges with {---}[---] overlaps where (a=[], b={})', function() {
      const dr1 = moment.range(d6, d7);
      const dr2 = moment.range(d5, d6);

      expect(dr1.add(dr2)).to.be(null);
    });

    it('should add ranges {--[===]--} overlaps where (a=[], b={})', function() {
      const dr1 = moment.range(d6, d7);
      const dr2 = moment.range(d5, d8);

      expect(dr1.add(dr2).isSame(moment.range(d5, d8))).to.be(true);
    });

    it('should add ranges [--{===}--] overlaps where (a=[], b={})', function() {
      const dr1 = moment.range(d5, d8);
      const dr2 = moment.range(d6, d7);

      expect(dr1.add(dr2).isSame(moment.range(d5, d8))).to.be(true);
    });

    it('should add ranges [{===}] overlaps where (a=[], b={})', function() {
      const dr1 = moment.range(d5, d6);
      const dr2 = moment.range(d5, d6);

      expect(dr1.add(dr2).isSame(moment.range(d5, d6))).to.be(true);
    });
  });

  describe('#subtract()', function() {
    const d5 = new Date(Date.UTC(2011, 2, 2));
    const d6 = new Date(Date.UTC(2011, 4, 4));
    const d7 = new Date(Date.UTC(2011, 6, 6));
    const d8 = new Date(Date.UTC(2011, 8, 8));

    it('should turn [--{==}--] into (--) (--) where (a=[], b={})', function() {
      const dr1 = moment.range(d5, d8);
      const dr2 = moment.range(d6, d7);

      expect(dr1.subtract(dr2)).to.eql([moment.range(d5, d6), moment.range(d7, d8)]);
    });

    it('should turn {--[==]--} into () where (a=[], b={})', function() {
      const dr1 = moment.range(d6, d7);
      const dr2 = moment.range(d5, d8);

      expect(dr1.subtract(dr2)).to.eql([]);
    });

    it('should turn {[==]} into () where (a=[], b={})', function() {
      const dr1 = moment.range(d5, d6);
      const dr2 = moment.range(d5, d6);

      expect(dr1.subtract(dr2)).to.eql([]);
    });

    it('should turn [--{==]--} into (--) where (a=[], b={})', function() {
      const dr1 = moment.range(d5, d7);
      const dr2 = moment.range(d6, d8);

      expect(dr1.subtract(dr2)).to.eql([moment.range(d5, d6)]);
    });

    it('should turn [--{==]} into (--) where (a=[], b={})', function() {
      const dr1 = moment.range(d5, d7);
      const dr2 = moment.range(d6, d7);

      expect(dr1.subtract(dr2)).to.eql([moment.range(d5, d6)]);
    });

    it('should turn {--[==}--] into (--) where (a=[], b={})', function() {
      const dr1 = moment.range(d6, d8);
      const dr2 = moment.range(d5, d7);

      expect(dr1.subtract(dr2)).to.eql([moment.range(d7, d8)]);
    });

    it('should turn {[==}--] into (--) where (a=[], b={})', function() {
      const dr1 = moment.range(d6, d8);
      const dr2 = moment.range(d6, d7);

      expect(dr1.subtract(dr2)).to.eql([moment.range(d7, d8)]);
    });

    it('should turn [--] {--} into (--) where (a=[], b={})', function() {
      const dr1 = moment.range(d5, d6);
      const dr2 = moment.range(d7, d8);

      expect(dr1.subtract(dr2)).to.eql([dr1]);
    });

    it('should turn {--} [--] into (--) where (a=[], b={})', function() {
      const dr1 = moment.range(d7, d8);
      const dr2 = moment.range(d5, d6);

      expect(dr1.subtract(dr2)).to.eql([dr1]);
    });

    it('should turn [--{==}--] into (--) where (a=[], b={})', function() {
      const o = moment.range('2015-04-07T00:00:00+00:00/2015-04-08T00:00:00+00:00');
      const s = moment.range('2015-04-07T17:12:18+00:00/2015-04-07T17:12:18+00:00');
      expect(o.subtract(s)).to.eql([moment.range('2015-04-07T00:00:00+00:00/2015-04-07T17:12:18+00:00'), moment.range('2015-04-07T17:12:18+00:00/2015-04-08T00:00:00+00:00')]);
    });
  });

  describe('#isSame()', function() {
    it('should true if the start and end of both DateRange objects equal', function() {
      const dr1 = moment.range(d1, d2);
      const dr2 = moment.range(d1, d2);

      expect(dr1.isSame(dr2)).to.be(true);
    });

    it('should false if the starts differ between objects', function() {
      const dr1 = moment.range(d1, d3);
      const dr2 = moment.range(d2, d3);

      expect(dr1.isSame(dr2)).to.be(false);
    });

    it('should false if the ends differ between objects', function() {
      const dr1 = moment.range(d1, d2);
      const dr2 = moment.range(d1, d3);

      expect(dr1.isSame(dr2)).to.be(false);
    });
  });

  describe('#toString()', function() {
    it('should be a correctly formatted ISO8601 Time Interval', function() {
      const start = moment.utc('2015-01-17T09:50:04+00:00');
      const end   = moment.utc('2015-04-17T08:29:55+00:00');
      const dr = moment.range(start, end);

      expect(dr.toString()).to.equal(start.format() + '/' + end.format());
    });
  });

  describe('#valueOf()', function() {
    it('should be the value of the range in milliseconds', function() {
      const dr = moment.range(d1, d2);

      expect(dr.valueOf()).to.eql(d2.getTime() - d1.getTime());
    });

    it('should correctly coerce to a number', function() {
      const dr1 = moment.range(d4, d2);
      const dr2 = moment.range(d3, d2);

      expect((dr1 > dr2)).to.be(true);
    });
  });

  describe('#toDate()', function() {
    it('should be a array like [dateObject, dateObject]', function() {
      const dr = moment.range(d1, d2);
      const drTodate = dr.toDate();

      expect(drTodate.length).to.eql(2);
      expect(drTodate[0].valueOf()).to.eql(d1.valueOf());
      expect(drTodate[1].valueOf()).to.eql(d2.valueOf());
    });
  });

  describe('#diff()', function() {
    it('should use momentjs’ diff method', function() {
      const dr = moment.range(d1, d2);

      expect(dr.diff('months')).to.equal(3);
      expect(dr.diff('days')).to.equal(92);
      expect(dr.diff()).to.equal(7948800000);
    });
  });

  describe('#center()', function() {
    it('should use momentjs’ center method', function() {
      const d1 = new Date(Date.UTC(2011, 2, 5));
      const d2 = new Date(Date.UTC(2011, 3, 5));
      const dr = moment.range(d1, d2);

      expect(dr.center().valueOf()).to.equal(1300622400000);
    });
  });
});
