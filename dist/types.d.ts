export declare type Primitive = number | string | bigint | boolean | symbol;
export declare type ObjectLiteral<TValue = unknown, TKey extends string = string> = {
    [key in TKey]: TValue;
};
export declare type RecursivePartial<T> = {
    [P in keyof T]?: T[P] extends Record<string, unknown> ? RecursivePartial<T[P]> : T[P];
};
export declare type RecursiveRequired<T> = {
    [P in keyof T]-?: Required<T[P]>;
};
export declare type Diff<T extends string, U extends string> = ({
    [P in T]: P;
} & {
    [P in U]: never;
} & {
    [x: string]: never;
})[T];
export declare type ArrayElementType<T> = T extends (infer U)[] ? U : T;
export declare type ExtractByType<TObj, TType> = Pick<TObj, {
    [k in keyof TObj]-?: TObj[k] extends TType ? k : never;
}[keyof TObj]>;
export declare type OptionalKeys<T extends Record<string, unknown>> = Exclude<{
    [K in keyof T]: T extends Record<K, T[K]> ? never : K;
}[keyof T], undefined>;
export declare type ExtractOptional<T extends Record<string, unknown>, K extends OptionalKeys<T> = OptionalKeys<T>> = Record<K, T[K]>;
