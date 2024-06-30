import { RefernceObject } from "./Core/ElementProps";

export function useRef<Refernce = any>(
  current: Refernce | null
): RefernceObject<Refernce> {
  const ref: RefernceObject<Refernce> = { current };

  return ref;
}