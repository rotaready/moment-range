(function(root, factory) {
    if(typeof exports === 'object') {
        module.exports = factory(require('moment'));
    }
    else if(typeof define === 'function' && define.amd) {
        define('moment-range', ['moment'], factory);
    }
    else {
        root.moment = factory(root.moment);
    }
}(this, function(moment) {
var DateRange, INTERVALS;

INTERVALS = {
  year: true,
  month: true,
  week: true,
  day: true,
  hour: true,
  minute: true,
  second: true
};

/**
  * DateRange class to store ranges and query dates.
  * @typedef {!Object}
*
*/


DateRange = (function() {
  /**
    * DateRange instance.
    * @param {(Moment|Date)} start Start of interval.
    * @param {(Moment|Date)} end   End of interval.
    * @constructor
  *
  */

  function DateRange(start, end) {
    this.start = moment(start);
    this.end = moment(end);
  }

  /**
    * Determine if the current interval contains a given moment/date/range.
    * @param {(Moment|Date|DateRange)} other Date to check.
    * @return {!boolean}
  *
  */


  DateRange.prototype.contains = function(other) {
    if (other instanceof DateRange) {
      return this.start <= other.start && this.end >= other.end;
    } else {
      return (this.start <= other && other <= this.end);
    }
  };

  /**
    * @private
  *
  */


  DateRange.prototype._by_string = function(interval, hollaback) {
    var current, _results;
    current = moment(this.start);
    _results = [];
    while (this.contains(current)) {
      hollaback.call(this, current.clone());
      _results.push(current.add(1, interval));
    }
    return _results;
  };

  /**
    * @private
  *
  */


  DateRange.prototype._by_range = function(range_interval, hollaback) {
    var i, l, _i, _results;
    l = Math.floor(this / range_interval);
    if (l === Infinity) {
      return this;
    }
    _results = [];
    for (i = _i = 0; 0 <= l ? _i <= l : _i >= l; i = 0 <= l ? ++_i : --_i) {
      _results.push(hollaback.call(this, moment(this.start.valueOf() + range_interval.valueOf() * i)));
    }
    return _results;
  };

  /**
    * Determine if the current date range overlaps a given date range.
    * @param {!DateRange} range Date range to check.
    * @return {!boolean}
  *
  */


  DateRange.prototype.overlaps = function(range) {
    return this.intersect(range) !== null;
  };

  /**
    * Determine the intersecting periods from one or more date ranges.
    * @param {!DateRange} other A date range to intersect with this one.
    * @return {!DateRange|null}
  *
  */


  DateRange.prototype.intersect = function(other) {
    var _ref, _ref1, _ref2, _ref3, _ref4, _ref5, _ref6, _ref7;
    if (((this.start <= (_ref1 = other.start) && _ref1 < (_ref = this.end)) && _ref < other.end)) {
      return new DateRange(other.start, this.end);
    } else if (((other.start < (_ref3 = this.start) && _ref3 < (_ref2 = other.end)) && _ref2 <= this.end)) {
      return new DateRange(this.start, other.end);
    } else if (((other.start < (_ref5 = this.start) && _ref5 < (_ref4 = this.end)) && _ref4 < other.end)) {
      return this;
    } else if (((this.start <= (_ref7 = other.start) && _ref7 < (_ref6 = other.end)) && _ref6 <= this.end)) {
      return other;
    } else {
      return null;
    }
  };

  /**
    * Subtract one range from another.
    * @param {!DateRange} other A date range to substract from this one.
    * @return {!DateRange[]}
  *
  */


  DateRange.prototype.subtract = function(other) {
    var _ref, _ref1, _ref2, _ref3, _ref4, _ref5, _ref6, _ref7;
    if (this.intersect(other) === null) {
      return [this];
    } else if (((other.start <= (_ref1 = this.start) && _ref1 < (_ref = this.end)) && _ref <= other.end)) {
      return [];
    } else if (((other.start <= (_ref3 = this.start) && _ref3 < (_ref2 = other.end)) && _ref2 < this.end)) {
      return [new DateRange(other.end, this.end)];
    } else if (((this.start < (_ref5 = other.start) && _ref5 < (_ref4 = this.end)) && _ref4 <= other.end)) {
      return [new DateRange(this.start, other.start)];
    } else if (((this.start < (_ref7 = other.start) && _ref7 < (_ref6 = other.end)) && _ref6 < this.end)) {
      return [new DateRange(this.start, other.start), new DateRange(other.end, this.end)];
    }
  };

  /**
    * Iterate over the date range by a given date range, executing a function
    * for each sub-range.
    * @param {!DateRange|String} range     Date range to be used for iteration
    *                                      or shorthand string (shorthands:
    *                                      http://momentjs.com/docs/#/manipulating/add/)
    * @param {!function(Moment)} hollaback Function to execute for each sub-range.
    * @return {!boolean}
  *
  */


  DateRange.prototype.by = function(range, hollaback) {
    if (typeof range === 'string') {
      this._by_string(range, hollaback);
    } else {
      this._by_range(range, hollaback);
    }
    return this;
  };

  /**
    * Date range in milliseconds. Allows basic coercion math of date ranges.
    * @return {!number}
  *
  */


  DateRange.prototype.valueOf = function() {
    return this.end - this.start;
  };

  /**
    * Date range toDate
    * @return  {!Array}
  *
  */


  DateRange.prototype.toDate = function() {
    return [this.start.toDate(), this.end.toDate()];
  };

  /**
    * Determine if this date range is the same as another.
    * @param {!DateRange} other Another date range to compare to.
    * @return {!boolean}
  *
  */


  DateRange.prototype.isSame = function(other) {
    return this.start.isSame(other.start) && this.end.isSame(other.end);
  };

  /**
    * Return the difference of the end vs start.
    *   - To get the difference in milliseconds, use range#diff
    *   - To get the difference in another unit of measurement, pass that measurement as the second argument.
    * @return milliseconds if no measure is passed in, otherwise an increment of measure
  *
  */


  DateRange.prototype.diff = function(unit) {
    if (unit == null) {
      unit = void 0;
    }
    return this.end.diff(this.start, unit);
  };

  return DateRange;

})();

/**
  * Build a date range.
  * @param {(Moment|Date)} start Start of range.
  * @param {(Moment|Date)} end   End of range.
  * @this {Moment}
  * @return {!DateRange}
*
*/


moment.fn.range = function(start, end) {
  if (start in INTERVALS) {
    return new DateRange(moment(this).startOf(start), moment(this).endOf(start));
  } else {
    return new DateRange(start, end);
  }
};

/**
  * Build a date range.
  * @param {(Moment|Date)} start Start of range.
  * @param {(Moment|Date)} end   End of range.
  * @this {Moment}
  * @return {!DateRange}
*
*/


moment.range = function(start, end) {
  return new DateRange(start, end);
};

/**
  * Check if the current moment is within a given date range.
  * @param {!DateRange} range Date range to check.
  * @this {Moment}
  * @return {!boolean}
*
*/


moment.fn.within = function(range) {
  return range.contains(this._d);
};

    return moment;
}));
