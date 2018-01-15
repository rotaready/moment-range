import * as M from 'moment';
import {DateRange, extendMoment} from 'moment-range';

const moment = extendMoment(M);


//-----------------------------------------------------------------------------
// Typescript Tests
//-----------------------------------------------------------------------------

moment.parseZoneRange('2015-01-17T09:50:04+03:00/2015-04-17T08:29:55-04:00');

moment.range(new Date(), new Date());
moment.range(moment(), moment());
moment.range([new Date(), new Date()]);
moment.range([moment(), moment()]);
moment.range('year');

moment.rangeFromInterval('day');
moment.rangeFromInterval('day', 3);
moment.rangeFromInterval('day', 3, moment());

moment().isRange(moment.range('hour'));

moment().within(moment.range('hour'));

new DateRange(new Date(), new Date());
new DateRange(moment(), moment());
new DateRange([new Date(), new Date()]);
new DateRange([moment(), moment()]);
new DateRange('year');

// Adjacent
const range001 = new DateRange('year');
range001.adjacent(new DateRange('month'));

// Add
const range002 = new DateRange('day');
range002.add(new DateRange('month'));

// By
const range003 = new DateRange('year');
range003.by('months');
range003.by('months', {exclusive: true});
range003.by('months', {step: 2});
range003.by('months', {exclusive: true, step: 2});

// By Range
const range004 = new DateRange('year');
range004.byRange(new DateRange('month'));

// Center
const range005 = new DateRange('year');
range005.center();

// Clone
const range006 = new DateRange('year');
range006.clone();

// Contains
const range007 = new DateRange('year');
range007.contains(new Date());
range007.contains(new DateRange('day'));
range007.contains(moment());
range007.contains(new Date(), {excludeStart: true});
range007.contains(new DateRange('day'), {excludeStart: true});
range007.contains(moment(), {excludeStart: true});
range007.contains(new Date(), {excludeEnd: true});
range007.contains(new DateRange('day'), {excludeEnd: true});
range007.contains(moment(), {excludeEnd: true});
range007.contains(new Date(), {excludeStart: true, excludeEnd: true});
range007.contains(new DateRange('day'), {excludeStart: true, excludeEnd: true});
range007.contains(moment(), {excludeStart: true, excludeEnd: true});
range007.contains(new Date(), {exclusive: true}); // DEPRECATED
range007.contains(new DateRange('day'), {exclusive: true}); // DEPRECATED
range007.contains(moment(), {exclusive: true}); // DEPRECATED

// Diff
const range008 = new DateRange('year');
range008.diff();
range008.diff('month');
range008.diff('month', true);

// Duration
const range009 = new DateRange('year');
range009.duration();
range009.duration('month');
range009.duration('month', true);

// Intersect
const range010 = new DateRange('year');
range010.intersect(new DateRange('month'));

// Is Equal
const range011 = new DateRange('year');
range011.isEqual(new DateRange('month'));

// Is Same
const range012 = new DateRange('year');
range012.isSame(new DateRange('month'));

// Overlaps
const range013 = new DateRange('year');
range013.overlaps(new DateRange('month'));
range013.overlaps(new DateRange('month'), {adjacent: true});

// Reverse By
const range014 = new DateRange('year');
range014.reverseBy('months');
range014.reverseBy('months', {exclusive: true});
range014.reverseBy('months', {step: 2});
range014.reverseBy('months', {exclusive: true, step: 2});

// Reverse By Range
const range015 = new DateRange('year');
range015.reverseByRange(new DateRange('month'));

// Subtract
const range016 = new DateRange('year');
range016.subtract(new DateRange('month'));

// To Date
const range017 = new DateRange('year');
range017.toDate();

// To String
const range018 = new DateRange('year');
range018.toString();
range018 + '';

// Value Of
const range019 = new DateRange('year');
range019.valueOf();
// range019 + 1;
