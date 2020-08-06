export interface ProgressInfo<T> {
    /** Result value, either final (undefined and then set once) or cumulative (repeatedly updated) */
    result?: T;
    done: boolean;
    /** Optional percentage completion estimate */
    percentComplete?: number;
    /** Context-dependent optional message; Can be used for prev/current/next operation, extra completion info, etc */
    message?: string;
}
export declare type fnGenerator<X, Y> = (arg: X) => AsyncGenerator<ProgressInfo<Y>, void>;
export declare type fnPromise<X, Y> = (arg: X) => Promise<Y>;
export declare function asProgressiveGenerator<X, Y>(f: fnGenerator<X, Y>): (arg: X) => AsyncGenerator<ProgressInfo<Y>>;
export declare function asProgressiveGenerator<X, Y>(f: fnPromise<X, Y>, etaMillisecs: number): (arg: X) => AsyncGenerator<ProgressInfo<Y>>;
export declare function sleep(ms: number): Promise<unknown>;
