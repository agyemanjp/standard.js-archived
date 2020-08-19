// export class Queue<TSource> implements Iterable<TSource> {
// 	private container: Array<TSource> = new Array<TSource>();
// 	private readonly: ReadOnlyCollection<TSource>;

// 	constructor() {
// 		this.readonly = new ReadOnlyCollection(this.container);
// 	}

// 	/** Determines whether all elements of a sequence satisfy a condition.
// 	 * @param predicate A function to test each element for a condition.
// 	 * @returns true if every element of the sequence passes the test in the specified predicate, or if the sequence is empty; otherwise, false.
// 	 */
// 	public all(predicate: (element: TSource) => boolean): boolean {
// 		return this.readonly.all(predicate);
// 	}

// 	/** Determines whether any element of a sequence satisfies a condition.
// 	 * @param predicate A function to test each element for a condition.
// 	 * @returns true if any elements in the sequence pass the test in the specified predicate; otherwise, false.
// 	 */
// 	public any(predicate: (element: TSource) => boolean): boolean {
// 		return this.readonly.any(predicate);
// 	}

// 	/** Removes all elements from the queue. */
// 	public clear(): void {
// 		this.container.length = 0;
// 	}

// 	/**
// 	 * Returns whether the item is found in the queue.
// 	 * @returns Returns true if the items exists; Otherwise, false.
// 	 */
// 	public contains(item: TSource): boolean {
// 		return this.container.indexOf(item) >= 0;
// 	}

// 	/**
// 	 * Removes and returns the object at the beginning of the queue.
// 	 * @returns The object that is removed from the beginning of the queue.
// 	 */
// 	public dequeue(): TSource {
// 		return (this.length() > 0) ? this.container.splice(0, 1)[0] : this.container[0] /*undefined*/;
// 	}

// 	/**
// 	 * Performs the specified action on each element of the collection.
// 	 * @param action The action to perform on each element of the list.
// 	 */
// 	public each(action: (value: TSource, index?: number) => void): void {
// 		this.readonly.each(action);
// 	}

// 	/**
// 	 * Inserts an object at the end of the queue.
// 	 * @param item The object to be added to the end of the queue.
// 	 */
// 	public enqueue(item: TSource): void {
// 		this.container.push(item);
// 	}

// 	/**
// 	 * Returns the first element of a sequence.
// 	 * @returns The first element in the sequence.
// 	 */
// 	public first(): TSource;

// 	/**
// 	 * Returns the first element in a sequence that satisfies a specified condition.
// 	 * @param predicate A function to test each element for a condition.
// 	 * @returns The first element in the sequence that passes the test in the specified predicate function.
// 	 */
// 	public first(predicate: (element: TSource) => boolean): TSource;

// 	// Actual implementation
// 	public first(predicate?: (element: TSource) => boolean): TSource {
// 		return this.readonly.first(predicate);
// 	}

// 	/**
// 	 * Returns the first element of a sequence or a default value if the sequence contains no elements.
// 	 * @returns The first element in the sequence or a default value if the sequence is empty.
// 	 */
// 	public firstOrDefault(defaultValue: TSource): TSource;

// 	/**
// 	 * Returns the first element of a sequence that satisfies a specified condition or a default value if no such element is found.
// 	 * @returns The first element in the sequence or a default value if no such element is found.
// 	 */
// 	public firstOrDefault(predicate: (element: TSource) => boolean, defaultValue: TSource): TSource;

// 	// Actual implementation
// 	public firstOrDefault(predicateOrDefaultValue: any, defaultValue?: TSource): TSource {
// 		return this.readonly.firstOrDefault(predicateOrDefaultValue, defaultValue);
// 	}

// 	/**
// 	 * Performs the specified action on each element of the collection starting with the last element until the specified action returns false.
// 	 * @param action The action to perform on each element of the list until it returns false.
// 	 */
// 	public fromLastUntil(action: (value: TSource, index?: number) => any): void {
// 		this.readonly.fromLastUntil(action);
// 	}

// 	/**
// 	 * Returns whether the sequence contains elements.
// 	 * @returns True if the sequence contains no elements; Otherwise, false.
// 	 */
// 	public isEmpty(): boolean {
// 		return this.readonly.isEmpty();
// 	}

// 	/**
// 	 * Returns the last element of a sequence.
// 	 * @returns The last element in the sequence.
// 	 */
// 	public last(): TSource;

// 	/**
// 	 * Returns the last element in a sequence that satisfies a specified condition.
// 	 * @param predicate A function to test each element for a condition.
// 	 * @returns The last element in the sequence that passes the test in the specified predicate function.
// 	 */
// 	public last(predicate: (element: TSource) => boolean): TSource;

// 	// Actual implementation
// 	public last(predicate?: (element: TSource) => boolean): TSource {
// 		return this.readonly.last(predicate);
// 	}

// 	/**
// 	 * Returns the last element of a sequence or a default value if the sequence contains no elements.
// 	 * @returns The last element in the sequence or a default value if the sequence is empty.
// 	 */
// 	public lastOrDefault(defaultValue: TSource): TSource;

// 	/**
// 	 * Returns the last element of a sequence that satisfies a specified condition or a default value if no such element is found.
// 	 * @returns The last element in the sequence or a default value if no such element is found.
// 	 */
// 	public lastOrDefault(predicate: (element: TSource) => boolean, defaultValue: TSource): TSource;

// 	// Actual implementation
// 	public lastOrDefault(predicateOrDefaultValue: any, defaultValue?: TSource): TSource {
// 		return this.readonly.lastOrDefault(predicateOrDefaultValue, defaultValue);
// 	}

// 	/**
// 	 * Returns the number of elements in a sequence.
// 	 * @returns The number of elements in the sequence.
// 	 */
// 	public length(): number {
// 		return this.container.length;
// 	}

// 	/**
// 	 * Inverts the order of the elements in a sequence.
// 	 * @returns A sequence whose elements correspond to those of the input sequence in reverse order.
// 	 */
// 	public reverse(): IEnumerable<TSource> {
// 		return this.readonly.reverse();
// 	}

// 	/**
// 	 * Projects each element of a sequence into a new form.
// 	 * @param selector A transform function to apply to each element.
// 	 * @returns An IEnumerable<TResult> whose elements are the result of invoking the transform function on each element of source.
// 	 */
// 	public select<TResult>(selector: (element: TSource) => TResult): IEnumerable<TResult> {
// 		return this.readonly.select(selector);;
// 	}

// 	/**
// 	 * Creates an array from the sequence.
// 	 * @returns An array that contains the elements from the input sequence.
// 	 */
// 	public toArray(): Array<TSource> {
// 		return this.container;
// 	}

// 	/**
// 	 * Performs the specified action on each element of the collection until the specified action returns false.
// 	 * @param action The action to perform on each element of the list until it returns false.
// 	 */
// 	public until(action: (value: TSource, index?: number) => any): void {
// 		this.readonly.until(action);
// 	}

// 	/**
// 	 * Filters a sequence of values based on a predicate.
// 	 * @param predicate A function to test each element for a condition.
// 	 * @returns An IEnumerable<TSource> that contains elements from the input sequence that satisfy the condition.
// 	 */
// 	public where(predicate: (element: TSource) => boolean): IEnumerable<TSource> {
// 		return this.readonly.where(predicate);
// 	}

// 	/**
// 	 * Merges two sequences by using the specified selector function.
// 	 * @param collection The sequence to merge.
// 	 * @param resultSelector A function that specifies how to merge the elements of two input sequences.
// 	 * @returns An IEnumerable<TResult> that contains merged elements
// 	 */
// 	public zip<TResult, TSecond>(collection: IEnumerable<TSecond>, resultSelector: (first: TSource, second: TSecond, index?: number) => TResult): IEnumerable<TResult> {
// 		return this.readonly.zip(collection, resultSelector);
// 	}
// }