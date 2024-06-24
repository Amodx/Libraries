import {
  addAttributes,
  addSignals,
  addClass,
  addEvents,
  addStyles,
  applyAddons,
  BloomBranch,
} from "../Functions/index.js";
import type {
  ElementAttributes,
  ElmObjEvents,
  ElmObjStyleData,
  ElmTreeData,
  ElmTreeObjAddons,
  SignalData,
  ElementTypes,
} from "../Types/ElmTreeData.types.js";

const baseElementObject = {
  addClasses: (...classes: string[]) => addClass(...classes),
  addAttributes: (data: ElementAttributes) => addAttributes(data),
  addEvents: (data: ElmObjEvents) => addEvents(data),
  addStyles: (data: ElmObjStyleData) => addStyles(data),
  addSignals: (data: SignalData[]) => addSignals(data),
  createElement: <E extends HTMLElement = HTMLElement>(tree: ElmTreeData) => {
    const fragment = document.createDocumentFragment();
    BloomBranch(tree, fragment);
    return fragment.firstChild as E;
  },
  appenedToElement: (
    element: HTMLElement | DocumentFragment,
    tree: ElmTreeData
  ) => {
    BloomBranch(tree, element);
  },
  containHTML(type: ElementTypes, rawHTML: string): ElmTreeData {
    return [
      {
        type,
        rawHTML,
      },
    ];
  },
  fromHTML(rawHTML: string): ElmTreeData {
    return [
      {
        type: "rawElement",
        rawHTML,
      },
    ];
  },
  fromElement(element: HTMLElement): ElmTreeData {
    return [
      {
        type: "rawElement",
        element,
      },
    ];
  },
};

export const element = Object.assign(
  (
    type: keyof HTMLElementTagNameMap,
    addons: ElmTreeObjAddons[] = [],
    children: ElmTreeData | string = []
  ): ElmTreeData => {
    return [
      applyAddons(
        {
          type: type,
          children: Array.isArray(children) ? children : [],
          text: typeof children == "string" ? children : undefined,
        },
        addons
      ),
    ];
  },
  baseElementObject
);

export const div = Object.assign(
  (
    className: string,
    children: ElmTreeData,
    addons: ElmTreeObjAddons[] = []
  ): ElmTreeData => {
    return element("div", [addClass(className), ...addons], children);
  },
  baseElementObject
);

export const hr = Object.assign(
  (className: string = "", addons: ElmTreeObjAddons[] = []): ElmTreeData => {
    return element("hr", [addClass(className), ...addons]);
  },
  baseElementObject
);

export const title = Object.assign(
  (
    titleType: "h1" | "h2" | "h3" | "h4" | "h5" | "h6",
    text: string,
    className = "",
    addons: ElmTreeObjAddons[] = []
  ): ElmTreeData => {
    return element(titleType, [addClass(className), ...addons], text);
  },
  baseElementObject
);

export const paragraph = Object.assign(
  (
    children: string | ElmTreeData,
    className = "",
    addons: ElmTreeObjAddons[] = []
  ): ElmTreeData => {
    return element("p", [addClass(className), ...addons], children);
  },
  baseElementObject
);

export const button = (
  children: string | ElmTreeData,
  onClick: Function,
  addons: ElmTreeObjAddons[] = []
): ElmTreeData => {
  return element(
    "button",
    [
      addEvents({
        click: async (event) => {
          await onClick(event);
        },
        keydown: async ({ key }) => {
          if (key == " ") {
            await onClick();
          }
        },
      }),
      ...addons,
    ],
    children
  );
};

export const image = (
  src: string,
  addons: ElmTreeObjAddons[] = []
): ElmTreeData => {
  return element("img", [
    addAttributes({
      image: {
        src: src,
      },
    }),
    ...addons,
  ]);
};
