((root, factory) ->
  if typeof define is "function" and define.amd

    # AMD. Register as an anonymous module.
    define ["moment"], factory
  else if typeof exports is "object"

    # Node. Does not work with strict CommonJS, but
    # only CommonJS-like enviroments that support module.exports,
    # like Node.
    module.exports = factory(require("moment"))
  else

    # Browser globals (root is window)
    root.returnExports = factory(root.moment)
) this, (moment) ->

  ###*
    * DateRange class to store ranges and query dates.
    * @typedef {!Object}
  *###
  class DateRange
    ###*
      * DateRange instance.
      * @param {(Moment|Date)} start Start of interval.
      * @param {(Moment|Date)} end   End of interval.
      * @constructor
    *###
    constructor: (start, end) ->
      @start =  moment(start)
      @end = moment(end)

    ###*
      * Determine if the current interval contains a given moment/date.
      * @param {(Moment|Date)} moment Date to check.
      * @return {!boolean}
    *###
    contains: (moment) ->
      @start <= moment <= @end

    # @private
    _by_string: (interval, hollaback) ->
      current = moment(@start)
      while (@.contains(current))
        hollaback.call(@, current.clone())
        current.add(interval, 1)

    # @private
    _by_range: (range_interval, hollaback) ->
      l = Math.round @ / range_interval
      return @ if l is Infinity

      for i in [0..l]
        hollaback.call @, moment(@start.valueOf() + range_interval.valueOf() * i)

    ###*
      * Determine if the current date range overlaps a given date range.
      * @param {DateRange} range Date range to check.
      * @return {!boolean}
    *###
    overlaps: (range) ->
      @start < range.end and @end > range.start

    ###*
      * Iterate over the date range by a given date range, executing a function
      * for each sub-range.
      * @param {!DateRange|String}        range     Date range to be used for iteration or shorthand string (shorthands: http://momentjs.com/docs/#/manipulating/add/)
      * @param {!function(Moment)} hollaback Function to execute for each sub-range.
      * @return {!boolean}
    *###
    by: (range, hollaback) ->
      if typeof range is 'string'
        @._by_string(range, hollaback)
      else
        @._by_range(range, hollaback)
      @ # Chainability

    ###*
      * Date range in milliseconds. Allows basic coercion math of date ranges.
      * @return {!number}
    *###
    valueOf: ->
      @end - @start

  ###*
    * Build a date range.
    * @param {(Moment|Date)} start Start of range.
    * @param {(Moment|Date)} end   End of range.
    * @this {Moment}
    * @return {!DateRange}
  *###
  moment.fn.range = (start, end) ->
    new DateRange start, end

  ###*
    * Check if the current moment is within a given date range.
    * @param {!DateRange} range Date range to check.
    * @this {Moment}
    * @return {!boolean}
  *###
  moment.fn.within = (range) ->
    range.contains @_d

  return moment
