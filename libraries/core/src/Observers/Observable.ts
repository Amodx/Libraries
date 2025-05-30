export type ObservableFunction<T> = (data: T, observers: Observable<T>) => void;
export type ObserverKeys = object | number | string | symbol | VoidFunction;

const once = new Set<any>();
export class Observable<T = void> {
  observersMap = new Map<ObserverKeys, ObservableFunction<T>>();
  observers: ObservableFunction<T>[] = [];

  constructor() {}

  listener(func: ObservableFunction<T>): ObservableFunction<T> {
    return func as any;
  }

  /**
   * Subsrcibe to the observer. If only the first param is set must be the observer function itself which will be used as they key.
   * Otherwise the first param is the key to subsrcibe to the observer with.
   */
  subscribe(func: ObservableFunction<T>): void;
  subscribe(key: ObserverKeys, func: ObservableFunction<T>): void;
  subscribe(
    key: ObserverKeys | ObservableFunction<T>,
    func?: ObservableFunction<T>
  ) {
    if (typeof key === "function" && func === undefined) {
      this.observersMap.set(key, key as ObservableFunction<T>);
      this.observers.push(key as ObservableFunction<T>);
    } else if (func !== undefined) {
      if (this.observersMap.has(key)) {
        this.unsubscribe(key);
      }
      this.observersMap.set(key, func);
      this.observers.push(func);
    } else {
      throw new Error("Invalid arguments for subscribe method");
    }
  }
  /**
   * Unsubscribe to the observer using the key used in the subscribe function.
   */
  unsubscribe(key: ObserverKeys) {
    const v = this.observersMap.get(key);
    if (!v) return false;
    for (let i = 0; i < this.observers.length; i++) {
      if (this.observers[i] == v) {
        this.observers.splice(i, 1);
        this.observersMap.delete(key);
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
    for (let i = this.observers.length - 1; i >= 0; i--) {
      const observer = this.observers[i];
      observer(data, this);
      if (once.has(observer)) {
        this.observers.splice(i, 1);
        once.delete(observer);
      }
      if (this._broken) {
        this._broken = false;
        return;
      }
    }
  }

  /**
   * Run each callback function and awaits it.
   */
  async notifyAsync(data: T) {
    for (let i = this.observers.length - 1; i >= 0; i--) {
      const observer = this.observers[i];
      await observer(data, this);
      if (once.has(observer)) {
        this.observers.splice(i, 1);
        once.delete(observer);
      }
      if (this._broken) {
        this._broken = false;
        return;
      }
    }
  }

  /**
   * Removes all observers.
   */
  clear() {
    this.observers.length = 0;
    this.observersMap.clear();
  }

  private _broken = false;
  /**
   * If this is called while in the notify loop of the observer it will stop iterating over the observers and return.
   */
  break() {
    this._broken = true;
  }
}
