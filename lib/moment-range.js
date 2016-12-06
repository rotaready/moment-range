/**
 * @flow
 */

import moment from 'moment';

//-----------------------------------------------------------------------------
// Contstants
//-----------------------------------------------------------------------------

const INTERVALS = {
  year: true,
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

type Shorthand = 'years' | 'quarters' | 'months' | 'weeks' | 'days' | 'hours' | 'minutes' | 'seconds' | 'milliseconds';

export class DateRange {
  start: moment;
  end: moment;

  // constructor(start: Date | moment, end: Date | moment);
  // constructor(range: [Date | Range, Date | Range]);
  // constructor(range: string);
  constructor(start, end) {
    let s = start;
    let e = end;

    if (arguments.length === 1 || end === undefined) {
      if (typeof start === 'object' && start.length === 2) {
        [s, e] = start;
      }
      else if (typeof start === 'string') {
        [s, e] = start.split('/');
      }
    }

    this.start = (s === null) ? moment(-8640000000000000) : moment(s);
    this.end = (e === null) ? moment(8640000000000000) : moment(e);
  }

  add(other: DateRange): ?DateRange {
    if (this.overlaps(other)) {
      return new this.constructor(moment.min(this.start, other.start), moment.max(this.end, other.end));
    }

    return null;
  }

  by(range: DateRange | Shorthand, callback: (moment: moment, range: DateRange) => any, exclusive: bool): DateRange {
    const iterateByString = (range: DateRange, interval: Shorthand, hollaback, exclusive) => {
      const current = moment(range.start);

      while (range.contains(current, exclusive)) {
        hollaback(current.clone(), range);
        current.add(interval, 1);
      }
    };

    const iterateByRange = (range: DateRange, interval: DateRange, hollaback, exclusive) => {
      const div = range.valueOf() / interval.valueOf();
      let l = Math.floor(div);

      if (l === Infinity) { return; }
      if (l === div && exclusive) {
        l--;
      }

      for (let i = 0; i <= l; i++) {
        hollaback(moment(range.start.valueOf() + interval.valueOf() * i), range);
      }
    };

    if (typeof range === 'string') {
      iterateByString(this, range, callback, exclusive);
    }
    else {
      iterateByRange(this, range, callback, exclusive);
    }

    return this;
  }

  center(): moment {
    const center = this.start + this.diff() / 2;

    return moment(center);
  }

  clone(): DateRange {
    return new this.constructor(this.start, this.end);
  }

  contains(other: Date | DateRange | moment, exclusive: bool = false) {
    const start = this.start;
    const end = this.end;

    if (other instanceof DateRange) {
      return start <= other.start && (end > other.end || (end.isSame(other.end) && !exclusive));
    }

    return start <= other && (end > other || (end.isSame(other) && !exclusive));
  }

  diff(unit?: Shorthand): number {
    return this.end.diff(this.start, unit);
  }

  intersect(other: DateRange): ?DateRange {
    const start = this.start;
    const end = this.end;

    if ((start <= other.start) && (other.start < end) && (end < other.end)) {
      return new this.constructor(other.start, end);
    }
    else if ((other.start < start) && (start < other.end) && (other.end <= end)) {
      return new this.constructor(start, other.end);
    }
    else if ((other.start < start) && (start <= end) && (end < other.end)) {
      return this;
    }
    else if ((start <= other.start) && (other.start <= other.end) && (other.end <= end)) {
      return other;
    }

    return null;
  }

  isEqual(other: DateRange): bool {
    return this.start.isSame(other.start) && this.end.isSame(other.end);
  }

  isSame(other: DateRange): bool {
    return this.isEqual(other);
  }

  overlaps(other: DateRange): bool {
    return this.intersect(other) !== null;
  }

  subtract(other: DateRange): Array<DateRange> {
    const start = this.start;
    const end = this.end;

    if (this.intersect(other) === null) {
      return [this];
    }
    else if ((other.start <= start) && (start < end) && (end <= other.end)) {
      return [];
    }
    else if ((other.start <= start) && (start < other.end) && (other.end < end)) {
      return [new this.constructor(other.end, end)];
    }
    else if ((start < other.start) && (other.start < end) && (end <= other.end)) {
      return [new this.constructor(start, other.start)];
    }
    else if ((start < other.start) && (other.start < other.end) && (other.end < end)) {
      return [new this.constructor(start, other.start), new this.constructor(other.end, end)];
    }
    else if ((start < other.start) && (other.start < end) && (other.end < end)) {
      return [new this.constructor(start, other.start), new this.constructor(other.start, end)];
    }
  }

  toArray(range: DateRange | Shorthand, exclusive: bool): Array<DateRange> {
    const acc = [];
    this.by(range, function(unit) {
      acc.push(unit);
    }, exclusive);
    return acc;
  }

  toDate(): Array<Date> {
    return [this.start.toDate(), this.end.toDate()];
  }

  toString(): string {
    return this.start.format() + '/' + this.end.format();
  }

  valueOf(): number {
    return this.end - this.start;
  }
}


//-----------------------------------------------------------------------------
// Moment Extensions
//-----------------------------------------------------------------------------

export function extendMoment(moment: moment$Moment): moment {
  /**
   * Build a date range.
   */
  moment.range = function(start: Date | moment, end: Date | moment): DateRange {
    if (start in INTERVALS) {
      return new DateRange(moment(this).startOf(start), moment(this).endOf(start));
    }

    return new DateRange(start, end);
  };

  /**
   * Expose constructor
   */
  moment.range.constructor = DateRange;

  /**
   * Check if the current moment is within a given date range.
   */
  moment.fn.within = function(range: DateRange): bool {
    return range.contains(this._d);
  };

  return moment;
}
