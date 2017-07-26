# Moment Range

All notable changes to this project will be documented in this file.

The format is based on [Keep a Changelog](http://keepachangelog.com/)
and this project adheres to [Semantic Versioning](http://semver.org/).

## [Unreleased]

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

[Unreleased]: https://github.com/gf3/moment-range/compare/v3.0.3...HEAD
[3.0.2]: https://github.com/gf3/moment-range/compare/v3.0.2...v3.0.3
[3.0.2]: https://github.com/gf3/moment-range/compare/v3.0.1...v3.0.2
[3.0.1]: https://github.com/gf3/moment-range/compare/v3.0.0...v3.0.1
[3.0.0]: https://github.com/gf3/moment-range/compare/v1.0.5...v3.0.1
