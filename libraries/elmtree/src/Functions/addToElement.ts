import type {
  ComponentState,
  ElementAttributes,
  ElmObjAttributeData,
  ElmObjSignalData,
  ElmObjEvents,
  ElmObjEventsData,
  ElmObjStateData,
  ElmObjStyleData,
  ElmOnjBindInputData,
  ElmTreeData,
  ElmTreeObjAddons,
  ElmTreeObject,
  InputBindData,
  InputValueTypes,
  SignalData,
} from "../Types/ElmTreeData.types";
import { ElementCreator } from "../ElementCreator.js";
import { Controller } from "../Controler.js";
import { ElmObjRefData, RefernceObject } from "Types/ElmRefernce.types";
export const addSignals = (singleData: SignalData[]) => {
  return <ElmObjSignalData>{
    signal: singleData,
  };
};

export function applyAddons(obj: ElmTreeObject, addons: ElmTreeObjAddons[]) {
  for (const addon of addons) {
    if (addon.attrs) {
      obj.attrs ??= {};
      obj.attrs = { ...obj.attrs, ...addon.attrs };
      continue;
    }
    if (addon.signal) {
      if (typeof addon.signal == "object" && Array.isArray(obj.signal)) {
        obj.signal.push(
          ...(Array.isArray(addon.signal) ? addon.signal : [addon.signal])
        );
      }
      if (
        (typeof addon.signal == "object" && !obj.signal) ||
        typeof obj.signal == "object"
      ) {
        if (
          obj.signal &&
          typeof obj.signal == "object" &&
          !Array.isArray(obj.signal)
        ) {
          obj.signal = [obj.signal];
        } else {
          obj.signal = [];
        }
        obj.signal.push(
          ...(Array.isArray(addon.signal) ? addon.signal : [addon.signal])
        );
      }
      continue;
    }

    obj = { ...obj, ...addon };
  }

  return obj;
}

export function useInputBind<T>(bind: T) {
  return {
    data: bind,
    bind(to: keyof typeof bind, type: InputValueTypes) {
      return <ElmOnjBindInputData>{
        bindInput: {
          bindTo: bind,
          objectPropertyName: to,
          valueType: type,
        },
      };
    },
  };
}

export function addRef(ref: RefernceObject): ElmObjRefData {
  return {
    ref,
  };
}

export function addAttributes(data: ElementAttributes) {
  return <ElmObjAttributeData>{
    attrs: data,
  };
}

export function addClass(...classes: string[]) {
  return <ElmObjAttributeData>{
    attrs: {
      className: classes.join(" "),
    },
  };
}

export function addEvents<K>(data: ElmObjEvents) {
  return <ElmObjEventsData>{
    events: data,
  };
}

export function addInputBind(data: InputBindData) {
  return <ElmOnjBindInputData>{
    bindInput: data,
  };
}

export function addStyles(data: ElmObjStyleData) {
  return {
    attrs: {
      style: data,
    },
  };
}

export function UseStatefull(
  state: ComponentState = { elements: [] }
): ComponentState {
  return Controller.stateful.getState(state);
}

export function BloomRoot(tree: ElmTreeData) {
  ElementCreator.renderElements(tree, document.body);
}

