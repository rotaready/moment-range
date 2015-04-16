INTERVALS =
  year:   true
  month:  true
  week:   true
  day:    true
  hour:   true
  minute: true
  second: true

###*
  * DateRange class to store ranges and query dates.
  * @typedef {!Object}
*###
class DateRange
  ###*
    * DateRange instance.
    *
    * @param {(Moment|Date)} start Start of interval
    * @param {(Moment|Date)} end   End of interval
    *
    * @constructor
  *###
  constructor: (start, end) ->
    @start = moment(start)
    @end   = moment(end)

  ###*
    * Deep clone range
    * @return {!DateRange}
  *###
  clone: ->
    moment().range(@start, @end)

  ###*
    * Determine if the current interval contains a given moment/date/range.
    *
    * @param {(Moment|Date|DateRange)} other Date to check
    * @param {!boolean} exclusive True if the to value is exclusive
    *
    * @return {!boolean}
  *###
  contains: (other, exclusive) ->
    if other instanceof DateRange
      @start <= other.start and (@end > other.end or (@end.isSame(other.end) and not exclusive))
    else
      @start <= other and (@end > other or (@end.isSame(other) and not exclusive))

  ###*
    * @private
  *###
  _by_string: (interval, hollaback, exclusive) ->
    current = moment(@start)
    while @contains(current, exclusive)
      hollaback.call(@, current.clone())
      current.add(1, interval)

  ###*
    * @private
  *###
  _by_range: (range_interval, hollaback, exclusive) ->
    div = @ / range_interval
    l = Math.floor(div)
    return @ if l is Infinity
    if (l == div and exclusive)
      l = l - 1


    for i in [0..l]
      hollaback.call(@, moment(@start.valueOf() + range_interval.valueOf() * i))

  ###*
    * Determine if the current date range overlaps a given date range.
    *
    * @param {!DateRange} range Date range to check
    *
    * @return {!boolean}
  *###
  overlaps: (range) ->
    @intersect(range) != null

  ###*
    * Determine the intersecting periods from one or more date ranges.
    *
    * @param {!DateRange} other A date range to intersect with this one
    *
    * @return {!DateRange|null}
  *###
  intersect: (other) ->
    if @start <= other.start < @end < other.end
      new DateRange(other.start, @end)
    else if other.start < @start < other.end <= @end
      new DateRange(@start, other.end)
    else if other.start < @start <= @end < other.end
      @
    else if @start <= other.start <= other.end <= @end
      other
    else
      null

    ###*
    * Merge date ranges if they intersect.
    *
    * @param {!DateRange} other A date range to add to this one
    *
    * @return {!DateRange|null}
  *###
  add: (other) ->
    if @overlaps(other)
      new DateRange( moment.min(@start, other.start), moment.max(@end, other.end)  )
    else
      null

  ###*
    * Subtract one range from another.
    *
    * @param {!DateRange} other A date range to substract from this one
    *
    * @return {!DateRange[]}
  *###
  subtract: (other) ->
    if @intersect(other) == null
      [@]
    else if other.start <= @start < @end <= other.end
      []
    else if other.start <= @start < other.end < @end
      [new DateRange(other.end, @end)]
    else if @start < other.start < @end <= other.end
      [new DateRange(@start, other.start)]
    else if @start < other.start < other.end < @end
      [new DateRange(@start, other.start),
       new DateRange(other.end, @end)]


  ###*
    * Iterate over the date range by a given date range, executing a function
    * for each sub-range.
    *
    * @param {(!DateRange|String)} range     Date range to be used for iteration
    *                                        or shorthand string (shorthands:
    *                                        http://momentjs.com/docs/#/manipulating/add/)
    * @param {!function(Moment)}   hollaback Function to execute for each sub-range
    * @param {!boolean}            exclusive Indicate that the end of the range
    *                                        should not be included in the iter.
    *
    * @return {!boolean}
  *###
  by: (range, hollaback, exclusive) ->
    if typeof range is 'string'
      @_by_string(range, hollaback, exclusive)
    else
      @_by_range(range, hollaback, exclusive)
    @ # Chainability

  ###*
    * Date range in milliseconds. Allows basic coercion math of date ranges.
    *
    * @return {!number}
  *###
  valueOf: ->
    @end - @start

  ###*
    * Center date of the range.
    * @return {!Moment}
  *###
  center: ->
    center = @start + @diff()/2
    moment(center)

  ###*
    * Date range toDate
    *
    * @return {!Array}
  *###
  toDate: ->
    [@start.toDate(), @end.toDate()]

  ###*
    * Determine if this date range is the same as another.
    *
    * @param {!DateRange} other Another date range to compare to
    *
    * @return {!boolean}
  *###
  isSame: (other) ->
    @start.isSame(other.start) and @end.isSame(other.end)

  ###*
    * The difference of the end vs start.
    *
    * @param {number} unit Unit of difference, if no unit is passed in
    *                      milliseconds are returned. E.g.: `"days"`,
    *                      `"months"`, etc...
    *
    * @return {!number}
  *###
  diff: (unit = undefined) ->
    @end.diff(@start, unit)

###*
  * Build a date range.
  *
  * @param {(Moment|Date)} start Start of range
  * @param {(Moment|Date)} end   End of range
  *
  * @this {Moment}
  *
  * @return {!DateRange}
*###
moment.range = (start, end) ->
  if start of INTERVALS
    new DateRange(moment(@).startOf(start), moment(@).endOf(start))
  else
    new DateRange(start, end)

###*
  * Expose constructor
*###
moment.range.constructor = DateRange

###*
  * @deprecated
*###
moment.fn.range = moment.range

###*
  * Check if the current moment is within a given date range.
  *
  * @param {!DateRange} range Date range to check
  *
  * @this {Moment}
  *
  * @return {!boolean}
*###
moment.fn.within = (range) ->
  range.contains(@_d)
