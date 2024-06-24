import { useInputBind } from "../Functions/index";
import { ElmObjRefData } from "./ElmRefernce.types";

export type HTMLInputTypes =
  | "button"
  | "checkbox"
  | "color"
  | "date"
  | "datetime-local"
  | "email"
  | "file"
  | "hidden"
  | "image"
  | "month"
  | "number"
  | "password"
  | "radio"
  | "range"
  | "reset"
  | "search"
  | "submit"
  | "tel"
  | "text"
  | "time"
  | "url"
  | "week";
type ExcludeFunctions<T> = Pick<
  T,
  {
    [K in keyof T]: T[K] extends Function ? never : K;
  }[keyof T]
>;

type ElmBaseRecord<T> = Partial<{ [K in keyof ExcludeFunctions<T>]: T[K] }>;
type ElmRecord<T> = Partial<Omit<Exclude<T, "style">, keyof HTMLElement>>;

export type ElementAttributes = ElmBaseRecord<HTMLElement> &
  Partial<
    {
      input: ElmRecord<HTMLInputElement> & {
        type: HTMLInputTypes;
      };
      textArea: ElmRecord<HTMLTextAreaElement>;
      image: ElmRecord<HTMLImageElement>;
      table: ElmRecord<HTMLTableElement>;
      tr: ElmRecord<HTMLTableRowElement>;
      col: ElmRecord<HTMLTableColElement>;
      thead: ElmRecord<HTMLTableSectionElement>;
      td: ElmRecord<HTMLTableCellElement>;
      audio: ElmRecord<HTMLAudioElement>;
      video: ElmRecord<HTMLVideoElement>;
      source: ElmRecord<HTMLSourceElement>;
      picture: ElmRecord<HTMLPictureElement>;
    } & { style: Partial<CSSStyleDeclaration> }
  >;
export type InputBindFunction = (
  to: string,
  type: InputValueTypes
) => ElmOnjBindInputData;
export type InputBindObj<T> = ReturnType<typeof useInputBind<T>>;
export type ElementTypes =
  | "component"
  | "rawHTML"
  | "rawElement"
  | "fragment"
  | keyof HTMLElementTagNameMap;

export type InputValueTypes = "string" | "number" | "boolean";

export type ElmObjStyleData = Partial<CSSStyleDeclaration>;

export type InputBindData = {
  bindTo: any;
  objectPropertyName: string;
  valueType: InputValueTypes;
};

export type ComponentState = {
  elements: ElmTreeData;
};

export type SignalData = {
  origin: any;
  receiver: (elm: any, signalProps: any) => void;
};
export type ElmObjSignalData = {
  signal?: SignalData | SignalData[];
};
type FunciontRecord<T> = Partial<{ [K in keyof T]: (args: T[K]) => void }>;
export type ElmObjEvents = FunciontRecord<HTMLElementEventMap>;
export type ElmObjEventsData = {
  events?: ElmObjEvents;
};

export type ElmObjStateData = {
  state?: ComponentState;
};

export type ElmOnjBindInputData = {
  bindInput?: InputBindData;
};

export type ElmObjAttributeData = {
  attrs?: ElementAttributes;
};

export type ElmTreeObject = {
  type: ElementTypes;
  text?: string;
  rawHTML?: string;
  element?:
    | DocumentFragment
    | HTMLElement
    | HTMLCanvasElement
    | HTMLInputTypes
    | HTMLImageElement;
  children?: ElmTreeData;
  hooks?: {
    afterRender?: Function;
  };
} & ElmObjStateData &
  ElmOnjBindInputData &
  ElmObjSignalData &
  ElmObjRefData &
  ElmObjAttributeData &
  ElmObjEventsData;

export type ElmTreeObjAddons = ElmOnjBindInputData &
  ElmObjSignalData &
  ElmObjRefData &
  ElmObjAttributeData &
  ElmObjEventsData & { style?: ElmObjStyleData };

type Elements = ElmTreeObject | ElmTreeObject[] | ElmTreeData;
export type ElmTreeData = Elements[];
