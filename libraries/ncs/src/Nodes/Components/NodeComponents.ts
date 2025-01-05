import { NodeInstance } from "../NodeInstance";
import { ComponentData } from "../../Components/ComponentData";
import { ComponentInstance } from "../../Components/ComponentInstance";
import { NodeComponentObservers } from "./NodeComponentObservers";
import { NCSRegister } from "../../Register/NCSRegister";
import { ComponentInstanceMap } from "../../Components/ComponentInstanceMap";

const filterUndefined = (_: any) => Boolean(_);
export class NodeComponents {
  private _observers?: NodeComponentObservers;
  get observers() {
    if (!this._observers) {
      this._observers = new NodeComponentObservers();
    }
    return this._observers;
  }
  get hasObservers() {
    return Boolean(this._observers);
  }
  components: ComponentInstance[] = [];
  constructor(public node: NodeInstance) {}

  dispose() {
    for (const comp of this.components) {
      comp.dispose();
    }
  }

  add(
    comp: ComponentData,
    init = false
  ): ComponentInstance<any, any, any, any> {
    const compType = NCSRegister.components.get(
      comp.type,
      comp.namespace || "main"
    );
    const newComponent = compType.create(this.node, comp);
    this.components.push(newComponent);
    const map = ComponentInstanceMap.getMap(newComponent.type);
    map.addNode(this.node, newComponent);

    if (comp.traits?.length) {
      newComponent.traits.addTraits(init, ...comp.traits);
    }
    this.hasObservers &&
      this.observers.isComponentAddedSet &&
      this.hasObservers &&
      this.observers.componentAdded.notify(newComponent);
    return newComponent;
  }
  addComponents(...components: ComponentData[]) {
    const newComponents: ComponentInstance[] = [];
    for (const comp of components) {
      newComponents.push(this.add(comp, false));
    }

    this.hasObservers &&
      this.observers.isComponentsUpdatedSet &&
      this.observers.componentsUpdated.notify();
  }

  removeByIndex(index: number) {
    const component = this.components[index];
    if (component) {
      const child = this.components.splice(index, 1)![0];
      this.hasObservers &&
        this.observers.isComponentRemovedSet &&
        this.observers.componentRemoved.notify(child);
      this.hasObservers &&
        this.observers.isComponentsUpdatedSet &&
        this.observers.componentsUpdated.notify();
      component.dispose();
      return true;
    }
    return false;
  }

  remove(type: string) {
    let removeIndex = -1;
    for (let i = 0; i < this.components.length; i++) {
      const comp = this.components[i];
      if (comp.type == type) {
        removeIndex = i;
        break;
      }
    }
    if (removeIndex == -1) return;
    return this.removeByIndex(removeIndex);
  }

  get(type: string): ComponentInstance<any, any, any, any> | null {
    for (let i = 0; i < this.components.length; i++) {
      const comp = this.components[i];
      if (comp.type == type) return comp;
    }
    return null;
  }
  getAll(type: string): ComponentInstance<any, any, any, any>[] {
    const comps: ComponentInstance<any, any, any, any>[] = [];
    for (let i = 0; i < this.components.length; i++) {
      const comp = this.components[i];
      if (comp.type == type) comps.push(comp);
    }
    return comps;
  }
  removeAll(type: string): ComponentInstance<any, any, any, any>[] {
    const removed: ComponentInstance<any, any, any, any>[] = [];
    for (let i = 0; i < this.components.length; i++) {
      const comp = this.components[i];
      if (comp.type == type) {
        removed.push(comp);
        (this.components[i] as any) = undefined;
        break;
      }
    }
    this.components.filter(filterUndefined);
    for (const comp of removed) {
      comp.dispose();
    }
    for (const comp of removed) {
      this.hasObservers &&
        this.observers.isComponentRemovedSet &&
        this.observers.componentRemoved.notify(comp);
    }
    this.hasObservers &&
      this.observers.isComponentsUpdatedSet &&
      this.observers.componentsUpdated.notify();
    return removed;
  }

  getChild(type: string): ComponentInstance<any, any, any, any> | null {
    for (const child of this.node.traverseChildren()) {
      if (!child.components) continue;
      const found = child.components.get(type) as ComponentInstance;
      if (found) return found;
    }
    return null;
  }

  getParent(type: string): ComponentInstance<any, any, any, any> | null {
    for (const parent of this.node.traverseParents()) {
      if (!parent.components) continue;
      const found = parent.components.get(type) as ComponentInstance;
      if (found) return found;
    }
    return null;
  }
}
