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

  // by(interval: Shorthand, options?: { exclusive: bool; }): Iterator<moment>;
  // byRange(range: DateRange, options?: { exclusive: bool; }): Iterator<moment>;
  // reverseBy(interval: Shorthand, options?: { exclusive: bool; }): Iterator<moment>;
  // reverseByRange(range: DateRange, options?: { exclusive: bool; }): Iterator<moment>;

  by(interval: Shorthand, options?: { exclusive: bool; } = { exclusive: false }): Iterator<moment> {
    const range = this;

    return {
      [Symbol.iterator]() {
        const diff = Math.abs(range.start.diff(range.end, interval));
        let iteration = 0;

        return {
          next() {
            const current = range.start.clone().add(iteration, interval);
            const done = options.exclusive
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

  byRange(interval: DateRange, options?: { exclusive: bool; } = { exclusive: false }): Iterator<moment> {
    const range = this;
    const diff = this.valueOf() / interval.valueOf();
    const unit = Math.floor(diff);
    let iteration = 0;

    return {
      [Symbol.iterator]() {
        if (unit === Infinity) {
          return { done: true };
        }

        return {
          next() {
            const current = moment(range.start.valueOf() + (interval.valueOf() * iteration));
            const done = ((unit === diff) && options.exclusive)
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

  center(): moment {
    const center = this.start + this.diff() / 2;

    return moment(center);
  }

  clone(): DateRange {
    return new this.constructor(this.start, this.end);
  }

  contains(other: Date | DateRange | moment, options?: { exclusive: bool; } = { exclusive: false }) {
    const start = this.start;
    const end = this.end;
    let oStart = other;
    let oEnd = other;

    if (other instanceof DateRange) {
      oStart = other.start;
      oEnd = other.end;
    }

    const startInRange = (start < oStart) || ((start <= oStart) && !options.exclusive);
    const endInRange = (end > oEnd) || ((end >= oEnd) && !options.exclusive);

    return (startInRange && endInRange);
  }

  diff(unit: ?Shorthand = undefined, rounded: bool = undefined): number {
    return this.end.diff(this.start, unit, rounded);
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

  reverseBy(interval: Shorthand, options?: { exclusive: bool; } = { exclusive: false }): Iterator<moment> {
    const range = this;
    const diff = Math.abs(range.start.diff(range.end, interval));

    return {
      [Symbol.iterator]() {
        let iteration = 0;

        return {
          next() {
            const current = range.end.clone().subtract(iteration, interval);
            const done = options.exclusive
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

  reverseByRange(interval: DateRange, options?: { exclusive: bool; } = { exclusive: false }): Iterator<moment> {
    const range = this;
    const diff = this.valueOf() / interval.valueOf();
    const unit = Math.floor(diff);
    let iteration = 0;

    return {
      [Symbol.iterator]() {
        if (unit === Infinity) {
          return { done: true };
        }

        return {
          next() {
            const current = moment(range.end.valueOf() - (interval.valueOf() * iteration));
            const done = ((unit === diff) && options.exclusive)
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

export function extendMoment(moment: moment): moment {
  /**
   * Build a date range.
   */
  moment.range = function(start: Date | Shorthand | moment, end?: Date | moment): DateRange {
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
   * @deprecated
   */
  moment.fn.range = moment.range;

  /**
   * Check if the current moment is within a given date range.
   */
  moment.fn.within = function(range: DateRange): bool {
    return range.contains(this.toDate());
  };

  return moment;
}
