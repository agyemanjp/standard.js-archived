import { Projector, Ranker, Comparer } from "./_types";
export declare function compare<T>(x: T, y: T, comparer?: Projector<T, unknown>, tryNumeric?: boolean): number;
export declare function getRanker<T>(args: {
    projector: Projector<T, unknown>;
    tryNumeric?: boolean;
    reverse?: boolean;
}): Ranker<T>;
export declare function getComparer<T>(projector: Projector<T, unknown>, tryNumeric?: boolean): Comparer<T>;
