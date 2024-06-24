import type { ElmTreeData, ElmTreeObject } from "./Types/ElmTreeData.types.js";
import { Controller } from "./Controler.js";
export const ElementCreator = {
  hooks: {
    afterRender: <Function[]>[],
  },
  _createElement(elmObj: ElmTreeObject, overrideType?: string) {
    if (this._customElments[overrideType ? overrideType : elmObj.type]) {
      return this._customElments[overrideType ? overrideType : elmObj.type](
        elmObj
      );
    }
    return document.createElement(elmObj.type);
  },

  _customElments: <Record<string, Function>>{
    fragment: () => {
      return document.createDocumentFragment();
    },
    text: (elmObj: ElmTreeObject) => {
      if (!elmObj.text) {
        throw new Error(
          'Text element must the "text" property set on the object.'
        );
      }
      return document.createTextNode(elmObj.text);
    },
    component: (elmObj: ElmTreeObject) => {
      if (!elmObj.state) {
        throw new Error('A component must have the "component" propety set.');
      }

      const elm = ElementCreator._createElement(elmObj);
      Controller.stateful.register(elmObj, elm);
      if (elmObj.signal) {
        Controller.signal.register(elmObj, elm);
      }
      if (elmObj.attrs) {
        ElementCreator._addAttributes(elm, elmObj.attrs);
      }
      return elm;
    },
    rawHTML: (elmObj: ElmTreeObject) => {
      if (!elmObj.rawHTML) {
        throw new Error(
          'rawHTML element must the "rawHTML" property set on the object.'
        );
      }
      const temp = document.createElement("div");
      temp.innerHTML = elmObj.rawHTML;
      if (!temp.firstChild) {
        return document.createDocumentFragment();
      } else {
        return temp.firstChild;
      }
    },
  },

  _attributeSets: new Map([
    ["input", true],
    ["textArea", true],
    ["image", true],
    ["table", true],
    ["tr", true],
    ["col", true],
    ["thead", true],
    ["td", true],
    ["audio", true],
    ["video", true],
    ["source", true],
    ["picture", true],
    ["dataset", true],
  ]),

  _addAttributes(elm: any, attrs: any) {
    for (const attr in attrs) {
      if (attr == "style") {
        this._addStyle(elm, attrs[attr]);
        continue;
      }
      if (attr == "dataset") {
        for (const node in attrs[attr]) {
          (elm as HTMLElement).dataset[node] = attrs[attr][node];
        }
        continue;
      }
      if (this._attributeSets.has(attr)) {
        this._addAttributes(elm, attrs[attr]);
        continue;
      }
      elm[attr] = attrs[attr];
    }
  },

  _addStyle(elm: any, styles: any) {
    for (const style in styles) {
      elm.style[style] = styles[style];
    }
  },

  _addEvents(elm: any, elmObj: any) {
    for (const event in elmObj.events) {
      (elm as HTMLElement).addEventListener(event, (eventData) => {
        //@ts-ignore
        elmObj.events[event](eventData);
      });
    }
  },

  _traverseElmTree(
    tree: ElmTreeData,
    parentElm: HTMLElement | DocumentFragment
  ) {
    for (const elmObj of tree) {
      if (!elmObj) continue;

      if (Array.isArray(elmObj)) {
        this._traverseElmTree(elmObj, parentElm);
        continue;
      }
      if (elmObj.hooks) {
        if (elmObj.hooks.afterRender)
          this.hooks.afterRender.push(elmObj.hooks.afterRender);
      }

      if (elmObj.state) {
        const elm = this._createElement(elmObj, "component");
        parentElm.append(elm);

        continue;
      }
      let elm;

      if (elmObj.element && elmObj.type == "rawElement") {
        elm = elmObj.element;
      } else {
        elm = this._createElement(elmObj);
      }

      if (elmObj.signal) {
        Controller.signal.register(elmObj, elm);
      }

      if (elmObj.bindInput) {
        Controller.inputBind.bind(elm, elmObj);
      }

      if (elmObj.ref) {
        elmObj.ref.current = elm;
      }

      if (elmObj.attrs) {
        this._addAttributes(elm, elmObj.attrs);
      }

      if (elmObj.events) {
        this._addEvents(elm, elmObj);
      }

      if (elmObj.type != "rawHTML" && elmObj.rawHTML) {
        elm.innerHTML = elmObj.rawHTML;
      }
      if (elmObj.text) {
        elm.innerText = elmObj.text;
      }
      if (elmObj.children) {
        this._traverseElmTree(elmObj.children, elm);
      }

      parentElm.append(elm);
    }
  },

  renderElements(tree: ElmTreeData, parentElm: HTMLElement | DocumentFragment) {
    const frag = document.createDocumentFragment();
    this._traverseElmTree(tree, frag);
    parentElm.append(frag);
    while (this.hooks.afterRender.length) {
      this.hooks.afterRender.shift()!();
    }
  },

  safetlyRemoveAll() {
    document.body.innerHTML = "";
  },

  safetlyRemoveElement(elm: HTMLElement) {
    elm.remove();
  },
};
