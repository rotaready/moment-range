# Moment Range

All notable changes to this project will be documented in this file.

The format is based on [Keep a Changelog](http://keepachangelog.com/)
and this project adheres to [Semantic Versioning](http://semver.org/).

## [Unreleased]

## [4.0.2]
### Added
* Added TypeScript & flow types missing options argument for `add` method
* Added overloaded TypeScript declarations allowing for calling `moment.range()` without arguments

### Changed
* Changed second parameter of `diff` & `duration` from `rounded` to `precise` to reflect the underlying moment method
* Changed the `moment.range()` & `DateRange` `constructor` types to allow mixed `Date` & `Moment` parameters
* Changed the `interval`/`unit` flow parameter types in the `by`, `diff`, `duration`, `reverseBy` & `snapTo` to include all strings allowed by moment
* Changed internal TypeScript version to `3.3.3333`
* Changed internal moment version to `2.24.0`
* Changed CircleCI to version `2`

### Fixed
* Fixed the return type of `add` and `intersect` to `DateRange | null` as opposed to `DateRange | undefined`
* Fixed the flow `toDate()` method return type from an array of `Date`s to a `Date` tuple
* Fixed `extendMoment()` typescript declaration to give access to moment namespace variables, e.g. `moment.duration()`, `moment.HTML5_FMT`

## [4.0.1]
### Fixed

* Fixed `eslint-plugin-import` pointing to non-existing file

## [4.0.0]
### Deprecated

* Deprecated `exclusive` option of `contains()` method in favour of new
  `excludeStart` and `excludeEnd` options
* Deprecated `exclusive` option of `by()` method in favour of new `excludeEnd` options
* Deprecated `exclusive` option of `byRange()` method in favour of new `excludeEnd` options
* Deprecated `exclusive` option of `reverseBy()` method in favour of new `excludeStart` options
* Deprecated `exclusive` option of `reverseByRange()` method in favour of new `excludeStart` options
* Deprecated `parseZoneRange` in favour of `rangeFromISOString`

### Added

* Added Typescript definitions
* Added Typescript config and tests
* Added `check`, `typescript-test` npm script
* Added `excludeStart` and `excludeEnd` to `contains()` method
* Added `excludeEnd` to `by()` method
* Added `excludeEnd` to `byRange()` method
* Added `excludeStart` to `reverseBy()` method
* Added `excludeStart` to `reverseByRange()` method
* Added note about supporting older browsers with links to polyfills to the README
* Added moment extension `rangeFromISOString`, changed name from `parseZoneRange`
* Added `snapTo()` method
* Added explicit Flow typing tests

### Changed

* Changed `build` script to use webpack's production settings for a more
  optimized build
* Changed `prepublish` script to `prepublishOnly` so the task isn't run on
  `install`
* Changed `prepublishOnly` and `version` scripts to use `&&` instead of `;`
* Changed `prepublish`, `preversion`, `version` scripts to support typescript definitions
* Changed CircleCI config to also run typescript tests
* Changed `parseZoneRange` to `rangeFromISOString` to follow naming conventions. Deprecated `parseZoneRange`.
* Changed typing tests to be grouped by type-checker (flow, typescript)
* Changed test suffix (`_test.js` → `.test.js`)
* Changed test file location (`./lib/` → `./lib/tests/`)
* Changed package json script names:
    - `flow` → `check:flow`
    - `typescript-test` → `check:typescript`
* Changed CircleCI to use Node 8.2.0
* Changed CircleCI to use Yarn
* Changed Flow config to find correct declarations
* Changed location of Flow declaration (`./declarations/` → `./lib/`)

### Fixed

* Fixed `intersect` not creating a new DateRange instance in all cases
* Fixed Flow declaration to provide correct and stricter typings
* Fixed DateRange constructor poor performance when passed moment objects

### Removed

* Removed `lib/` from package.json files
* Removed a bunch of unused Flow types

## [3.1.1]
### Fixed
* Fixed intersection rules for zero-length ranges on start/end boundaries

## [3.1.0]
### Added

* Added function `isRange` as a simple and clear way to check if a variable is a DateRange
* Added moment extension `parseZoneRange` to preserve timezone of start/end dates in a new range
* Added moment extension `rangeFromInterval` to create a range between a date and a specified interval

### Changed

* Changed open-ended ranges to accept any falsy value (except 0)
* Changed `add` function: now has an option for adding adjacent ranges
* Changed *README*: tidied documentation examples

### Fixed

* Fixed typo in *README* in method `add`
* Fixed webpack output path for webpack >2.3.0
* Fixed linter errors/warnings for development
* Fixed repository URLs in *CHANGELOG*

## [3.0.3]
### Changed

* 'module' has been replaced with 'jsnext:main' to support both rollup and webpack 2

## [3.0.2]
### Changed

* `lib` is now included in npm release to allow packagers to repackage the library
* Update to webpack 2
* Add @victoriafrench to *CONTRIBUTORS*
* Add @JochenDiekenbrock to *CONTRIBUTORS*

## [3.0.1]
### Added

* Added contributors to *README*
* Added CircleCI badge to *README*
* Added yarn lockfile
* Added polyfill for `Symbol`

### Changed

* Updated contributors in *package.json*
* Updated usage instructions for browsers (`window['moment-range']`)
* Moved `expect.js` from dependencies to development dependencies


## [3.0.0]
### Added

* ES6
* Flow typing
* Added documentation about range creation (thanks @seanwendt)
* Added webpack
* Added eslint
* Added karma/mocha/expect.js
* Added many more tests
* Addded new methods: `by`, `reverseBy`, `byRange`, `reverseByRange` (#68)
    - Pass options as object
    - New methods use iterators
    - Added reversal methods
    - Discrete methods for different iterator types
* Added ability to iterate over a range by a step (#93)
* Added `isEqual` as alias of `isSame`
* Added `adjacent` method and option to `overlaps` (#92 #112)
* Added `duration` as an alias of `diff` (#64)
* Added CircleCI config

### Changed

* Documentation
* Changed usage:
    import Moment from 'moment';
    import { DateRange, extendMoment } from 'moment-js';
    const moment = extendMoment(Moment);
* Pass additonal optional rounded argument in `diff` (#104)
* Updated short-hand units (#134)
* Updated packaging rules and scripts
* Iteration methods now return an `Iterator`
* `dist/` is only included in the npm release now

### Removed

* Removed bower
* Removed grunt
* Removed jshint
* Removed mocha/should
* Removed `toArray`

### Fixed

* Fixed issue with `moment#within` and moment-timezone (#127)
* Fixed typo in comment (#133)

[Unreleased]: https://github.com/rotaready/moment-range/compare/v3.1.0...HEAD
[3.0.3]: https://github.com/rotaready/moment-range/compare/v3.0.3...v3.1.0
[3.0.2]: https://github.com/rotaready/moment-range/compare/v3.0.2...v3.0.3
[3.0.2]: https://github.com/rotaready/moment-range/compare/v3.0.1...v3.0.2
[3.0.1]: https://github.com/rotaready/moment-range/compare/v3.0.0...v3.0.1
[3.0.0]: https://github.com/rotaready/moment-range/compare/v1.0.5...v3.0.1
