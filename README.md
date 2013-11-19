moment-range
============

Fancy date ranges for [Moment.js][moment].


Examples
--------

### Create

Create a date range:

``` javascript
var start = new Date(2012, 0, 15)
  , end   = new Date(2012, 4, 23)
  , range = moment().range(start, end);
```

You can also create a date range with moment objects:

``` javascript
var start = moment("2011-04-15", "YYYY-MM-DD")
  , end   = moment("2011-11-27", "YYYY-MM-DD")
  , range = moment().range(start, end);
```

### Contains / Within

Check to see if your range contains a date/moment:

``` javascript
var start = new Date(2012, 4, 1)
  , end   = new Date(2012, 4, 23)
  , lol   = new Date(2012, 4, 15)
  , wat   = new Date(2012, 2, 27)
  , range = moment().range(start, end);

range.contains(lol); // true
range.contains(wat); // false
```

Find out if your moment falls within a date range:

``` javascript
var start = new Date(2012, 4, 1)
  , end   = new Date(2012, 4, 23)
  , when  = moment("2012-05-10", "YYYY-MM-DD")
  , range = moment().range(start, end);

when.within(range); // true
```

### Iterate

Iterate over your date range by another range:

``` javascript
var start = new Date(2012, 2, 1)
  , two   = new Date(2012, 2, 2)
  , end   = new Date(2012, 2, 5)
  , range1 = moment().range(start, end)
  , range2 = moment().range(start, two) // One day
  , acc = [];

range1.by(range2, function(moment) {
  // Do something with `moment`
  acc.push(moment);
});

acc.length == 5 // true
```

### Compare

Compare range lengths or add them together with simple math:

``` javascript
var r_1 = moment().range(new Date(2011, 2, 5), new Date(2011, 3, 15))
  , r_2 = moment().range(new Date(1995, 0, 1), new Date(1995, 12, 25));

r_2 > r_1 // true

r_1 + r_2 // duration of both ranges in milliseconds

Math.abs(r_1 - r_2); // difference of ranges in milliseconds
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
{ "moment-range": "~0.1" }
```


### Bower

``` sh
bower install moment-range
```


Running Tests
-------------

Clone this bad boy:

``` bash
$ git clone https://git@github.com/gf3/moment-range.git
```

Install the dependencies:

``` bash
$ npm install
```

Run the tests:

``` bash
$ ./node_modules/.bin/cake test
```


License
-------

moment-range is [UNLICENSED][unlicense].

[moment]: http://momentjs.com/
[node]: http://nodejs.org/
[unlicense]: http://unlicense.org/

