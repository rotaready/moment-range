# moment-range [![CircleCI](https://circleci.com/gh/rotaready/moment-range.svg?style=shield)](https://circleci.com/gh/rotaready/moment-range)

Fancy date ranges for [Moment.js][moment].

<!-- START doctoc generated TOC please keep comment here to allow auto update -->
<!-- DON'T EDIT THIS SECTION, INSTEAD RE-RUN doctoc TO UPDATE -->


- [Installation](#installation)
  - [Node / NPM](#node--npm)
  - [Browser](#browser)
  - [Older browsers and IE11](#older-browsers-and-ie11)
- [Examples](#examples)
  - [Create](#create)
    - [rangeFromInterval](#rangefrominterval)
    - [parseZoneRange](#parsezonerange)
    - [rangeFromISOString](#rangefromisostring)
  - [Attributes](#attributes)
  - [Querying](#querying)
    - [Adjacent](#adjacent)
    - [Center](#center)
    - [Contains](#contains)
    - [Within](#within)
    - [Overlaps](#overlaps)
    - [Intersect](#intersect)
    - [IsRange](#isrange)
  - [Manipulation](#manipulation)
    - [Add](#add)
    - [Clone](#clone)
    - [SnapTo](#snapto)
    - [Subtract](#subtract)
  - [Iteration](#iteration)
    - [by](#by)
    - [byRange](#byrange)
    - [reverseBy](#reverseby)
    - [reverseByRange](#reversebyrange)
  - [Compare](#compare)
    - [Equality](#equality)
    - [Difference](#difference)
  - [Conversion](#conversion)
    - [`toDate`](#todate)
    - [`toString`](#tostring)
    - [`valueOf`](#valueof)
- [Running Tests](#running-tests)
- [Contributors](#contributors)
- [License](#license)

<!-- END doctoc generated TOC please keep comment here to allow auto update -->


## Installation

moment-range works in both the browser and [node.js][node].

### Node / NPM

Install via npm:

``` sh
npm install --save moment-range
```

**ES6:**

``` js
import Moment from 'moment';
import { extendMoment } from 'moment-range';

const moment = extendMoment(Moment);
```

**CommonJS:**

``` js
const Moment = require('moment');
const MomentRange = require('moment-range');

const moment = MomentRange.extendMoment(Moment);
```

### Browser

``` html
<script src="moment.js"></script>
<script src="moment-range.js"></script>
```

``` js
window['moment-range'].extendMoment(moment);
```

Thanks to the fine people at [cdnjs][cdnjs], you can link to moment-range from
the [cdnjs servers][cdnjs-moment-range].


### Older browsers and IE11

This library makes use of `Symbol.iterator` to provide the [iteration
protocols] now that there is [broad support] for them, if you need to support
older browsers (specifically IE11) you will need to include a polyfill. Any of
the following should work, depending on your project configuration:

* [babel runtime transform plugin]
* [babel polyfill]
* https://github.com/medikoo/es6-iterator
* https://github.com/zloirock/core-js


## Examples

### Create

Create a date range:

``` js
const start = new Date(2012, 0, 15);
const end   = new Date(2012, 4, 23);
const range = moment.range(start, end);
```

You can also create a date range with moment objects:

``` js
const start = moment('2011-04-15', 'YYYY-MM-DD');
const end   = moment('2011-11-27', 'YYYY-MM-DD');
const range = moment.range(start, end);
```

Arrays work too:

``` js
const dates = [moment('2011-04-15', 'YYYY-MM-DD'), moment('2011-11-27', 'YYYY-MM-DD')];
const range = moment.range(dates);
```

You can also create a range from an [ISO 8601 time interval][interval] string:

``` js
const timeInterval = '2015-01-17T09:50:04+00:00/2015-04-17T08:29:55+00:00';
const range = moment.range(timeInterval);
```

You can also create a range from the start until the end of a named interval:

``` js
const date = moment('2011-04-15', 'YYYY-MM-DD');
const range = date.range('month');
```

You can also create open-ended ranges which go to the earliest or latest possible date:

``` js
const rangeUntil = moment.range(null, '2011-05-05');
const rangeFrom = moment.range('2011-03-05');
const rangeAllTime = moment.range();
```
Note that any falsy value except 0 is treated as a missing date, resulting in an open-ended range.

*Note:* Dates and moment objects both use a timestamp of 00:00:000 if none is
provided. To ensure your range includes any timestamp for the given end date,
use `.setHours(23,59,59,999)` when constructing a Date object, or
`.endOf('day')` when constructing a moment object.

#### rangeFromInterval

You can also create a range between an interval and a specified date. This accepts positive or negative values
for `count` and the date will default to _now_ if not provided.

``` js
const interval = 'month';
const count = 4;
const date = moment('2017-07-20');

const range1 = moment.rangeFromInterval(interval, count, date);  // moment.range('2017-07-20', '2017-11-20')
const range2 = moment.rangeFromInterval('month', -2, date);      // moment.range('2017-05-20', '2017-07-20')
```

Note: The date can be provided as a Date, String, or Moment.
When using a negative interval, the date provided will be set as the end of the range.

#### parseZoneRange

**DEPRECATED** in `4.0.0`: Replaced by `rangeFromISOString` to follow naming conventions.

#### rangeFromISOString

Converts an [ISO 8601 time interval string][interval] into a date range while
preserving the time zones using [moment.parseZone][parseZone].

``` js
const interval = '2015-01-17T09:50:00+03:00/2015-04-17T08:29:55-04:00';
const range = moment.rangeFromISOString(interval);

range.toString(); // '2015-01-17T09:50:00+03:00/2015-04-17T08:29:55-04:00'
```

### Attributes

You can access the start and end moments of the range easily enough:

``` js
const start = new Date(2012, 0, 15);
const end   = new Date(2012, 4, 23);
const range = moment.range(start, end);

range.start  // moment
range.end  // moment
```

### Querying

Many of the following examples make use of these moments:

``` js
const a = moment('2016-03-10');
const b = moment('2016-03-15');
const c = moment('2016-03-29');
const d = moment('2016-04-01');
```

#### Adjacent

Check if two ranges are touching but not overlapping:

``` js

const range1 = moment.range(a, b);
const range2 = moment.range(b, c);
const range3 = moment.range(c, d);

range1.adjacent(range2) // true
range1.adjacent(range3) // false
```

#### Center

Calculate the center of a range:

``` js
const start = new Date(2011, 2, 5);
const end   = new Date(2011, 3, 5);
const range = moment.range(start, end);

range.center(); // 1300622400000
```

#### Contains

Check to see if your range contains a date/moment. By default the start and end
dates are included in the search. E.g.:

``` js
const range = moment.range(a, c);

range.contains(a); // true
range.contains(b); // true
range.contains(c); // true
range.contains(d); // false
```

You can also control whether the start or end dates should be excluded from the
search with the `excludeStart` and `excludeEnd` options:

``` js
const range = moment.range(a, c);

range.contains(a); // true
range.contains(a, { excludeStart: true }); // false
range.contains(c); // true
range.contains(c, { excludeEnd: true; }); // false
```

**DEPRECATED** in `4.0.0`: The `exclusive` options is used to indicate if the start/end of
the range should be excluded when testing for inclusion:

**Note**: You can obtain the same functionality by setting `{ excludeStart:
true, excludeEnd: true }`

``` js
range.contains(c); // true
range.contains(c, { exclusive: false }); // true
range.contains(c, { exclusive: true }); // false
```

#### Within

Find out if your moment falls within a date range:

``` js
const range = moment.range(a, c);

b.within(range); // true
```

#### Overlaps

Does it overlap another range?

``` js
const range1 = moment.range(a, c);
const range2 = moment.range(b, d);
range1.overlaps(range2); // true
```

Include adjacent ranges:

``` js
const range1 = moment.range(a, b);
const range2 = moment.range(b, c);

range1.overlaps(range2)                      // false
range1.overlaps(range2, { adjacent: false }) // false
range1.overlaps(range2, { adjacent: true })  // true
```

#### Intersect

What is the intersecting range?

``` js
const range1 = moment.range(a, c);
const range2 = moment.range(b, d);
range1.intersect(range2); // moment.range(b, c)
```

#### IsRange

Is it a Range?

``` js
moment.isRange(range); // true
moment.isRange(IamNotRange); // false
```

### Manipulation

#### Add

Add/combine/merge overlapping or adjacent ranges.

``` js
const range1 = moment.range(a, c);
const range2 = moment.range(b, d);
range1.add(range2); // moment.range(a, d)

const range3 = moment.range(a, b);
const range4 = moment.range(c, d);
range3.add(range4); // null
```

Include adjacent ranges:

``` js
const range1 = moment.range(a, b);
const range2 = moment.range(b, c);

range1.add(range2); // null
range1.add(range2, { adjacent: false }); // null
range1.add(range2, { adjacent: true }); // moment.range(a, c)
```

#### Clone

Deep clone a range

``` js
const range1 = moment.range(a, d);

const range2 = range1.clone();
range2.start.add(2, 'days');

range1.start.toDate().getTime() === range2.start.toDate().getTime() // false
```

#### SnapTo

Snap the start and end of a range to a given interval.

``` js
const start = moment('2018-01-25 17:05:33');
const end = moment('2018-01-28 06:10:00');

const range1 = moment.range(start, end);
const range2 = range1.snapTo('day'); // 2018-01-25T00:00:00 -> 2018-01-28T23:59:59

range1.diff('days'); // 2
range2.diff('days'); // 3
```

#### Subtract

Subtracting one range from another.

``` js
const range_ab = moment.range(a, b);
const range_bc = moment.range(b, c);
const range_cd = moment.range(c, d);
const range_ad = moment.range(a, d);
range_ad.subtract(range_bc); // [moment.range(a, b) moment.range(c, d)]
range_ac.subtract(range_bc); // [moment.range(a, b)]
range_ab.subtract(range_cd); // [moment.range(a, b)]
range_bc.subtract(range_bd); // [null]
```

### Iteration

Each of the iteration methods returns an [Iterable][iterable], providing
a convenient and performant interface to iterating over your ranges by a given
period.

#### by

Iterate over your range by a given period. Any of the units accepted by
[moment.js' `add` method][add] may be used. E.g.: `'years' | 'quarters'
| 'months' | 'weeks' | 'days' | 'hours' | 'minutes' | 'seconds'
| 'milliseconds'`

``` js
const range = moment.range('2010-01-01', '2015-01-01');

for (let month of range.by('month')) {
  month.format('YYYY-MM-DD');
}

const years = Array.from(range.by('year'));
years.length == 6 // true
years.map(m => m.format('YYYY')) // ['2010', '2011', '2012', '2013', '2014', '2015']
```

Iteration also supports excluding the final time slice of the range by setting the
`excludeEnd` option to `true`. In the example below, the 5:00 -> 6:00 time slice is omitted.

``` js
const range = moment.range('2018-01-01 00:00', '2018-01-01 05:30');

const hours = Array.from(range.by('hour', { excludeEnd: true }));
hours.length == 5 // true
hours.map(m => m.format('HH:mm')) // ['00:00', '01:00', '02:00', '03:00', '04:00']
```

Additionally it's possible to iterate by a given step that defaults to `1`:

``` js
const start  = new Date(2012, 2, 2);
const end    = new Date(2012, 2, 6);
const range1 = moment.range(start, end);

let acc = Array.from(range1.by('day', { step: 2 }));

acc.map(m => m.format('DD')) // ['02', '04', '06']

acc = Array.from(range1.by('day', { excludeEnd: true, step: 2 }));

acc.map(m => m.format('DD')) // ['02', '04']
```

You can iterate over the span of a range for a period that is entered but not complete by using the [snapTo()](#snapto) method:

``` js
const start = moment("2017-01-01T13:30:00");
const end = moment("2017-01-05T01:45:12");
const r1 = moment.range(start, end);
const r2 = r1.snapTo('day');

Array.from(r1.by('days')).map(m => m.format('DD')); // ['01', '02', '03', '04']
Array.from(r2.by('days')).map(m => m.format('DD')); // ['01', '02', '03', '04', '05']
```

**DEPRECATED** in `4.0.0`: The `exclusive` options is used to indicate if the
end of the range should be excluded when testing for inclusion:

**Note**: You can obtain the same functionality by setting `{ excludeEnd: true }`


#### byRange

``` js
const start = new Date(2012, 2, 1); // 1st
const two   = new Date(2012, 2, 2); // 2nd
const end   = new Date(2012, 2, 5); // 5th
const range1 = moment.range(start, end);
const range2 = moment.range(start, two); // One day
```

Iterate by another range:

``` js
const acc = Array.from(range1.byRange(range2));

acc.length == 5 // true
acc.map(m => m.format('DD')) // ['01','02','03','04','05']
```

Exclude the end time slice:

``` js
const acc = Array.from(range1.byRange(range2, { excludeEnd: true }));

acc.length == 4 // true
acc.map(m => m.format('DD')) // ['01','02','03','04']
```

By step:

``` js
let acc = Array.from(range1.byRange(range2, { step: 2 }));

acc.map(m => m.format('DD')) // ['01', '03', '05']

acc = Array.from(range1.byRange(range2, { excludeEnd, true, step: 2 }));

acc.map(m => m.format('DD')) // ['01', '03']
```

**DEPRECATED** in `4.0.0`: The `exclusive` options is used to indicate if the
end of the range should be excluded when testing for inclusion:

**Note**: You can obtain the same functionality by setting `{ excludeEnd: true }`


#### reverseBy

Iterate over a range in reverse:

``` js
const range = moment.range('2012-01-01', '2015-01-01');
const acc = Array.from(range.reverseBy('years'));
acc.map(m => m.format('YYYY')) // ['2015', '2014', '2013', '2012']
```

Exclude the start time slice:

``` js
const range = moment.range('2012-01-01', '2015-01-01');
const acc = Array.from(range.reverseBy('years', { excludeStart: true }));
acc.map(m => m.format('YYYY')) // ['2015', '2014', '2013']
```

By step:

``` js
const start  = new Date(2012, 2, 2);
const end    = new Date(2012, 2, 6);
const range1 = moment.range(start, end);

let acc = Array.from(range1.reverseBy('day', { step: 2 }));

acc.map(m => m.format('DD')) // ['06', '04', '02']

acc = Array.from(range1.reverseBy('day', { excludeStart: true, step: 2 }));

acc.map(m => m.format('DD')) // ['06', '04']
```

**DEPRECATED** in `4.0.0`: The `exclusive` options is used to indicate if the
start of the range should be excluded when testing for inclusion:

**Note**: You can obtain the same functionality by setting `{ excludeStart: true }`


#### reverseByRange

``` js
const start = new Date(2012, 2, 1);
const two   = new Date(2012, 2, 2);
const end   = new Date(2012, 2, 5);
const range1 = moment.range(start, end);
const range2 = moment.range(start, two); // One day
```

Iterate by another range in reverse:

``` js
const acc = Array.from(range1.reverseByRange(range2));

acc.length == 5 // true
acc.map(m => m.format('DD')) // ['05', '04', '03', '02', '01']
```

Exclude the start value:

``` js
const acc = Array.from(range1.reverseByRange(range2, { excludeStart: true }));

acc.length == 4 // true
acc.map(m => m.format('DD')) // ['05', '04', '03', '02']
```

By step:

``` js
let acc = Array.from(range1.reverseByRange(range2, { step: 2 }));

acc.map(m => m.format('DD')) // ['05', '03', '01']

acc = Array.from(range1.reverseByRange(range2, { excludeStart: true, step: 2 }));

acc.map(m => m.format('DD')) // ['05', '03']
```

**DEPRECATED** in `4.0.0`: The `exclusive` options is used to indicate if the
start of the range should be excluded when testing for inclusion:

**Note**: You can obtain the same functionality by setting `{ excludeStart: true }`


### Compare

Compare range lengths or add them together with simple math:

``` js
const range1 = moment.range(new Date(2011, 2, 5), new Date(2011, 3, 15));
const range2 = moment.range(new Date(1995, 0, 1), new Date(1995, 12, 25));

range2 > range1 // true

range1 + range2 // duration of both ranges in milliseconds

Math.abs(range1 - range2); // difference of ranges in milliseconds
```

#### Equality

Check if two ranges are the same, i.e. their starts and ends are the same:

``` js
const range1 = moment.range(new Date(2011, 2, 5), new Date(2011, 3, 15));
const range2 = moment.range(new Date(2011, 2, 5), new Date(2011, 3, 15));
const range3 = moment.range(new Date(2011, 3, 5), new Date(2011, 6, 15));

range1.isSame(range2); // true
range2.isSame(range3); // false

range1.isEqual(range2); // true
range2.isEqual(range3); // false
```

#### Difference

The difference of the entire range given various units.

Any of the units accepted by [moment.js' `add` method][add] may be used.

``` js
const start = new Date(2011, 2, 5);
const end   = new Date(2011, 5, 5);
const range = moment.range(start, end);

range.diff('months'); // 3
range.diff('days');   // 92
range.diff();         // 7945200000
```

Optionally you may specify if the difference should be rounded, by default it
mimics moment-js' behaviour and rounds the values:

``` js
const d1 = new Date(Date.UTC(2011, 4, 1));
const d2 = new Date(Date.UTC(2011, 4, 5, 12));
const range = moment.range(d1, d2);

range.diff('days')        // 4
range.diff('days', false) // 4
range.diff('days', true)  // 4.5
```

`#duration` is an alias for `#diff` and they may be used interchangeably.

### Conversion

#### `toDate`

Converts the `DateRange` to an `Array` of the start and end `Date` objects.

``` js
const start = new Date(2011, 2, 5);
const end   = new Date(2011, 5, 5);
const range = moment.range(start, end);

range.toDate(); // [new Date(2011, 2, 5), new Date(2011, 5, 5)]
```

#### `toString`

Converting a `DateRange` to a `String` will format it as an [ISO 8601 time
interval][interval]:

``` js
const start = '2015-01-17T09:50:04+00:00';
const end   = '2015-04-17T08:29:55+00:00';
const range = moment.range(moment.utc(start), moment.utc(end));

range.toString() // '2015-01-17T09:50:04+00:00/2015-04-17T08:29:55+00:00'
```

#### `valueOf`

The difference between the end date and start date in milliseconds.

``` js
const start = new Date(2011, 2, 5);
const end   = new Date(2011, 5, 5);
const range = moment.range(start, end);

range.valueOf(); // 7945200000
```

## Running Tests

Clone this bad boy:

``` sh
git clone https://git@github.com/rotaready/moment-range.git
```

Install the dependencies:

``` sh
yarn install
```

Do all the things!

``` sh
yarn run check
yarn run test
yarn run lint
```

## Contributors

- [**Adam Biggs**](https://github.com/adambiggs) (http://lightmaker.com)
- [**Mats Julian Olsen**](https://github.com/mewwts)
- [**Matt Patterson**](https://github.com/fidothe) (http://reprocessed.org/)
- [**Wilgert Velinga**](https://github.com/wilgert) (http://neocles.io)
- [**Tomasz Bak**](https://github.com/tb) (http://twitter.com/tomaszbak)
- [**Stuart Kelly**](https://github.com/stuartleigh)
- [**Jeremy Forsythe**](https://github.com/jdforsythe)
- [**Александр Гренишин**](https://github.com/nd0ut)
- [**@scotthovestadt**](https://github.com/scotthovestadt)
- [**Thomas van Lankveld**](https://github.com/thomasvanlankveld)
- [**nebel**](https://github.com/pronebel)
- [**Kevin Ross**](https://github.com/rosskevin) (http://www.alienfast.com)
- [**Thomas Walpole**](https://github.com/twalpole)
- [**Jonathan Kim**](https://github.com/jkimbo) (http://jkimbo.co.uk)
- [**Tymon Tobolski**](https://github.com/teamon) (http://teamon.eu)
- [**Aristide Niyungeko**](https://github.com/aristiden7o)
- [**Bradley Ayers**](https://github.com/bradleyayers)
- [**Ross Hadden**](https://github.com/rosshadden) (http://rosshadden.github.com/resume)
- [**Victoria French**](https://github.com/victoriafrench)
- [**Jochen Diekenbrock**](https://github.com/JochenDiekenbrock)


## License

moment-range is [UNLICENSED][unlicense].

[add]: http://momentjs.com/docs/#/manipulating/add/
[babel runtime transform plugin]: https://babeljs.io/docs/plugins/transform-runtime
[babel polyfill]: https://babeljs.io/docs/usage/polyfill
[broad support]: http://kangax.github.io/compat-table/es6/#test-well-known_symbols_Symbol.iterator,_existence_a_href=_https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Symbol/iterator_title=_MDN_documentation_img_src=_../mdn.png_alt=_MDN_(Mozilla_Development_Network)_logo_width=_15_height=_13_/_/a_nbsp;
[cdnjs]: https://github.com/cdnjs/cdnjs
[cdnjs-moment-range]: https://cdnjs.com/libraries/moment-range
[interval]: http://en.wikipedia.org/wiki/ISO_8601#Time_intervals
[iterable]: https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Iteration_protocols#Syntaxes_expecting_iterables
[iteration protocols]: https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Iteration_protocols
[moment]: http://momentjs.com/
[node]: http://nodejs.org/
[unlicense]: http://unlicense.org/
[parseZone]: https://momentjs.com/docs/#/parsing/parse-zone/
