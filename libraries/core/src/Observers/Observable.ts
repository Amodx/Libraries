export type ObservableFunction<T> = (data: T, observers: Observable<T>) => void;
export type ObserverKeys = object | string | symbol | VoidFunction;

export class Observable<T = void> {
  observersMap = new Map<ObserverKeys, ObservableFunction<T>>();
  observers: ObservableFunction<T>[] = [];
  onceObservers: ObservableFunction<T>[] = [];

  constructor() {}
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
    this.onceObservers.push(func);
  }
  /**
   * Unsubscribe a function that was added to the observer with the function *subscribeOnce*.
   */
  unsubscribeOnce(func: ObservableFunction<T>) {
    for (let i = 0; i < this.onceObservers.length; i++) {
      if (this.onceObservers[i] == func) {
        this.onceObservers.splice(i, 1);
        return true;
      }
    }
    return false;
  }

  /**
   * Run each callback function.
   */
  notify(data: T) {
    for (let i = 0; i < this.observers.length; i++) {
      this.observers[i](data, this);
      if (this._broken) {
        this._broken = false;
        return;
      }
    }
    while (this.onceObservers.length) {
      const observer = this.onceObservers.shift()!;
      observer(data, this);
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
    for (let i = 0; i < this.observers.length; i++) {
      if (this._broken) {
        this._broken = false;
        return;
      }
      await this.observers[i](data, this);
    }
    while (this.onceObservers.length) {
      if (this._broken) {
        this._broken = false;
        return;
      }
      const observer = this.onceObservers.shift()!;
      await observer(data, this);
    }
  }

  /**
   * Removes all observers.
   */
  clear() {
    this.onceObservers = [];
    this.observers = [];
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
