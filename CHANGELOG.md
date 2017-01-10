# Moment Range

## [Unreleased]
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

[Unreleased]: https://github.com/gf3/moment-range/tree/3-dev
