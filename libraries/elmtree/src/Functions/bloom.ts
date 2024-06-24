import type { ElmTreeData } from "../Types/ElmTreeData.types";
import { ElementCreator } from "../ElementCreator.js";

export function BloomBranch(
  tree: ElmTreeData,
  elm: HTMLElement | DocumentFragment
) {
  ElementCreator.renderElements(tree, elm);
}

export function DecayRoot() {
  ElementCreator.safetlyRemoveAll();
}

export function DecayBranch(elm: HTMLElement) {
  ElementCreator.safetlyRemoveElement(elm);
}
