// Enforce ES6 arrow syntax. Enforce return arguments in fn defs
// TODO: prettier, eslint
import { DateTime, Interval, Duration } from 'luxon';

export type PartialOrder<OrderKind> = {
    from: OrderKind;
    to: OrderKind;
    comparator: Comparator;
}
export type Comparator = (from: OrderMetric, to: OrderMetric) => number;
export type Unordered = undefined;

export type Pattern = Time | number | string | Recurring;
export type Recurring = unknown;

export type OrderMetric = QiZhi | Ratio | List | TimePoint;
export type QiZhi = number;
export type Ratio = number;
export type List = boolean;

export type Time = TimePoint | TimeDuration | TimeSpan;
export type TimePoint = DateTime;
export type TimeDuration = Duration;
export type TimeSpan = Interval;

export type GraphData = {
    nodes: Qis;
    links: QiLinks;
}

export type Qis = {
    [id: number]: Qi;
}

export type QiLinks = {
    [id: number]: QiLink<OrderMetric>;
}

export type Qi = {
    readonly id: number; // number lookup is faster than string
    mutability: boolean;
    pattern: Pattern;
    transformable: boolean;
    qiQuality: QiZhi;
    pulsation: (qiQuality: QiZhi) => number // field/gravity strength;
    timeHorizon: QiLink<TimeSpan>;
};

export type QiLink<OrderKind> = {
    readonly id: number;
    readonly from: Qi;
    readonly to: Qi;
    tong: QiZhi;
    ordering: Unordered | PartialOrder<OrderKind>;
};

