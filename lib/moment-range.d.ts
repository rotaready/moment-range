import * as moment from 'moment';
import {Moment, unitOfTime} from 'moment';

export class DateRange {
  start: Moment;
  end: Moment;

  constructor(start: Date | Moment, end: Date | Moment);
  constructor(range: [Date | Moment, Date | Moment]);
  constructor(range: string);
  constructor();

  adjacent(other: DateRange): boolean;

  add(other: DateRange, options?: { adjacent?: boolean }): DateRange | null;

  by(interval: unitOfTime.Diff, options?: { excludeEnd?: boolean; step?: number; }): Iterable<Moment>;
  // @deprecated 4.0.0
  by(interval: unitOfTime.Diff, options?: { exclusive?: boolean; step?: number; }): Iterable<Moment>;

  byRange(interval: DateRange, options?: { excludeEnd?: boolean; step?: number; }): Iterable<Moment>;
  // @deprecated 4.0.0
  byRange(interval: DateRange, options?: { exclusive?: boolean; step?: number; }): Iterable<Moment>;

  center(): Moment;

  clone(): DateRange;

  contains(other: Date | DateRange | Moment, options?: { excludeStart?: boolean; excludeEnd?: boolean; }): boolean;
  // @deprecated 4.0.0
  contains(other: Date | DateRange | Moment, options?: { exclusive?: boolean; }): boolean;

  diff(unit?: unitOfTime.Diff, precise?: boolean): number;

  duration(unit?: unitOfTime.Diff, precise?: boolean): number;

  intersect(other: DateRange): DateRange | null;

  isEqual(other: DateRange): boolean;

  isSame(other: DateRange): boolean;

  overlaps(other: DateRange, options?: { adjacent?: boolean; }): boolean;

  reverseBy(interval: unitOfTime.Diff, options?: { excludeStart?: boolean; step?: number; }): Iterable<Moment>;
  // @deprecated 4.0.0
  reverseBy(interval: unitOfTime.Diff, options?: { exclusive?: boolean; step?: number; }): Iterable<Moment>;

  reverseByRange(interval: DateRange, options?: { excludeStart?: boolean; step?: number; }): Iterable<Moment>;
  // @deprecated 4.0.0
  reverseByRange(interval: DateRange, options?: { exclusive?: boolean; step?: number; }): Iterable<Moment>;

  snapTo(interval: unitOfTime.Diff): DateRange;

  subtract(other: DateRange): DateRange[];

  toDate(): [Date, Date];

  toString(): string;

  valueOf(): number;
}

export interface MomentRangeStaticMethods {
  range(start: Date | Moment, end: Date | Moment): DateRange;
  range(range: [Date | Moment, Date | Moment]): DateRange;
  range(range: string): DateRange;
  range(): DateRange;

  rangeFromInterval(interval: unitOfTime.Diff, count?: number, date?: Date | Moment): DateRange;
  rangeFromISOString(isoTimeInterval: string): DateRange;

  // @deprecated 4.0.0
  parseZoneRange(isoTimeInterval: string): DateRange;
}

export interface MomentRange extends MomentRangeStaticMethods {
  (...args: any[]): MomentRangeStaticMethods & Moment;
}

declare module 'moment' {
  export interface Moment {
    isRange(range: any): boolean;

    within(range: DateRange): boolean;
  }
}

export function extendMoment(momentClass: typeof moment): MomentRange & typeof moment;
