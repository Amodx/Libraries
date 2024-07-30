export type SignalData<Tag extends keyof HTMLElementTagNameMap> = {
  origin: any;
  update: (elm: HTMLElementTagNameMap[Tag], signalProps: any) => void;
};
export type RefernceObject<Refernce = any> = {
  current: Refernce | null;
};

export type ElmObjRefData = {
  ref?: RefernceObject;
};

export type ElementChildren =
  | (HTMLElement | DocumentFragment | DocumentFragment[] | HTMLElement[])
  | (HTMLElement | DocumentFragment | DocumentFragment[] | HTMLElement[])[]
  | string
  | null
  | false;

type PropsMap = {
  [K in keyof HTMLElementTagNameMap]: Partial<HTMLElementTagNameMap[K]>;
};

export type ProperOmit<T, K extends PropertyKey> = {
  [P in keyof T as Exclude<P, K>]: T[P];
};
export type RecursivePartial<T> = {
  [P in keyof T]?: RecursivePartial<T[P]>;
};

export type ElementProps<Tag extends keyof HTMLElementTagNameMap> = ProperOmit<
  PropsMap[Tag] & {
    ref?: RefernceObject<HTMLElementTagNameMap[Tag]>;
    signal?: SignalData<Tag> | SignalData<Tag>[];
    hooks?: {
      beforeRender?: () => void;
      afterRender?: (elm: HTMLElementTagNameMap[Tag]) => void;
    };
  },
  "style"
> & {
  style?: RecursivePartial<HTMLElement["style"]>;
};
