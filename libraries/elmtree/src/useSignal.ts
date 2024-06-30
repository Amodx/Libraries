import { SignalData } from "./Core/ElementProps";
import { SignalsController } from "./Core/SignalsController";

export function useSignal<T = any>(value: T = {} as T) {
  return {
    broadcast: () => SignalsController.run(value),
    addToElement: <Tag extends keyof HTMLElementTagNameMap>(
      update: (elm: HTMLElementTagNameMap[Tag], data: T) => void
    ): SignalData<Tag> => {
      return {
        origin: value,
        receiver: update,
      };
    },
    value,
  } as const;
}
