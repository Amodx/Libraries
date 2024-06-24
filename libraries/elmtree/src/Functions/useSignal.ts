import { Controller } from "../Controler.js";
import { addSignals } from "./addToElement";
export function useSignal<T = any>(value: T = {} as T) {
  return {
    broadcast: () => Controller.signal.run(value),
    addToElement: (update: (elm: any, data: T) => void) =>
      addSignals([
        {
          origin: value,
          receiver: update,
        },
      ]),
    value,
  } as const;
}
