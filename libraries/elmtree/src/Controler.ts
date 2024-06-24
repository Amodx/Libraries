import type {
  ComponentState,
  ElmTreeObject,
  InputBindData,
  InputValueTypes,
  SignalData,
} from "./Types/ElmTreeData.types.js";
import { IterableWeakMap } from "./Util/IterableWeakMap.js";
import { ElementCreator } from "./ElementCreator.js";

export const Controller = {
  stateful: {
    map: <WeakMap<any, HTMLElement>>new WeakMap(),
    register(elmObj: ElmTreeObject, componentElm: HTMLElement) {
      if (!elmObj.state) {
        throw new Error("Must have a the component property set.");
      }
      this.map.set(elmObj.state, componentElm);
    },
    getState(state: ComponentState): ComponentState {
      const foundState = this.map.get(state);
      if (foundState) return state;
      const self = this;
      const proxy = new Proxy(state as any, {
        get(target, prop, receiver) {
          return Reflect.get(target, prop, receiver);
        },
        set(target, prop, newValue, receiver) {
          target[prop] = newValue;
          self.runUpdate(proxy);
          return true;
        },
      });
      return proxy;
    },
    runUpdate(state: any) {
      const data = this.map.get(state);

      if (!data) return false;
      const elm = data;
      elm.innerHTML = "";
      ElementCreator.renderElements([state.elements], elm);
    },
  },

  signal: {
    map: <WeakMap<any, IterableWeakMap<HTMLElement, Function>>>new WeakMap(),
    register(elmObj: ElmTreeObject, elm: HTMLElement) {
      if (
        !elmObj.signal ||
        (Array.isArray(elmObj.signal) && !elmObj.signal.length)
      )
        return;
      [
        ...(Array.isArray(elmObj.signal) ? elmObj.signal : [elmObj.signal]),
      ].forEach((signal) => {
        if (!this.map.has(signal.origin))
          return this.map.set(
            signal.origin,
            new IterableWeakMap([[elm, signal.receiver]])
          );
        this.map.get(signal.origin)!.set(elm, signal.receiver);
      });
    },
    async run(props: any) {
      const elements = this.map.get(props);
      if (!elements) return false;
      for (const [key, value] of elements) {
       await value(key, props);
      }
      return true;
    },
  },

  inputBind: {
    map: <WeakMap<HTMLElement, any>>new WeakMap(),
    inputFunctions: <Record<InputValueTypes, (elm: HTMLInputElement) => void>>{
      string: (elm: HTMLInputElement) => {
        if (elm.type == "checkbox") return elm.checked ? "true" : "false";
        return String(elm.value);
      },
      number: (elm: HTMLInputElement) => {
        if (elm.type == "checkbox") return elm.checked ? 1 : 0;
        return Number(elm.value);
      },
      boolean: (elm: HTMLInputElement) => {
        if (elm.type == "checkbox") return elm.checked ? true : false;
        return Boolean(elm.value);
      },
    },
    bind(elm: HTMLInputElement, elmObj: ElmTreeObject) {
      if (!elmObj.bindInput) return;
      this.map.set(elm, elmObj.bindInput);
      (elm as HTMLInputElement).value =
        elmObj.bindInput.bindTo[elmObj.bindInput.objectPropertyName];
      (elm as HTMLInputElement).addEventListener("input", (ev) => {
        const inputData: InputBindData = this.map.get((ev as any).target);
        if (!inputData) return;
        const valueType: InputValueTypes = inputData.valueType;
        const newInput = this.inputFunctions[valueType]((ev as any).target);
        inputData.bindTo[inputData.objectPropertyName] = newInput;
      });
    },
  },
};
