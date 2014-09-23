moment-range
============

Fancy date ranges for [Moment.js][moment].


Examples
--------

### Create

Create a date range:

``` javascript
var start = new Date(2012, 0, 15);
var end   = new Date(2012, 4, 23);
var range = moment().range(start, end);
```

You can also create a date range with moment objects:

``` javascript
var start = moment("2011-04-15", "YYYY-MM-DD");
var end   = moment("2011-11-27", "YYYY-MM-DD");
var range = moment().range(start, end);
```

### Contains / Within / Overlaps / Intersect / Subtract

Check to see if your range contains a date/moment:

``` javascript
var start  = new Date(2012, 4, 1);
var end    = new Date(2012, 4, 23);
var lol    = new Date(2012, 4, 15);
var wat    = new Date(2012, 2, 27);
var range  = moment().range(start, end);
var range2 = moment().range(lol, wat);

range.contains(lol); // true
range.contains(wat); // false
```

Find out if your moment falls within a date range:

``` javascript
var start = new Date(2012, 4, 1);
var end   = new Date(2012, 4, 23);
var when  = moment("2012-05-10", "YYYY-MM-DD");
var range = moment().range(start, end);

when.within(range); // true
```

Does it overlap another range?

``` javascript
range.overlaps(range2); // true
```

What are the intersecting ranges?

``` javascript
range.intersect(range2); // [moment().range(lol, end)]
```

Subtracting one range from another.

``` javascript
range.subtract(range2); // [moment().range(start, lol)]
```

### Iterate

Iterate over your date range by an amount of time or another range:

``` javascript
var start = new Date(2012, 2, 1);
var two   = new Date(2012, 2, 2);
var end   = new Date(2012, 2, 5);
var range1 = moment().range(start, end);
var range2 = moment().range(start, two); // One day
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

### Compare

Compare range lengths or add them together with simple math:

``` javascript
var r_1 = moment().range(new Date(2011, 2, 5), new Date(2011, 3, 15));
var r_2 = moment().range(new Date(1995, 0, 1), new Date(1995, 12, 25));

r_2 > r_1 // true

r_1 + r_2 // duration of both ranges in milliseconds

Math.abs(r_1 - r_2); // difference of ranges in milliseconds
```

### Equality

Check if two ranges are the same, i.e. their starts and ends are the same:

``` javascript
var r_1 = moment().range(new Date(2011, 2, 5), new Date(2011, 3, 15));
var r_2 = moment().range(new Date(2011, 2, 5), new Date(2011, 3, 15));
var r_3 = moment().range(new Date(2011, 3, 5), new Date(2011, 6, 15));

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

#### `toDate`

``` javascript
var start = new Date(2011, 2, 5);
var end   = new Date(2011, 5, 5);
var dr    = moment.range(start, end);

dr.toDate(); // [new Date(2011, 2, 5), new Date(2011, 5, 5)]
```


Installation
------------

moment-range works in both the browser and [node.js][node].


### Browser

Simply include moment-range after moment.js:

``` html
<script src="/javascripts/moment-range.js"></script>
```


### NPM

Install via npm:

``` sh
npm install moment-range
```

Or put it in your `package.json`:

``` json
{ "moment-range": "~1" }
```


### Bower

``` sh
bower install moment-range
```


Running Tests
-------------

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
npm build
npm test
```


License
-------

moment-range is [UNLICENSED][unlicense].

[moment]: http://momentjs.com/
[node]: http://nodejs.org/
[unlicense]: http://unlicense.org/
