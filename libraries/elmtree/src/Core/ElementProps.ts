export type SignalData<Tag extends keyof HTMLElementTagNameMap> = {
  origin: any;
  receiver: (elm: HTMLElementTagNameMap[Tag], signalProps: any) => void;
};
export type RefernceObject<Refernce = any> = {
  current: Refernce | null;
};

export type ElmObjRefData = {
  ref?: RefernceObject;
};

export type ElementChildren =  
  | (HTMLElement | HTMLElement[])
  | (HTMLElement | HTMLElement[])[]
  | string
  | null


type PropsMap = {
  [K in keyof HTMLElementTagNameMap]: Partial<HTMLElementTagNameMap[K]>;
};

type ProperOmit<T, K extends PropertyKey> = {
  [P in keyof T as Exclude<P, K>]: T[P];
};
type RecursivePartial<T> = {
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
