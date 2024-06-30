import { ElementChildren, ElementProps } from "./Core/ElementProps";
import { SignalsController } from "./Core/SignalsController";

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
  children.forEach((child) => {
    if (child === null) return;
    if (typeof child === "string") {
      el.textContent = child;
    } else {
      if (Array.isArray(child)) {
        child.forEach((_) =>
          Array.isArray(_)
            ? _.forEach((_) => el.appendChild(_))
            : el.appendChild(_)
        );
      } else {
        el.appendChild(child);
      }
    }
  });
}

function applyProps<Tag extends keyof HTMLElementTagNameMap>(
  props: ElementProps<Tag>,
  el: HTMLElementTagNameMap[Tag]
) {
  for (const key in props) {
    if (props.hasOwnProperty(key)) {
      const value = props[key as keyof ElementProps<Tag>];

      if (key in el) {
        if (typeof value === "object" && value !== null) {
          deepMerge((el as any)[key], value);
        } else {
          (el as any)[key] = value;
        }
      } else {
        el.setAttribute(key, value as string);
      }
    }
  }
}

export const element = Object.assign(
  <Tag extends keyof HTMLElementTagNameMap>(
    tag: Tag,
    props: ElementProps<Tag> | string = {} as any,
    ...children: ElementChildren[]
  ): HTMLElementTagNameMap[Tag] => {
    const el = document.createElement(tag);
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
  },
  { applyProps, appendChildern }
);

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

export function fragment(...children: ElementChildren[]): DocumentFragment {
  const frag = document.createDocumentFragment();

  appendChildern(frag, children);

  return frag;
}
