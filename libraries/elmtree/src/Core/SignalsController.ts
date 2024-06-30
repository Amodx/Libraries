import { SignalData } from "./ElementProps";
import { IterableWeakMap } from "./IterableWeakMap";

export class SignalsController {
  static map = new WeakMap<any, IterableWeakMap<HTMLElement, Function>>();
  static register(signal: SignalData<any>, elm: HTMLElement) {
    if (!signal || (Array.isArray(signal) && !signal.length)) return;
    [...(Array.isArray(signal) ? signal : [signal])].forEach((signal) => {
      if (!this.map.has(signal.origin))
        return this.map.set(
          signal.origin,
          new IterableWeakMap([[elm, signal.receiver]])
        );
      this.map.get(signal.origin)!.set(elm, signal.receiver);
    });
  }
  static async run(props: any) {
    const elements = this.map.get(props);
    if (!elements) return false;
    for (const [key, value] of elements) {
      await value(key, props);
    }
    return true;
  }
}
