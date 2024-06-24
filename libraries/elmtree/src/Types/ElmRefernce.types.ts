export type RefernceObject<Refernce = any> = {
  current: Refernce | null;
};

export type ElmObjRefData = {
  ref?: RefernceObject;
};
