export type Nullable<T> = T | null;
export type RecursivePartial<T> = {
    [P in keyof T]?: RecursivePartial<T[P]>;
  };
  
