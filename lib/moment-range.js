/**
 * @flow
 */

import moment from 'moment';

//-----------------------------------------------------------------------------
// Contstants
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

type Shorthand = 'years' | 'quarters' | 'months' | 'weeks' | 'days' | 'hours' | 'minutes' | 'seconds' | 'milliseconds';

export class DateRange {
  start: moment$Moment;
  end: moment$Moment;

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

  adjacent(other: DateRange): bool {
    const sameStartEnd = this.start.isSame(other.end);
    const sameEndStart = this.end.isSame(other.start);

    return (sameStartEnd && (other.start.valueOf() <= this.start.valueOf())) || (sameEndStart && (other.end.valueOf() >= this.end.valueOf()));
  }

  add(other: DateRange): ?DateRange {
    if (this.overlaps(other)) {
      return new this.constructor(moment.min(this.start, other.start), moment.max(this.end, other.end));
    }

    return null;
  }

  by(interval: Shorthand, options?: { exclusive: bool; step: number; } = { exclusive: false, step: 1 }): Iterable<moment$Moment> {
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

  byRange(interval: DateRange, options?: { exclusive: bool; step: number; } = { exclusive: false, step: 1 }): Iterable<moment$Moment> {
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

  center(): moment$Moment {
    const center = this.start.valueOf() + this.diff() / 2;

    return moment(center);
  }

  clone(): DateRange {
    return new this.constructor(this.start, this.end);
  }

  contains(other: Date | DateRange | moment$Moment, options?: { exclusive: bool; } = { exclusive: false }) {
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

  diff(unit: ?Shorthand = undefined, rounded: ?bool = undefined): number {
    return this.end.diff(this.start, unit, rounded);
  }

  duration(unit: ?Shorthand = undefined, rounded: ?bool = undefined): number {
    return this.diff(unit, rounded);
  }

  intersect(other: DateRange): ?DateRange {
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

  isEqual(other: DateRange): bool {
    return this.start.isSame(other.start) && this.end.isSame(other.end);
  }

  isSame(other: DateRange): bool {
    return this.isEqual(other);
  }

  overlaps(other: DateRange, options: { adjacent: bool; } = { adjacent: false }): bool {
    const intersect = (this.intersect(other) !== null);

    if (options.adjacent && !intersect) {
      return this.adjacent(other);
    }

    return intersect;
  }

  reverseBy(interval: Shorthand, options?: { exclusive: bool; step: number; } = { exclusive: false, step: 1 }): Iterable<moment$Moment> {
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

  reverseByRange(interval: DateRange, options?: { exclusive: bool; step: number; } = { exclusive: false, step: 1 }): Iterable<moment$Moment> {
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


  subtract(other: DateRange): Array<DateRange> {
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

  toDate(): Array<Date> {
    return [this.start.toDate(), this.end.toDate()];
  }

  toString(): string {
    return this.start.format() + '/' + this.end.format();
  }

  valueOf(): number {
    return this.end.valueOf() - this.start.valueOf();
  }
}


//-----------------------------------------------------------------------------
// Moment Extensions
//-----------------------------------------------------------------------------

export function extendMoment(moment: moment): moment {
  /**
   * Build a date range.
   */
  type RangeConstructor = ((start: Shorthand) => DateRange) |
                          ((start: Date, end: Date) => DateRange) |
                          ((start: moment$Moment, end: moment$Moment) => DateRange);
  let range: RangeConstructor = function(start, end) {
    const m: moment$Moment = this;

    if ((typeof start === 'string') && (start in INTERVALS)) {
      return new DateRange(moment(m).startOf(start), moment(m).endOf(start));
    }

    return new DateRange(start, end);
  };
  moment.range = range;

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
