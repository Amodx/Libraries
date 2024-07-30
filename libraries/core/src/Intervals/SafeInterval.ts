import { Observable } from "../Observers/Observable";

/** # SafeInterval
 * Creates a predictable sync interval.
 */
export class SafeInterval {
  private _active = false;
  private _run: () => void | Promise<void> = () => {};
  private interval = 1;
  private currentTimeout: number | undefined;
  private canRun = true;

  constructor(
    run?: () => void | Promise<void>,
    interval?: number,
    public stopOnError = true
  ) {
    if (run) this.setOnRun(run);
    if (interval !== undefined) this.setInterval(interval);
  }

  observers = {
    start: new Observable(),
    stop: new Observable(),
    error: new Observable<any>(),
  };

  setOnRun(run: () => void | Promise<void>) {
    this._run = run;
    return this;
  }

  setInterval(interval: number) {
    this.interval = interval;
    return this;
  }

  private _asyncRun() {
    return new Promise((resolve, reject) => {
      if (!this.canRun) return resolve(false);
      this.canRun = false;
      const prom = this._run();
      if (prom instanceof Promise) {
        return prom
          .then(() => resolve(true))
          .catch((_) => {
            if (this.stopOnError) {
              this.stop();
              reject(_);
              console.error(_);
              this.observers.error.notify(_);
              return;
            }
            this.observers.error.notify(_);
            resolve(false);
          })
          .finally(() => (this.canRun = true));
      }
      this.canRun = true;
      resolve(true);
    });
  }

  private runInterval() {
    if (!this._active) return;
    this._asyncRun().then(() => {
      this.currentTimeout = <any>setTimeout(() => {
        if (!this._active) return;
        this.runInterval();
      }, this.interval);
    });
  }

  start() {
    if (!this._active) {
      this._active = true;
      this.runInterval();
    }
    this.observers.start.notify();
    return this;
  }

  stop() {
    this._active = false;
    if (this.currentTimeout !== undefined) clearTimeout(this.currentTimeout);
    this.currentTimeout = undefined;
    this.observers.stop.notify();
    return this;
  }
}
