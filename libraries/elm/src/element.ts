import { ElementChildren, ElementProps } from "./ElementProps";
import { SignalsController } from "./SignalController";
import { RefernceObject } from "./ElementProps";

export function useRef<Refernce = any>(
  current: Refernce | null = null
): RefernceObject<Refernce> {
  const ref: RefernceObject<Refernce> = { current };
  return ref;
}

export function useElmRef<Tag extends keyof HTMLElementTagNameMap>(
  current: HTMLElementTagNameMap[Tag] | null = null
) {
  return useRef<HTMLElementTagNameMap[Tag]>(current);
}

function deepMerge(target: any, source: any): any {
  for (const key in source) {
    if (source[key] && typeof source[key] === "object") {
      if (!target[key] || typeof target[key] !== "object") {
        target[key] = Array.isArray(source[key]) ? [] : {};
      }
      deepMerge(target[key], source[key]);
    } else {
      target[key] = source[key];
    }
  }
  return target;
}

function appendChildern(
  el: HTMLElement | DocumentFragment,
  children: ElementChildren[]
) {
  const tempFrag = document.createDocumentFragment();
  for (const child of children) {
    if (child === null) continue;
    if (child === false) continue;
    if (typeof child === "string") {
      tempFrag.textContent = child;
    } else {
      if (Array.isArray(child)) {
        child.forEach((_) =>
          Array.isArray(_)
            ? _.forEach((_) => tempFrag.appendChild(_))
            : tempFrag.appendChild(_)
        );
      } else {
        tempFrag.appendChild(child);
      }
    }
  }
  el.appendChild(tempFrag);
}

function applyProps<Tag extends keyof HTMLElementTagNameMap>(
  props: ElementProps<Tag>,
  el: HTMLElementTagNameMap[Tag]
) {
  for (const key in props) {
    if (props.hasOwnProperty(key)) {
      const value = props[key as keyof ElementProps<Tag>];
      if (key in el) {
        if (key == "dataset" && typeof value == "object" && value !== null) {
          for (const key in value) {
            el.dataset[key] = String(value[key]);
          }
          continue;
        }
        if (typeof value === "object" && key == "style" && value !== null) {
          deepMerge((el as any)[key], value);
          continue;
        }

        (el as any)[key] = value;
      } else {
        if (
          typeof value === "string" ||
          (typeof value === "number" && value !== null)
        ) {
          el.setAttribute(key, String(value));
        } else {
          (el as any)[key] = value;
        }
      }
    }
  }
}

const tags: Record<
  keyof HTMLElementTagNameMap,
  ReturnType<typeof wrap<{}, keyof HTMLElementTagNameMap>>
> = new Proxy(
  {},
  {
    get(target: any, tag: keyof HTMLElementTagNameMap) {
      if (!(tag in target)) {
        target[tag] = (props: any, ...children: ElementChildren[]) => {
          return _elm(tag, props, ...children);
        };
      }
      return target[tag];
    },
  }
) as Record<
  keyof HTMLElementTagNameMap,
  ReturnType<typeof wrap<{}, keyof HTMLElementTagNameMap>>
>;

type ElmType = <Tag extends keyof HTMLElementTagNameMap>(
  tag: Tag,
  props?: ElementProps<Tag> | string,
  ...children: ElementChildren[]
) => Tag extends keyof HTMLElementTagNameMap
  ? HTMLElementTagNameMap[Tag]
  : HTMLElement;

export const props = <Tag extends keyof HTMLElementTagNameMap>(
  props: Partial<ElementProps<Tag>>
) => {
  return props as any;
};

const _elm: ElmType = (tag, props, ...children) => {
  const el = document.createElement(tag as keyof HTMLElementTagNameMap);

  if (typeof props == "object") {
    if ((props as ElementProps<any>).hooks?.beforeRender)
      (props as ElementProps<any>).hooks.beforeRender();

    if ((props as ElementProps<any>).ref) {
      (props as ElementProps<any>).ref!.current = el;
    }

    applyProps(props as ElementProps<any>, el);
  }

  if (typeof props == "string") {
    el.className = props;
  }

  appendChildern(el, children);

  if (typeof props == "object") {
    if ((props as ElementProps<any>).signal) {
      if (Array.isArray((props as ElementProps<any>).signal)) {
        (props as ElementProps<any>).signal!.forEach((_: any) =>
          SignalsController.register(_, el)
        );
      } else {
        SignalsController.register((props as ElementProps<any>).signal!, el);
      }
    }
    if ((props as ElementProps<any>).hooks?.afterRender)
      (props as ElementProps<any>).hooks.afterRender(el);
  }
  return el as any;
};

type ProcessFunction<
  ExtraProps extends {},
  Tag extends keyof HTMLElementTagNameMap
> = (
  props: ElementProps<Tag> & ExtraProps,
  children: ElementChildren[]
) => ElementChildren[] | ElementChildren | void;
type ProcessOverrideFunction<
  ExtraProps extends {},
  Tag extends keyof HTMLElementTagNameMap
> = (
  props: ElementProps<Tag> & ExtraProps,
  children: ElementChildren[]
) => HTMLElement | DocumentFragment;

export const wrap = <
  ExtraProps extends {},
  Tag extends keyof HTMLElementTagNameMap
>(
  tag: Tag,
  processOrOverride?: ProcessFunction<ExtraProps, Tag> | boolean,
  process?: ProcessOverrideFunction<ExtraProps, Tag>
): ((
  props: (ElementProps<Tag> & ExtraProps) | string,
  ...children: ElementChildren[]
) => Tag extends keyof HTMLElementTagNameMap
  ? HTMLElementTagNameMap[Tag]
  : HTMLElement) => {
  if (typeof processOrOverride == "function") {
    return (
      props: (ElementProps<Tag> & ExtraProps) | string,
      ...children: ElementChildren[]
    ) => {
      const newProps: ElementProps<Tag> & ExtraProps =
        typeof props == "string" ? { className: props } : (props as any);
      let newChildren = processOrOverride
        ? processOrOverride(newProps, children)
        : null;
      if (newChildren) {
        children = Array.isArray(newChildren) ? newChildren : [newChildren];
      }
      return _elm(tag, props, ...children) as any;
    };
  }
  if (typeof processOrOverride == "boolean" && process) {
    return (
      props: (ElementProps<Tag> & ExtraProps) | string,
      ...children: ElementChildren[]
    ) => {
      const newProps: ElementProps<Tag> & ExtraProps =
        typeof props == "string" ? { className: props } : (props as any);
      return process(newProps, children) as any;
    };
  }
  return tags[tag] as any;
};

export function html(
  htmlString: string,
  props: ElementProps<any> = {},
  ...children: ElementChildren[]
): HTMLElement {
  if (props.hooks?.beforeRender) props.hooks.beforeRender();
  const template = document.createElement("template");
  template.innerHTML = htmlString.trim();
  const el = template.content.firstChild as HTMLElement;
  if (props.ref) {
    props.ref.current = el;
  }

  applyProps(props, el);

  appendChildern(el, children);

  if (props.signal) {
    if (Array.isArray(props.signal)) {
      props.signal.forEach((_: any) => SignalsController.register(_, el));
    } else {
      SignalsController.register(props.signal, el);
    }
  }
  if (props.hooks?.afterRender) props.hooks.afterRender(el);
  return el;
}

export function raw<Tag extends keyof HTMLElementTagNameMap>(
  el: HTMLElementTagNameMap[Tag],
  props: ElementProps<Tag> | string = {} as any,
  ...children: ElementChildren[]
): HTMLElementTagNameMap[Tag] {
  if (typeof props == "object") {
    if (props.hooks?.beforeRender) props.hooks.beforeRender();

    if (props.ref) {
      props.ref.current = el;
    }

    applyProps(props, el);
  }

  if (typeof props == "string") {
    el.className = props;
  }

  appendChildern(el, children);

  if (typeof props == "object") {
    if (props.signal) {
      if (Array.isArray(props.signal)) {
        props.signal.forEach((_) => SignalsController.register(_, el));
      } else {
        SignalsController.register(props.signal, el);
      }
    }
    if (props.hooks?.afterRender) props.hooks.afterRender(el);
  }
  return el;
}

export function frag(...children: ElementChildren[]): DocumentFragment {
  const frag = document.createDocumentFragment();
  appendChildern(frag, children);
  return frag;
}

export function css(cssString: string) {
  const styleElement = document.createElement("style");
  styleElement.innerHTML = cssString;
  document.head.appendChild(styleElement);
}

const ElmModule = {
  applyProps,
  appendChildern,
  wrap,
  frag,
  html,
  raw,
  props,
  css,
  tags,
};

export const elm: ElmType & {
  applyProps: typeof applyProps;
  appendChildern: typeof appendChildern;
  wrap: typeof wrap;
  props: typeof props;
  frag: typeof frag;
  html: typeof html;
  raw: typeof raw;
  css: typeof css;
  tags: typeof tags;
} = Object.assign(_elm, ElmModule);
