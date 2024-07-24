import { Observable } from "../Observers/index";

export type SafePromiseFunction<T> = (
  resolve: (data: T) => void,
  reject: (data: any) => void,
  promise: SafePromise
) => void;

export class SafePromiseDiedError extends Error {
  fatal = true;
  constructor(public promise: SafePromise) {
    super(`${promise.id} died.`);
  }
}

export class SafePromise<T = any> {
  private _run: SafePromiseFunction<T>;

  private dieTimer: any = 0;
  private paused = false;
  private _resolve: Function;
  private _reject: Function;
  private startTime = 0;
  private elapsed = 0;
  private canceled = false;

  private _isResolved = false;
  private _isRejected = false;

  observers = {
    died: new Observable<SafePromiseDiedError>(),
    canceled: new Observable<void>(),
    rejected: new Observable<void>(),
    resolved: new Observable<T>(),
    finally: new Observable<void>(),
    error: new Observable<any>(),
  };
  constructor(
    public id: string,
    run: SafePromiseFunction<T>,
    public dieTimeOut: number | null = null
  ) {
    this._run = run;
  }

  isResolved() {
    return this._isResolved;
  }
  isRejected() {
    return this._isRejected;
  }

  resolve(data: T) {
    this.clearDieTimer();
    this._isResolved = true;
    this.observers.resolved.notify(data);
    this._resolve(data);
  }

  rejecT(data: any) {
    this.clearDieTimer();
    this._reject(data);
    this._isRejected = true;
    this.observers.rejected.notify(data);
  }

  pause() {
    if (this.paused) return;
    this.paused = true;
    this.clearDieTimer();
    const now = performance.now();
    const currentElapsed = now - this.startTime;
    this.elapsed += currentElapsed;
    this.startTime = now;
  }
  resume() {
    if (!this.paused) return;
    this.paused = false;
    if (this.dieTimeOut !== null) {
      this.setDie(
        this.dieTimeOut - this.elapsed > 0 ? this.dieTimeOut - this.elapsed : 0
      );
    }
  }

  private setDie(timeOut = this.dieTimeOut) {
    if (timeOut === null) return;
    this.clearDieTimer();
    this.dieTimer = setTimeout(() => {
      if (this.paused || this.canceled || this._isResolved || this._isRejected)
        return;
      const error = new SafePromiseDiedError(this);
      this.observers.died.notify(error);
      this._reject(error);
      this._isRejected = true;
    }, timeOut);
  }

  private clearDieTimer() {
    if (typeof this.dieTimer !== "undefined") clearTimeout(this.dieTimer);
  }

  cancel() {
    if (this._isResolved || this._isRejected || this.canceled) return; // Prevent double settling
    this.canceled = true;
    this.clearDieTimer();
    this._resolve(false); // Reject with an Error
    this._isResolved = true;
  }

  run(): Promise<T> {
    const prom = new Promise<T>((resolve, reject) => {
      this.startTime = performance.now();
      this._resolve = resolve;
      this._reject = reject;
      this.setDie();
      this._run(
        (data: T) => this.resolve(data),
        (data: any) => this.rejecT(data),
        this
      );
    });
    prom.catch((error) => {
      this.observers.error.notify(error);
      throw new Error(error);
    });
    prom.finally(() => {
      this.clearDieTimer();
      this.observers.finally.notify();
    });
    return prom;
  }
}
