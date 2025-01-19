export type ObservableFunction<T> = (data: T) => void;

export class Observable<T = void> {
  private observers: ObservableFunction<T>[] = [];
  private once: Set<any> | null = null;

  constructor() {}
  listener(func: any): ObservableFunction<T> {
    return func as any;
  }
  /**
   * Subscribe to the observer. If only the first param is set must be the observer function itself which will be used as they key.
   * Otherwise the first param is the key to subsrcibe to the observer with.
   */
  subscribe(func: ObservableFunction<T>) {
    this.observers.push(func);
  }
  /**
   * Unsubscribe to the observer using the key used in the subscribe function.
   */
  unsubscribe(func: ObservableFunction<T>) {
    for (let i = 0; i < this.observers.length; i++) {
      if (this.observers[i] == func) {
        this.observers.splice(i, 1);
        if (this.once && this.once.has(func)) this.once.delete(func);
        return true;
      }
    }
    return false;
  }
  /**
   * Subscribe to the observer once.
   */
  subscribeOnce(func: ObservableFunction<T>) {
    this.observers.push(func);
    if (!this.once) this.once = new Set();
    this.once.add(func);
  }

  /**
   * Run each callback function.
   */
  notify(data: T) {
    for (let i = this.observers.length - 1; i >= 0; i--) {
      const func = this.observers[i];
      func(data);
      if (this.once && this.once.has(func)) {
        this.observers.splice(i, 1);
        this.once.delete(func);
      }
    }
  }

  /**
   * Removes all observers.
   */
  clear() {
    this.once && this.once.clear();
    this.observers.length = 0;
  }
}
