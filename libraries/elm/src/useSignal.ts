import { SignalsController } from "./SignalController";
import { SignalData } from "./ElementProps";
type SignalAddFunction<T> = <Tag extends keyof HTMLElementTagNameMap>(
  update: (elm: HTMLElementTagNameMap[Tag], data: T) => void
) => SignalData<Tag>;
type SignalCompouseFunction<T> = <Tag extends keyof HTMLElementTagNameMap>(
  update: (elm: HTMLElementTagNameMap[Tag], data: T) => void
) => () => SignalData<Tag>;
type SignalObject<T = any> = {
  readonly origin: Symbol;
  value: T;
  broadcast: () => void;
  compose: SignalCompouseFunction<any>;
};

export type Signal<T = any> = SignalAddFunction<T> & SignalObject<T>;

export function useSignal<T = any>(value: T = 0 as T): Signal<T> {
  const origin = Object(Symbol());
  const broadcast = () => {
    SignalsController.run(origin);
  };

  const add: SignalAddFunction<T> = (update) => {
    return {
      origin,
      update,
    };
  };
  const compose: SignalCompouseFunction<any> = (update) => {
    return () => add(update);
  };

  const mainObject = Object.assign(add, {
    broadcast,
    compose,
  });

  Object.defineProperty(mainObject, "value", {
    get() {
      return value;
    },
    set(newValue: T) {
      let oldValue = value;
      value = newValue;
      if (oldValue != newValue) {
        broadcast();
      }
    },
  });
  Object.defineProperty(mainObject, "origin", {
    get() {
      return origin;
    },
  });
  return mainObject as Signal<T>;
}
