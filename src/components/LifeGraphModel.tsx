export type Pattern = Date | number | string | Recurring;
export type Recurring = unknown;

export type PartialOrder<OrderKind> = OrderKind & OrderKind;
export type Unordered = undefined;

export type OrderKind = QiZhi | Ratio | List | TimeHorizon;
export type QiZhi = number;
export type Ratio = number;
export type List = boolean; // how to enforce that one has to be true, one false?
export type TimeHorizon = Date; // how to enforce that one has to be true, one false?

export type Qi = {
    id: number; // number lookup is faster than string
    mutability: boolean;
    pattern: Pattern;
    transformable: boolean;
    qiQuality: QiZhi;
    timeHorizon: qiLink<TimeHorizon>;
};

export type qiLink<OrderKind> = {
    id: number;
    from: Qi;
    to: Qi;
    tong: QiZhi;
    ordering: Unordered | PartialOrder<OrderKind>;
};

