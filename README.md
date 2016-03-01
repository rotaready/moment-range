# moment-range

Fancy date ranges for [Moment.js][moment].

Detailed API documentation can be found at: http://gf3.github.io/moment-range/DateRange.html

<!-- START doctoc generated TOC please keep comment here to allow auto update -->
<!-- DON'T EDIT THIS SECTION, INSTEAD RE-RUN doctoc TO UPDATE -->

- [Examples](#examples)
  - [Create](#create)
  - [Contains / Within / Overlaps / Intersect / Add / Subtract](#contains--within--overlaps--intersect--add--subtract)
  - [Iterate](#iterate)
  - [Compare](#compare)
  - [Equality](#equality)
  - [Difference](#difference)
  - [Conversion](#conversion)
    - [`toArray`](#toarray)
    - [`toDate`](#todate)
    - [`toString`](#tostring)
    - [`valueOf`](#valueof)
  - [Center](#center)
  - [Clone](#clone)
- [Installation](#installation)
  - [Browser](#browser)
  - [NPM](#npm)
  - [Bower](#bower)
- [Running Tests](#running-tests)
- [License](#license)

<!-- END doctoc generated TOC please keep comment here to allow auto update -->


## Examples

### Create

Create a date range:

``` javascript
var start = new Date(2012, 0, 15);
var end   = new Date(2012, 4, 23);
var range = moment.range(start, end);
```

You can also create a date range with moment objects:

``` javascript
var start = moment("2011-04-15", "YYYY-MM-DD");
var end   = moment("2011-11-27", "YYYY-MM-DD");
var range = moment.range(start, end);
```

Arrays work too:

``` javascript
var dates = [moment("2011-04-15", "YYYY-MM-DD"), moment("2011-11-27", "YYYY-MM-DD")];
var range = moment.range(dates);
```

You can also create a range from an [ISO 8601 time interval][interval] string:

``` javascript
var timeInterval = "2015-01-17T09:50:04+00:00/2015-04-17T08:29:55+00:00";
var range = moment.range(timeInterval);
```

You can also create a range from the start until the end of a named interval:

``` javascript
var date = moment("2011-04-15", "YYYY-MM-DD");
var range = date.range("month");
```

You can also create open-ended ranges which go to the earliest or latest possible date:

``` javascript
var rangeUntil = moment.range(null, "2011-05-05");
var rangeFrom = moment.range("2011-03-05", null);
var rangeAllTime = moment.range(null, null);
```

### Contains / Within / Overlaps / Intersect / Add / Subtract

Check to see if your range contains a date/moment:

``` javascript
var start  = new Date(2012, 4, 1);
var end    = new Date(2012, 4, 23);
var lol    = new Date(2012, 4, 15);
var wat    = new Date(2012, 4, 27);
var range  = moment.range(start, end);
var range2 = moment.range(lol, wat);

range.contains(lol); // true
range.contains(wat); // false
```

A optional second parameter indicates if the end of the range
should be excluded when testing for inclusion

``` javascript
range.contains(end) // true
range.contains(end, false) // true
range.contains(end, true) // false
```

Find out if your moment falls within a date range:

``` javascript
var start = new Date(2012, 4, 1);
var end   = new Date(2012, 4, 23);
var when  = moment("2012-05-10", "YYYY-MM-DD");
var range = moment.range(start, end);

when.within(range); // true
```

Does it overlap another range?

``` javascript
range.overlaps(range2); // true
```

What are the intersecting ranges?

``` javascript
range.intersect(range2); // [moment.range(lol, end)]
```

Add/combine/merge overlapping ranges.

``` javascript
range.add(range2); // [moment.range(start, wat)]

var range3 = moment.range(new Date(2012, 3, 1), new Date(2012, 3, 15);
range.add(range3); // [null]
```

Subtracting one range from another.

``` javascript
range.subtract(range2); // [moment.range(start, lol)]
```

### Iterate

Iterate over your date range by an amount of time or another range:

``` javascript
var start = new Date(2012, 2, 1);
var two   = new Date(2012, 2, 2);
var end   = new Date(2012, 2, 5);
var range1 = moment.range(start, end);
var range2 = moment.range(start, two); // One day
var acc = [];

range1.by('days', function(moment) {
  // Do something with `moment`
});
```

Any of the units accepted by [moment.js' `add`
method](http://momentjs.com/docs/#/manipulating/add/) may be used.

You can also iterate by another range:

``` javascript
range1.by(range2, function(moment) {
  // Do something with `moment`
  acc.push(moment);
});

acc.length == 5 // true
```

Iteration also supports excluding the end value of the range by setting the
last parameter to `true`.

``` javascript
var acc = [];

range1.by('d', function (moment) {
  acc.push(moment)
}, true);

acc.length == 4 // true
```

### Compare

Compare range lengths or add them together with simple math:

``` javascript
var r_1 = moment.range(new Date(2011, 2, 5), new Date(2011, 3, 15));
var r_2 = moment.range(new Date(1995, 0, 1), new Date(1995, 12, 25));

r_2 > r_1 // true

r_1 + r_2 // duration of both ranges in milliseconds

Math.abs(r_1 - r_2); // difference of ranges in milliseconds
```

### Equality

Check if two ranges are the same, i.e. their starts and ends are the same:

``` javascript
var r_1 = moment.range(new Date(2011, 2, 5), new Date(2011, 3, 15));
var r_2 = moment.range(new Date(2011, 2, 5), new Date(2011, 3, 15));
var r_3 = moment.range(new Date(2011, 3, 5), new Date(2011, 6, 15));

r_1.isSame(r_2); // true
r_2.isSame(r_3); // false
```

### Difference

The difference of the entire range given various units.

Any of the units accepted by [moment.js' `add`
method](http://momentjs.com/docs/#/manipulating/add/) may be used.

``` javascript
var start = new Date(2011, 2, 5);
var end   = new Date(2011, 5, 5);
var dr    = moment.range(start, end);

dr.diff('months'); // 3
dr.diff('days'); // 92
dr.diff(); // 7945200000
```

### Conversion

#### `toArray`

Converts the `DateRange` to an `Array` of `Date` objects.

``` javascript
var start = new Date(2011, 2, 5);
var end   = new Date(2011, 5, 5);
var dr    = moment.range(start, end);

dr.toArray('days'); // [new Date(2011, 2, 5), new Date(2011, 3, 5), new Date(2011, 4, 5), new Date(2011, 5, 5)]
```

#### `toDate`

Converts the `DateRange` to an `Array` of the start and end `Date` objects.

``` javascript
var start = new Date(2011, 2, 5);
var end   = new Date(2011, 5, 5);
var dr    = moment.range(start, end);

dr.toDate(); // [new Date(2011, 2, 5), new Date(2011, 5, 5)]
```

#### `toString`

Converting a `DateRange` to a `String` will format it as an [ISO 8601 time
interval][interval]:

``` javascript
var start = '2015-01-17T09:50:04+00:00';
var end   = '2015-04-17T08:29:55+00:00';
var range = moment.range(moment.utc(start), moment.utc(end));

range.toString() // "2015-01-17T09:50:04+00:00/2015-04-17T08:29:55+00:00"
```

#### `valueOf`

The difference between the end date and start date in milliseconds.

``` javascript
var start = new Date(2011, 2, 5);
var end   = new Date(2011, 5, 5);
var range = moment.range(start, end);

range.valueOf(); // 7945200000
```

### Center

Calculate the center of a range

``` javascript
var start = new Date(2011, 2, 5);
var end   = new Date(2011, 3, 5);
var dr    = moment.range(start, end);

dr.center(); // 1300622400000
```

### Clone

Deep clone a range

``` javascript
var start = new Date(2011, 2, 5);
var end   = new Date(2011, 3, 5);
var dr    = moment.range(start, end);

var dr2 = dr.clone();
dr2.start.add(2, 'days');

dr2.start.toDate() === dr.start.toDate() // false
```


## Installation

moment-range works in both the browser and [node.js][node].

### Node / NPM

Install via npm:

``` sh
npm install moment-range
```

And then `require` it:

``` javascript
var moment = require('moment');
require('moment-range');
```

### Browser

Simply include moment-range after moment.js:

``` html
<script src="moment.js"></script>
<script src="moment-range.js"></script>
```

Thanks to the fine people at [cdnjs][cdnjs], you can link to moment-range from
the [cdnjs servers][cdnjs-moment-range].

### Bower

``` sh
bower install moment-range
```

**Note:** Include `moment-range` _after_ `moment`.


## Running Tests

Clone this bad boy:

``` bash
git clone https://git@github.com/gf3/moment-range.git
```

Install the dependencies:

``` bash
npm install
```

Do all the things!

``` bash
npm run-script build
npm run-script test
npm run-script jsdoc
```


## License

moment-range is [UNLICENSED][unlicense].

[cdnjs]: https://github.com/cdnjs/cdnjs
[cdnjs-moment-range]: https://cdnjs.com/libraries/moment-range
[interval]: http://en.wikipedia.org/wiki/ISO_8601#Time_intervals
[moment]: http://momentjs.com/
[node]: http://nodejs.org/
[unlicense]: http://unlicense.org/
