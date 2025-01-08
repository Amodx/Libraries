export type ObservableFunction<T> = (data: T, observers: Observable<T>) => void;
const once = new Set<any>();
export class Observable<T = void> {
  observers: ObservableFunction<T>[] = [];

  constructor() {}
  /**
   * Subsrcibe to the observer. If only the first param is set must be the observer function itself which will be used as they key.
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
        return true;
      }
    }
    return false;
  }
  /**
   * Subsrcibe to the observer once.
   */
  subscribeOnce(func: ObservableFunction<T>) {
    this.observers.push(func);
    once.add(func);
  }
  /**
   * Unsubscribe a function that was added to the observer with the function *subscribeOnce*.
   */
  unsubscribeOnce(func: ObservableFunction<T>) {
    for (let i = 0; i < this.observers.length; i++) {
      if (this.observers[i] == func) {
        this.observers.splice(i, 1);
        once.delete(func);
        return true;
      }
    }
    return false;
  }

  /**
   * Run each callback function.
   */
  notify(data: T) {
    for (let i = this.observers.length; i > 0; i--) {
      this.observers[i](data, this);
      if (once.has(this)) {
        this.observers.splice(i, 1);
        once.delete(this);
      }
    }
  }

  /**
   * Removes all observers.
   */
  clear() {
    this.observers.length = 0;
  }


}
