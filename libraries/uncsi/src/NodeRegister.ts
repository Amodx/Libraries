import { PrefabNodeData } from "NodeData.types";
import { ComponentBaseConstructor } from "./ComponentBase";
import { TraitBaseConstructor } from "./TraitBase";
import { ArrayMap } from "@amodx/core/DataStructures/ArrayMap";
export class NodeRegister {
  static prefabs = new ArrayMap<string, PrefabNodeData>();
  static components = new ArrayMap<string, ComponentBaseConstructor>();
  static traits = new ArrayMap<string, TraitBaseConstructor>();

  static registerPrefab(...nodes: PrefabNodeData[]) {
    nodes.forEach((_) => this.prefabs.set(_.id, _));
  }
  static getPrefab(id: string) {
    const found = this.prefabs.get(id);
    if (!found) {
      throw new Error(`Did not find a prefab with id ${id}`);
    }
    return found;
  }

  static registerComponents(...nodes: ComponentBaseConstructor[]) {
    nodes.forEach((_) => this.components.set(_.Meta.id, _));
  }
  static getComponent(id: string) {
    const found = this.components.get(id);
    if (!found) {
      throw new Error(`Did not find a classs component with id ${id}`);
    }
    return found;
  }
  static registerTraits(...nodes: TraitBaseConstructor[]) {
    nodes.forEach((_) => this.traits.set(_.Meta.id, _));
  }
  static getTrait(id: string) {
    const found = this.traits.get(id);
    if (!found) {
      throw new Error(`Did not find a trait class with id ${id}`);
    }
    return found;
  }
}
