import { useSignal } from "../Functions/index.js";
import {
  applyAddons,
  ElementTypes,
  ElmTreeData,
  ElmTreeObjAddons,
} from "../index.js";
export function signalElement(
  type: Exclude<ElementTypes, "fragment">,
  update: (elm: HTMLDivElement) => void
) {
  const funcs: Function[] = [];
  const updateAll = () => funcs.forEach((_) => _());

  const element = <T extends object>(
    addons: ElmTreeObjAddons[],
    children: ElmTreeData,
    signalProps?: T
  ) => {
    const { broadcast, addToElement } = useSignal(signalProps);

    funcs.push(broadcast);
    return [
      applyAddons(
        {
          type: type,
          children: children,
          ...addToElement((elm) => {
            update(elm);
          }),
        },
        addons
      )
    ]
  };

  return [element, updateAll] as const;
}
