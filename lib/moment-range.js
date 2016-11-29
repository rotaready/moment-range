//-----------------------------------------------------------------------------
// Contstants
//-----------------------------------------------------------------------------

const moment = require('moment');

const INTERVALS = {
  year:   true,
  month:  true,
  week:   true,
  day:    true,
  hour:   true,
  minute: true,
  second: true
};


//-----------------------------------------------------------------------------
// Date Ranges
//-----------------------------------------------------------------------------

/**
 * DateRange class to store ranges and query dates.
 *
 * @constructor
 * @param {(Moment|Date)} start Start of interval
 * @param {(Moment|Date)} end End of interval
 *//**
 * DateRange class to store ranges and query dates.
 *
 * @constructor
 * @param {!Array} range Array containing start and end dates.
 *//**
 * DateRange class to store ranges and query dates.
 *
 * @constructor
 * @param {!String} range String formatted as an IS0 8601 time interval
 */


function DateRange(start, end, options) {

  if (options === undefined && ( (typeof end === 'object') && !(end instanceof moment || end instanceof Date) )) {
    options = end;
    e = end = undefined;
  }

  this.options = options = options || {};
  
  this._setRange = (options.contain) ? this._containIntersect : this._intersect;
  
  this.set(start, end, options);
}

DateRange.prototype._setDuration = function() {
  this.duration = moment.duration(this.end - this.start);
}

/**
 * Constructor for prototype.
 *
 * @type {DateRange}
 */
DateRange.prototype.constructor = DateRange;

/**
 * Deep clone range.
 *
 * @return {!DateRange}
 */
DateRange.prototype.clone = function() {
  return moment().range(this.start, this.end, this.options);
};

/**
 * Determine if the current interval contains a given moment/date/range.
 *
 * @param {(Moment|Date|DateRange)} other Date to check
 * @param {!boolean} exclusive True if the to value is exclusive
 *
 * @return {!boolean}
 */
DateRange.prototype.contains = function(other, exclusive) {
  var start = this.start;
  var end   = this.end;

  if (other instanceof DateRange) {
    return start <= other.start && (end > other.end || (end.isSame(other.end) && !exclusive));
  }
  else {
    return start <= other && (end > other || (end.isSame(other) && !exclusive));
  }
};

/**
 * Determine if the current date range overlaps a given date range.
 *
 * @param {!DateRange} range Date range to check
 *
 * @return {!boolean}
 */
DateRange.prototype.overlaps = function(range) {
  return this.intersect(range) !== null;
};

/**
 * Determine the intersecting periods from one or more date ranges.
 *
 * @param {!DateRange} other A date range to intersect with this one
 *
 * @return {DateRange} Returns the intersecting date or `null` if the ranges do
 *                     not intersect
 */
DateRange.prototype.intersect = function(other) {
  var start = this.start;
  var end   = this.end;

  if ((start <= other.start) && (other.start < end) && (end < other.end)) {
    return new DateRange(other.start, end);
  }
  else if ((other.start < start) && (start < other.end) && (other.end <= end)) {
    return new DateRange(start, other.end);
  }
  else if ((other.start < start) && (start <= end) && (end < other.end)) {
    return this;
  }
  else if ((start <= other.start) && (other.start <= other.end) && (other.end <= end)) {
    return other;
  }

  return null;
};

/**
 * Merge date ranges if they intersect.
 *
 * @param {!DateRange} other A date range to add to this one
 *
 * @return {DateRange} Returns the new `DateRange` or `null` if they do not
 *                     overlap
 */
DateRange.prototype.add = function(other) {
  if (this.overlaps(other)) {
    return new DateRange(moment.min(this.start, other.start), moment.max(this.end, other.end));
  }

  return null;
};

/**
 * Subtract one range from another.
 *
 * @param {!DateRange} other A date range to substract from this one
 *
 * @return {!Array<DateRange>} Returns an array of new `DateRange`, or empty array if all time is subtracted 
 */
DateRange.prototype.subtract = function(other) {
  var start = this.start;
  var end   = this.end;

  if (this.intersect(other) === null) {
    return [new DateRange(start, end)];
  }
  else if ((other.start <= start) && (start < end) && (end <= other.end)) {
    return [];
  }
  else if ((other.start <= start) && (start < other.end) && (other.end < end)) {
    return [new DateRange(other.end, end)];
  }
  else if ((start < other.start) && (other.start < end) && (end <= other.end)) {
    return [new DateRange(start, other.start)];
  }
  else if ((start < other.start) && (other.start < other.end) && (other.end < end)) {
    return [new DateRange(start, other.start), new DateRange(other.end, end)];
  }
  else if ((start < other.start) && (other.start < end) && (other.end < end)) {
    return [new DateRange(start, other.start), new DateRange(other.start, end)];
  }
};

/**
 * Build a n array of dates.
 *
 * @param {(!DateRange|String)} range Date range to be used for iteration or
 *                                    shorthand string (shorthands:
 *                                    http://momentjs.com/docs/#/manipulating/add/)
 * @param {!boolean} exclusive Indicate that the end of the range should not
 *                             be included in the iter.
 *
 * @return {!Array}
 */
DateRange.prototype.toArray = function(by, exclusive) {
  var acc = [];
  this.by(by, function(unit) {
    acc.push(unit);
  }, exclusive);
  return acc;
};

/**
 * Iterate over the date range by a given date range, executing a function
 * for each sub-range.
 *
 * @param {(!DateRange|String)} range Date range to be used for iteration or
 *                                    shorthand string (shorthands:
 *                                    http://momentjs.com/docs/#/manipulating/add/)
 * @param {!DateRange~by} hollaback Callback
 * @param {!boolean} exclusive Indicate that the end of the range should not
 *                             be included in the iter.
 *
 * @return {DateRange} `this`
 */
DateRange.prototype.by = function(range, hollaback, exclusive) {
  if (typeof range === 'string') {
    _byString.call(this, range, hollaback, exclusive);
  }
  else {
    _byRange.call(this, range, hollaback, exclusive);
  }
  return this;
};


/**
 * Callback executed for each sub-range.
 *
 * @callback DateRange~by
 *
 * @param {!Moment} current Current moment object for iteration
 */

/**
 * @private
 */
function _byString(interval, hollaback, exclusive) {
  var current = moment(this.start);

  while (this.contains(current, exclusive)) {
    hollaback.call(this, current.clone());
    current.add(1, interval);
  }
}

/**
 * @private
 */
function _byRange(interval, hollaback, exclusive) {
  var div = this / interval;
  var l = Math.floor(div);

  if (l === Infinity) { return; }
  if (l === div && exclusive) {
    l--;
  }

  for (var i = 0; i <= l; i++) {
    hollaback.call(this, moment(this.start.valueOf() + interval.valueOf() * i));
  }
}

/**
 * Date range formatted as an [ISO8601 Time
 * Interval](http://en.wikipedia.org/wiki/ISO_8601#Time_intervals).
 *
 * @return {!String}
 */
DateRange.prototype.toString = function() {
  return this.start.format() + '/' + this.end.format();
};

/**
 * Date range in milliseconds. Allows basic coercion math of date ranges.
 *
 * @return {!number}
 */
DateRange.prototype.valueOf = function() {
  return this.end - this.start;
};

/**
 * Center date of the range.
 *
 * @return {!Moment}
 */
DateRange.prototype.center = function() {
  var center = this.start + this.diff() / 2;
  return moment(center);
};

/**
 * Date range toDate
 *
 * @return {!Array<Date>}
 */
DateRange.prototype.toDate = function() {
  return [this.start.toDate(), this.end.toDate()];
};

/**
 * Determine if this date range is the same as another.
 *
 * @param {!DateRange} other Another date range to compare to
 *
 * @return {!boolean}
 */
DateRange.prototype.isSame = function(other) {
  return this.start.isSame(other.start) && this.end.isSame(other.end);
};

/**
 * The difference of the end vs start.
 *
 * @param {number} unit Unit of difference, if no unit is passed in
 *                      milliseconds are returned. E.g.: `"days"`, `"months"`,
 *                      etc...
 *
 * @return {!number}
 */
DateRange.prototype.diff = function(unit) {
  return this.end.diff(this.start, unit);
};

/**
 *  Allows the date to be taken in different forms 
 * 
 * @param {date string|date object|moment object} - start
 * @param {date string|date object|moment object} - end
 * 
 * @return [moment, moment]
 */
DateRange.prototype.parseRange = function (start, end) {
  var parts;
  var s = start;
  var e = end;

  if (arguments.length === 1 || end === undefined) {
    if (typeof start === 'object' && start.length === 2) {
      s = start[0];
      e = start[1];
    }
    else if (typeof start === 'string') {
      parts = start.split('/');
      s = parts[0];
      e = parts[1];
    }
  }

  return [(!s) ? moment(-8640000000000000) : moment(s),
          (!e) ? moment(8640000000000000) : moment(e)];
}

/**
 * Sets actual start date, end date, or both
 * 
 * @param {date string|date object|moment object} - start
 * @param {date string|date object|moment object} - end
 * 
 * @return [moment, moment]
 */
DateRange.prototype._set = function(start, end){
    var parsedRange = this.parseRange(start, end);
    
    this.actualStart = parsedRange[0];
    this.actualEnd   = parsedRange[1];
}

/**
 * Sets range of values
 * calculates duration from actual end to start
 * null or undefined values will clear the date
 * 
 * @param {date string|date object|moment object} - start
 * @param {date string|date object|moment object} - end
 * @param {date string|date object|moment object} - upperlimit
 * @param {date string|date object|moment object} - lowerlimit
 * @param {boolean} - sets contain range boolean
 * 
 * @return this.start
 * @return this.end
 */
DateRange.prototype.set = function (start, end, options) {
    this._set(start, end);
    if (options) this._setLimit(options.lowerLimit, options.upperLimit);

    this.actualDuration = moment.duration(this.actualEnd - this.actualStart);

    this._setRange();
}

Object.defineProperties(DateRange.prototype, {
       actualRange: {
           get: function () {
               return moment.range(this.actualStart, this.actualEnd);
           },
           enumerable: true
       },
       //sets the default unit for the rate object
       limitRange: {
           get: function () {
               return moment.range(this.lowerLimit, this.upperLimit);
           },
           enumerable: true
       },
   });

/**
 * Sets upper, lower, or both limits
 * Calculates duration from upperlimit to lowerlimit
 * 
 * @param {date string|date object|moment object} - lowerLimit
 * @param {date string|date object|moment object} - upperlimit
 * 
 * @return [moment, moment]
 */
DateRange.prototype._setLimit = function (lowerLimit, upperLimit) {
  var parsedLimit = this.parseRange(lowerLimit, upperLimit);

  this.lowerLimit = parsedLimit[0];
  this.upperLimit = parsedLimit[1];
  this.limitDuration = moment.duration(this.upperLimit - this.lowerLimit);  
}

/**
 * Sets range of values when requiring new limits
 * null or undefined values will clear the date
 * 
 * @param {date string|date object|moment object} - upperlimit
 * @param {date string|date object|moment object} - lowerlimit
 * 
 * @return this.start
 * @return this.end
 */
DateRange.prototype.setLimit = function (lowerLimit, upperLimit) {
  this._setLimit(lowerLimit, upperLimit);

  this._setRange();
}

/**
 * calculates start and end when !options.contains
 * 
 * @return this.start 
 * @return this.end
 * 
 * calculates duration from start to end
 */
DateRange.prototype._intersect = function() {
  var lowerLimit = this.lowerLimit;
  var upperLimit = this.upperLimit;
  var actualStart = this.actualStart;
  var actualEnd = this.actualEnd;
    
  if(upperLimit < actualStart || actualEnd < lowerLimit) {
    //if does not overlap
    this.start = this.end = undefined;    
  } 
  else {
    //if overlaps
    if (actualStart <= lowerLimit) {
      this.start = lowerLimit;
    } else {
      this.start = actualStart;
    }

    if (actualEnd <= upperLimit) {
      this.end = actualEnd;
    } else {
      this.end = upperLimit; 
    }
  }
  this._setDuration();
};

 /**
 * sets start to new value
 * null or undefined values will clear the date
 * 
 * @param {date string|date object|moment object} - start
 * 
 * @return this.start 
 * @return this.end
 * 
 */
DateRange.prototype.setStart = function(start) {
 this.set(start, this.actualEnd);
}

 /**
 * sets end to new value
 * null or undefined values will clear the date
 * 
 * @param {date string|date object|moment object} - end
 * 
 * @return this.start 
 * @return this.end
 * 
 */
DateRange.prototype.setEnd = function(end) {
  this.set(this.actualStart, end);
}

 /**
 * sets lowerlimit to new value
 * null or undefined values will clear the date
 * 
 * @param {date string|date object|moment object} - lowerlimit
 * 
 * @return this.start 
 * @return this.end
 * 
 */
DateRange.prototype.setLowerLimit = function(lowerLimit) {
  this.setLimit(lowerLimit, this.upperLimit);
}

 /**
 * sets upperlimit to new value
 * 
 * @param {date string|date object|moment object} - upperlimit
 * 
 * @return this.start 
 * @return this.end
 * 
 */
DateRange.prototype.setUpperLimit = function(upperLimit) {
  this.setLimit(this.lowerLimit, upperLimit);
}

 /**
 * clears start and/or end values
 * Undefined parameters clear both.
 * 
 * @param {boolean} - clearStart
 * @param {boolean} - clearEnd
 * 
 * @return this.start 
 * @return this.end
 * 
 */
DateRange.prototype.clear = function(clearStart, clearEnd) {
  var start = clearStart === false ? this.actualStart : undefined;
  var end = clearEnd === false ? this.actualEnd : undefined;
  this.set(start, end);
}

 /**
 * clears upper and/or lower limts
 * 
 * @param {boolean} - clear lower limit
 * @param {boolean} - clear upper limit
 * 
 * @return this.start 
 * @return this.end
 * 
 */
DateRange.prototype.clearLimits = function(clearLowerLimit, clearUpperLimit) {
  var lowerLimit = clearLowerLimit === false ? this.lowerLimit : undefined;
  var upperLimit = clearUpperLimit === false ? this.upperLimit : undefined;
  this.setLimit(lowerLimit, upperLimit);
}

/** 
 * Shifts start and end values forward
 *  If no limits are set the time will shift indefinitely
 * 
 * @param {number}
 * 
 * @return this.start
 * @return this.end
 */
DateRange.prototype.shiftForward = function(duration) {
  var start = this.actualStart + duration;
  var end = this.actualEnd + duration;
  this.set(start, end);
}

/** 
 * Shifts start and end values backward
 *  If no limits are set the time will shift indefinitely
 * 
 * @param {number}
 * 
 * @return this.start
 * @return this.end
 */
DateRange.prototype.shiftBackward = function(duration) {
  var start = this.actualStart - duration;
  var end = this.actualEnd - duration;
  this.set(start, end);
}

/** 
 * sets range values when options.contains
 * if range is fully in/out of limits or if overlaps
 *
 * @return this.start
 * @return this.end
 */
DateRange.prototype._containIntersect = function() {
  var lowerLimit = this.lowerLimit;
  var upperLimit = this.upperLimit;
  var actualStart = this.actualStart;
  var actualEnd = this.actualEnd;
    
  if(upperLimit < actualEnd) {
    this.start = moment(actualStart - (actualEnd - upperLimit)); 
    this.end = upperLimit;

    if (this.start < lowerLimit) {
      this.start = lowerLimit;
    }
  }
  else if (actualStart < lowerLimit) {
    this.start = lowerLimit;
    this.end = moment(actualEnd + (lowerLimit - actualStart));

    if (upperLimit < this.end) {
      this.end = upperLimit;
    }
  }
  else {
    this.start = actualStart;
    this.end = actualEnd;
  }
  this._setDuration();
}

/** 
 * Shifts start and end values forward/backward
 *  If no limits are set the time will shift indefinitely
 * 
 * @param {+/-number}
 * 
 * @return this.start
 * @return this.end
 */
DateRange.prototype.shift = function(duration) {
  this.shiftForward(duration)
}


/**
 * Formats the start and end dates
 * 
 * @param {string} - format start/ format end
 * @param {string} - delimiter
 * 
 * @return {string}
 */
DateRange.prototype.format = function(formatStart, formatEnd, delimiter) {
   var start = (formatStart) ? this.start.format(formatStart) : '';
   var end = (formatEnd) ?  this.end.format(formatEnd) : '';

   return (start && end) ? [start,end].join(delimiter || ' ') : start || end; 
} 

//-----------------------------------------------------------------------------
// Moment Extensions
//-----------------------------------------------------------------------------

/**
 * Build a date range.
 *
 * @param {(Moment|Date)} start Start of range
 * @param {(Moment|Date)} end End of range
 *
 * @this {Moment}
 *
 * @return {!DateRange}
 */
moment.range = function(start, end, options) {
  if (start in INTERVALS) {
    return new DateRange(moment(this).startOf(start), moment(this).endOf(start), options);
  }
  else {
    return new DateRange(start, end, options);
  }
};

/**
 * Expose constructor
 *
 * @const
 */
moment.range.constructor = DateRange;

/**
 * @deprecated
 */
moment.fn.range = moment.range;

/**
 * Check if the current moment is within a given date range.
 *
 * @param {!DateRange} range Date range to check
 *
 * @this {Moment}
 *
 * @return {!boolean}
 */
moment.fn.within = function(range) {
  return range.contains(this._d);
};


//-----------------------------------------------------------------------------
// Export
//-----------------------------------------------------------------------------

module.exports = DateRange;
