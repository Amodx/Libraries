export type ObservableFunction<T> = (data: T, observers: Observable<T>) => void;
export type ObserverKeys = Object | string | Symbol | Function;

export class Observable<T = void> {
  observers = new Map<ObserverKeys, ObservableFunction<T>>();
  onceObservers: Function[] = [];

  constructor() {}

  subscribe(func: ObservableFunction<T>): void;
  subscribe(key: ObserverKeys, func: ObservableFunction<T>): void;
  subscribe(
    key: ObserverKeys | ObservableFunction<T>,
    func?: ObservableFunction<T>
  ) {
    if (typeof key === "function" && func === undefined) {
      this.observers.set(key, key as ObservableFunction<T>);
    } else if (func !== undefined) {
      this.observers.set(key, func);
    } else {
      throw new Error("Invalid arguments for subscribe method");
    }
  }

  subscribeOnce(func: ObservableFunction<T>) {
    this.onceObservers.push(func);
  }

  unsubscribe(key: ObserverKeys) {
    this.observers.delete(key);
  }

  /**# notify
   * ---
   * Run each callback function.
   * @param data
   */
  notify(data: T) {
    this.observers.forEach((observer) => observer(data, this));
    while (this.onceObservers.length) {
      const observer = this.onceObservers.shift()!;
      observer(data);
      if (this._broken) break;
    }
    this._broken = false;
  }

  /**# notifyAsync
   * ---
   * Run each callback function with async/await.
   * @param data
   */
  async notifyAsync(data: T) {
    this.observers.forEach((observer) => observer(data, this));
    while (this.onceObservers.length) {
      const observer = this.onceObservers.shift()!;
      await observer(data);
      if (this._broken) break;
    }
    this._broken = false;
  }

  /**# clear
   * ---
   * Removes all observers.
   */
  clear() {
    this.onceObservers = [];
    this.observers.clear();
  }

  private _broken = false;
  break() {
    this._broken = true;
  }
}
