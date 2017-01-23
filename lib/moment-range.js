import moment from 'moment';

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
        [s, e] = start.split('/');
      }
    }

    this.start = (s === null) ? moment(-8640000000000000) : moment(s);
    this.end = (e === null) ? moment(8640000000000000) : moment(e);
  }

  adjacent(other) {
    const sameStartEnd = this.start.isSame(other.end);
    const sameEndStart = this.end.isSame(other.start);

    return (sameStartEnd && (other.start.valueOf() <= this.start.valueOf())) || (sameEndStart && (other.end.valueOf() >= this.end.valueOf()));
  }

  /**
   * Merge date ranges if they intersect.
   *
   * @param {!DateRange} other A date range to add to this one
   * @param {String} inclusivity
   *
   * @return {DateRange} Returns the new `DateRange` or `null` if they do not
   *                     overlap
   */
  add(other, options) {
    if (this.overlaps(other, options)) {
      return new this.constructor(moment.min(this.start, other.start), moment.max(this.end, other.end));
    }

    return null;
  }

  by(interval, options = { inclusivity: "[]", step: 1 }) {
    const range = this;

    return {
      [Symbol.iterator]() {
        const inclusive = options.inclusivity[1] === "]";
        const step = options.step || 1;
        const diff = Math.abs(range.start.diff(range.end, interval)) / step;
        let iteration = inclusivity[0] === '[' ? 0 : 1;

        return {
          next() {
            const current = range.start.clone().add((iteration * step), interval);
            const done = inclusive
              ? !(iteration <= diff)
              : !(iteration < diff);

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

	byRange(interval, options = { inclusivity: "[]", step: 1 }) {
		const range = this;
		const step = options.step || 1;
		const diff = this.valueOf() / interval.valueOf() / step;
		const inclusive = options.inclusivity[1] === "]";
		const unit = Math.floor(diff);
		let iteration = inclusivity[0] === '[' ? 0 : 1;

		return {
			[Symbol.iterator]() {
				if (unit === Infinity) {
					return { done: true };
				}

				return {
					next() {
						const current = moment(range.start.valueOf() + (interval.valueOf() * iteration * step));
						const done = ((unit === diff) && inclusive)
							? !(iteration <= unit)
							: !(iteration < unit);

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

  /**
   * Deep clone range.
   *
   * @return {!DateRange}
   */
  clone() {
    return new this.constructor(this.start, this.end);
  }

  /**
   * Determine if the current interval contains a given moment/date/range.
   *
   * @param {(Moment|Date|DateRange)} other Date to check
   * @param {String} inclusivity A `[` indicates inclusion of a value.
   *                             A `(` indicates exclusion.
   *                             If the inclusivity parameter is used, both indicators must be passed.
   *
   * @return {!boolean}
   */
  contains(other, options = { inclusivity: "[]" }) {
	const start = this.start.valueOf();
	const end = this.end.valueOf();
	let oStart = other.valueOf();
	let oEnd = other.valueOf();

	const startInRange = (start < oStart) || (start === oStart && inclusivity[0] === '[');
	const endInRange = (end > oEnd) || (end === oEnd && inclusivity[1] === ']');

	return (startInRange && endInRange);
  }

  diff(unit, rounded) {
    return this.end.diff(this.start, unit, rounded);
  }

  duration(unit, rounded) {
    return this.diff(unit, rounded);
  }

/**
 * Determine the intersecting periods from one or more date ranges.
 *
 * @param {!DateRange} other A date range to intersect with this one
 * @param {String} inclusivity
 *
 * @return {DateRange} Returns the intersecting date or `null` if the ranges do
 *                     not intersect
 */
intersect(other, options = { inclusivity: "[]" }) {
  const start = this.start.valueOf();
  const end = this.end.valueOf();
  const oStart = other.start.valueOf();
  const oEnd = other.end.valueOf();

  /*
    [---range---]       | [---range---]
          {---other---} |             {---other---}
   */
  if ((start < oStart || (start === oStart) && inclusivity[0] === '[')) &&
  	(oStart < end || (oStart === end && inclusivity[1] === ']')) &&
  	(end < oEnd)) {
  	return new DateRange(oStart, end);
  }
  /*
           [---range---] |             [---range---]
      {---other---}      | {---other---}
   */
  else if ((oStart < start) &&
  	(start < oEnd || (start === oEnd && inclusivity[0] === '[')) &&
  	(oEnd < end || (end === oEnd && inclusivity[1] === ']'))) {
  	return new DateRange(start, oEnd);
  }
  /*
      [---range---]
    {-----other-----}
   */
  else if ((oStart < start) && (start <= end) && (end < oEnd)) {
  	return this;
  }
  /*
      [-----range-----] | [---range---]
        {---other---}   | {---other---}
   */
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

  overlaps(other, options) {
	return this.intersect(other, options) !== null;
  }

  reverseBy(interval, options = { inclusivity: "[]", step: 1 }) {
    const range = this;

    return {
      [Symbol.iterator]() {
	      const inclusive = options.inclusivity[1] === "]";
        const step = options.step || 1;
        const diff = Math.abs(range.start.diff(range.end, interval)) / step;
	      let iteration = inclusivity[0] === '[' ? 0 : 1;

        return {
          next() {
            const current = range.end.clone().subtract((iteration * step), interval);
            const done = inclusive
              ? !(iteration <= diff)
              : !(iteration < diff);

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

reverseByRange(interval, options = { inclusivity: "[]", step: 1 }) {
	const range = this;
	const step = options.step || 1;
	const diff = this.valueOf() / interval.valueOf() / step;
	const inclusive = options.inclusivity[1] === "]";
	const unit = Math.floor(diff);
	let iteration = inclusivity[0] === '[' ? 0 : 1;

	return {
		[Symbol.iterator]() {
			if (unit === Infinity) {
				return { done: true };
			}

			return {
				next() {
					const current = moment(range.end.valueOf() - (interval.valueOf() * iteration * step));
					const done = ((unit === diff) && exclusive)
						? !(iteration <= unit)
						: !(iteration < unit);

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

	/*
		[---range---]                |                [---range---]
					   {---other---} | {---other---}
	 */
	if (this.intersect(other) === null) {
		return [this];
	}
	/*
	  [---range---] |    [---range---]
	  {---other---} | {------other------}
	 */
	else if ((oStart.start <= start) && (start < end) && (end <= oEnd)) {
		return [];
	}
	/*
		[---range---] |      [---range---] |             [---range---] (exclusive=false)
		{--other--}   | {---other---}      | {---other---}
	 */
	else if ((oStart <= start) && (start < oEnd) && (oEnd < end)) {
		return [this.constructor(oEnd, end)];
	}
	/*
		[---range---] | [---range---]     | [---range---]
		  {--other--} |     {---other---} |             {---other---} (exclusive=false)
	 */
	else if ((start < oStart) && (oStart < end) && (end <= oEnd)) {
		return [this.constructor(start, oStart)];
	}
	/*
	   start [----range----] end
		 start {--other--} end
	 */
	else if ((start < oStart) && (oStart < oEnd) && (oEnd < end)) {
		return [new this.constructor(start, other.start), new this.constructor(oEnd, end)];
	}
	/*
	   start [----range----] end
			end {--other--} start
	 */
	else if ((start < oStart) && (oStart < end) && (oEnd < end)) {
		return [new this.constructor(start, oStart), new this.constructor(oStart, end)];
	}

	return [];
}

/**
 * Date range toDate
 *
 * @return {!Array<Date>}
 */
  toDate() {
  	return [this.start.toDate(), this.end.toDate()];
  }

/**
 * Date range formatted as an [ISO8601 Time
 * Interval](http://en.wikipedia.org/wiki/ISO_8601#Time_intervals).
 *
 * @return {!String}
 */
  toString() {
	return this.start.format() + '/' + this.end.format();
  }

/**
 * Date range in milliseconds. Allows basic coercion math of date ranges.
 *
 * @return {!number}
 */
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
   * Alias of static constructor.
   */
  moment.fn.range = moment.range;

  /**
   * Expose constructor
   */
  moment.range.constructor = DateRange;

  /**
   * Check if the current moment is within a given date range.
   */
  moment.fn.within = function(range) {
    return range.contains(this.toDate());
  };

  return moment;
}
