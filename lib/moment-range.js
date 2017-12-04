import moment from 'moment';
import Symbol from 'es6-symbol';

//-----------------------------------------------------------------------------
// Constants
//-----------------------------------------------------------------------------

const INTERVALS = {
  year: true,
  quarter: true,
  month: true,
  week: true,
  day: true,
  hour: true,
  minute: true,
  second: true
};


//-----------------------------------------------------------------------------
// Date Ranges
//-----------------------------------------------------------------------------

export class DateRange {
  constructor(start, end) {
    let s = start;
    let e = end;

    if (arguments.length === 1 || end === undefined) {
      if (typeof start === 'object' && start.length === 2) {
        [s, e] = start;
      }
      else if (typeof start === 'string') {
        [s, e] = isoSplit(start);
      }
    }

    this.start = s || s === 0 ? moment(s) : moment(-8640000000000000);
    this.end = e || e === 0 ? moment(e) : moment(8640000000000000);
  }

  adjacent(other) {
    const sameStartEnd = this.start.isSame(other.end);
    const sameEndStart = this.end.isSame(other.start);

    return (sameStartEnd && (other.start.valueOf() <= this.start.valueOf())) || (sameEndStart && (other.end.valueOf() >= this.end.valueOf()));
  }

  add(other, options = { adjacent: false }) {
    if (this.overlaps(other, options)) {
      return new this.constructor(moment.min(this.start, other.start), moment.max(this.end, other.end));
    }

    return null;
  }

  by(interval, options = { exclusive: false, step: 1 }) {
    const range = this;

    return {
      [Symbol.iterator]() {
        const exclusive = options.exclusive || false;
        const step = options.step || 1;
        const diff = Math.abs(range.start.diff(range.end, interval)) / step;
        let iteration = 0;

        return {
          next() {
            const current = range.start.clone().add((iteration * step), interval);
            const done = exclusive
              ? !(iteration < diff)
              : !(iteration <= diff);

            iteration++;

            return {
              done,
              value: (done ? undefined : current)
            };
          }
        };
      }
    };
  }

  byRange(interval, options = { exclusive: false, step: 1 }) {
    const range = this;
    const step = options.step || 1;
    const diff = this.valueOf() / interval.valueOf() / step;
    const exclusive = options.exclusive || false;
    const unit = Math.floor(diff);
    let iteration = 0;

    return {
      [Symbol.iterator]() {
        if (unit === Infinity) {
          return { done: true };
        }

        return {
          next() {
            const current = moment(range.start.valueOf() + (interval.valueOf() * iteration * step));
            const done = ((unit === diff) && exclusive)
              ? !(iteration < unit)
              : !(iteration <= unit);

            iteration++;

            return {
              done,
              value: (done ? undefined : current)
            };
          }
        };
      }
    };
  }

  center() {
    const center = this.start.valueOf() + this.diff() / 2;

    return moment(center);
  }

  clone() {
    return new this.constructor(this.start, this.end);
  }

  contains(other, options = { exclusive: false }) {
    const start = this.start.valueOf();
    const end = this.end.valueOf();
    let oStart = other.valueOf();
    let oEnd = other.valueOf();

    if (other instanceof DateRange) {
      oStart = other.start.valueOf();
      oEnd = other.end.valueOf();
    }

    const startInRange = (start < oStart) || ((start <= oStart) && !options.exclusive);
    const endInRange = (end > oEnd) || ((end >= oEnd) && !options.exclusive);

    return (startInRange && endInRange);
  }

  diff(unit, rounded) {
    return this.end.diff(this.start, unit, rounded);
  }

  duration(unit, rounded) {
    return this.diff(unit, rounded);
  }

  intersect(other) {
    const start = this.start.valueOf();
    const end = this.end.valueOf();
    const oStart = other.start.valueOf();
    const oEnd = other.end.valueOf();

    if ((start <= oStart) && (oStart < end) && (end < oEnd)) {
      return new this.constructor(oStart, end);
    }
    else if ((oStart < start) && (start < oEnd) && (oEnd <= end)) {
      return new this.constructor(start, oEnd);
    }
    else if ((oStart < start) && (start <= end) && (end < oEnd)) {
      return this;
    }
    else if ((start <= oStart) && (oStart <= oEnd) && (oEnd <= end)) {
      return other;
    }

    return null;
  }

  isEqual(other) {
    return this.start.isSame(other.start) && this.end.isSame(other.end);
  }

  isSame(other) {
    return this.isEqual(other);
  }

  overlaps(other, options = { adjacent: false }) {
    const intersect = (this.intersect(other) !== null);

    if (options.adjacent && !intersect) {
      return this.adjacent(other);
    }

    return intersect;
  }

  reverseBy(interval, options = { exclusive: false, step: 1 }) {
    const range = this;

    return {
      [Symbol.iterator]() {
        const exclusive = options.exclusive || false;
        const step = options.step || 1;
        const diff = Math.abs(range.start.diff(range.end, interval)) / step;
        let iteration = 0;

        return {
          next() {
            const current = range.end.clone().subtract((iteration * step), interval);
            const done = exclusive
              ? !(iteration < diff)
              : !(iteration <= diff);

            iteration++;

            return {
              done,
              value: (done ? undefined : current)
            };
          }
        };
      }
    };
  }

  reverseByRange(interval, options = { exclusive: false, step: 1 }) {
    const range = this;
    const step = options.step || 1;
    const diff = this.valueOf() / interval.valueOf() / step;
    const exclusive = options.exclusive || false;
    const unit = Math.floor(diff);
    let iteration = 0;

    return {
      [Symbol.iterator]() {
        if (unit === Infinity) {
          return { done: true };
        }

        return {
          next() {
            const current = moment(range.end.valueOf() - (interval.valueOf() * iteration * step));
            const done = ((unit === diff) && exclusive)
              ? !(iteration < unit)
              : !(iteration <= unit);

            iteration++;

            return {
              done,
              value: (done ? undefined : current)
            };
          }
        };
      }
    };
  }

  subtract(other) {
    const start = this.start.valueOf();
    const end = this.end.valueOf();
    const oStart = other.start.valueOf();
    const oEnd = other.end.valueOf();

    if (this.intersect(other) === null) {
      return [this];
    }
    else if ((oStart <= start) && (start < end) && (end <= oEnd)) {
      return [];
    }
    else if ((oStart <= start) && (start < oEnd) && (oEnd < end)) {
      return [new this.constructor(oEnd, end)];
    }
    else if ((start < oStart) && (oStart < end) && (end <= oEnd)) {
      return [new this.constructor(start, oStart)];
    }
    else if ((start < oStart) && (oStart < oEnd) && (oEnd < end)) {
      return [new this.constructor(start, oStart), new this.constructor(oEnd, end)];
    }
    else if ((start < oStart) && (oStart < end) && (oEnd < end)) {
      return [new this.constructor(start, oStart), new this.constructor(oStart, end)];
    }

    return [];
  }

  toDate() {
    return [this.start.toDate(), this.end.toDate()];
  }

  toString() {
    return this.start.format() + '/' + this.end.format();
  }

  valueOf() {
    return this.end.valueOf() - this.start.valueOf();
  }

}


//-----------------------------------------------------------------------------
// Moment Extensions
//-----------------------------------------------------------------------------

export function extendMoment(moment) {
  /**
   * Build a date range.
   */
  moment.range = function range(start, end) {
    const m = this;

    if (INTERVALS.hasOwnProperty(start)) {
      return new DateRange(moment(m).startOf(start), moment(m).endOf(start));
    }

    return new DateRange(start, end);
  };

  /**
   * Build a date range between a date (or now) and a specified interval.
   * @param {String} interval The type of interval
   * @param {Number} [count=1] The number of intervals (positive or negative)
   * @param {Moment|Date} [date=moment()] The date to use
   * @return {DateRange}
   */
  moment.rangeFromInterval = function(interval, count = 1, date = moment()) {
    if (!moment.isMoment(date)) date = moment(date);
    if (!date.isValid()) throw new Error('Invalid date.');

    const dateWithInterval = date.clone().add(count, interval);

    // Handle negative interval counts by assembling the dates in chronological order.
    const dates = [];
    dates.push(moment.min(date, dateWithInterval));
    dates.push(moment.max(date, dateWithInterval));

    return new DateRange(dates);
  };

  /**
   * Uses moment.parseZone on both the start and end of the given time interval
   * to preserve the time zones on the resulting DateRange object.
   * @param {string} isoTimeInterval the timeInterval to be parsed
   * @return {DateRange} constructed using moments that will preserve the time zones
   */
  moment.parseZoneRange = function(isoTimeInterval) {
    const momentStrings = isoSplit(isoTimeInterval);
    const start = moment.parseZone(momentStrings[0]);
    const end = moment.parseZone(momentStrings[1]);
    return new DateRange(start, end);
  };

  /**
   * Alias of static constructor.
   */
  moment.fn.range = moment.range;

  /**
   * Expose constructor
   */
  moment.range.constructor = DateRange;

  /**
   * Check if the current object is a date range.
   */
  moment.isRange = function(range) {
    return range instanceof DateRange;
  };

  /**
   * Check if the current moment is within a given date range.
   */
  moment.fn.within = function(range) {
    return range.contains(this.toDate());
  };

  return moment;
}


//-----------------------------------------------------------------------------
// Utility Functions
//-----------------------------------------------------------------------------

/**
 * Splits an iso string into two strings.
 */
function isoSplit(isoString) {
  return isoString.split('/');
}
