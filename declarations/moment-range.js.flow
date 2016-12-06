import type Moment from 'moment';

declare module 'moment-range' {
  declare type Shorthand = 'years' | 'quarters' | 'months' | 'weeks' | 'days' | 'hours' | 'minutes' | 'seconds' | 'milliseconds';

  declare function extendMoment(moment: Class<Moment>): Class<Moment>;

  declare class DateRange {
    start: Moment;
    end: Moment;

    constructor(start: Date, end: Date): void;
    constructor(start: Moment, end: Moment): void;
    constructor(range: [Date, Date]): void;
    constructor(range: [Moment, Moment]): void;
    constructor(range: string): void;

    adjacent(other: DateRange): bool;

    add(other: DateRange): ?DateRange;

    by(interval: Shorthand, options?: { exclusive: bool; step: number; }): Iterable<Moment>;

    byRange(interval: DateRange, options?: { exclusive: bool; step: number; }): Iterable<Moment>;

    center(): Moment;

    clone(): DateRange;

    contains(other: Date | DateRange | Moment, options?: { exclusive: bool; }): bool;

    diff(unit: ?Shorthand, rounded: ?bool): number;

    duration(unit: ?Shorthand, rounded: ?bool): number;

    intersect(other: DateRange): ?DateRange;

    isEqual(other: DateRange): bool;

    isSame(other: DateRange): bool;

    overlaps(other: DateRange, options: { adjacent: bool; }): bool;

    reverseBy(interval: Shorthand, options?: { exclusive: bool; step: number; }): Iterable<Moment>;

    reverseByRange(interval: DateRange, options?: { exclusive: bool; step: number; }): Iterable<Moment>;

    subtract(other: DateRange): Array<DateRange>;

    toDate(): Array<Date>;

    toString(): string;

    valueOf(): number;
  }
};
