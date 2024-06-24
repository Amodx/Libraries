import {
  ElmTreeData,
  ElementTypes,
  ElmTreeObjAddons,
  applyAddons,
  UseStatefull,
} from "../index.js";
type ComponentProps<T> = {
  generate?: (data: T) => ElmTreeData;
  element?: Exclude<ElementTypes, "component" | "fragment">;
  addons?: ElmTreeObjAddons[];

};
export type ComponentUpdate<T = ElmTreeData> = (data: T) => void;
type ComponentState = {
  elements: ElmTreeData;
};
export const Component = <T = ElmTreeData>(
  props: ComponentProps<T> = {}
): [ElmTreeData, ComponentUpdate<T>, ComponentState] => {
  const state = UseStatefull({
    elements: <ElmTreeData>[],
  });
  return [
    [
      applyAddons(
        {
          type: props.element ? props.element : "div",
          state: state,

        },
        props.addons ? props.addons : []
      ),
    ],
    (data) =>
      (state.elements = props.generate
        ? props.generate(data)
        : (data as ElmTreeData)),
    state,
  ];
};
