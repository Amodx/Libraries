import { NodeInstance } from "../NodeInstance";
import { ComponentData } from "../../Components/ComponentData";
import { ComponentInstance } from "../../Components/ComponentInstance";
import { NodeComponentObservers } from "./NodeComponentObservers";
import { NCSRegister } from "../../Register/NCSRegister";

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

  async dispose() {
    for (const comp of this.components) {
      await comp.dispose();
    }
  }

  async add(
    comp: ComponentData,
    init = true
  ): Promise<ComponentInstance<any, any, any, any>> {
    const compType = NCSRegister.components.get(
      comp.type,
      comp.namespace || "main"
    );
    const newComponent = compType.create(this.node, comp);
    this.components.push(newComponent);
    if (init) await newComponent.init();
    if (comp.traits.length) {
      await newComponent.traits.addTraits(...comp.traits);
    }
    this.hasObservers &&
      this.observers.isComponentAddedSet() &&
      this.hasObservers &&
      this.observers.componentAdded.notify(newComponent);
    return newComponent;
  }
  async addComponents(...components: ComponentData[]) {
    const newComponents: ComponentInstance[] = [];
    for (const comp of components) {
      newComponents.push(await this.add(comp, false));
    }
    for (const comp of newComponents) {
      await comp.init();
    }
    this.hasObservers &&
      this.observers.isComponentsUpdatedSet() &&
      this.observers.componentsUpdated.notify();
  }

  async removeByIndex(index: number) {
    const component = this.components[index];
    if (component) {
      const child = this.components.splice(index, 1)![0];
      this.hasObservers &&
        this.observers.isComponentRemovedSet() &&
        this.observers.componentRemoved.notify(child);
      this.hasObservers &&
        this.observers.isComponentsUpdatedSet() &&
        this.observers.componentsUpdated.notify();
      await component.dispose();
      return true;
    }
    return false;
  }
  remove(type: string) {
    return this.removeByIndex(this.components.findIndex((_) => _.type == type));
  }

  get(type: string): ComponentInstance<any, any, any, any> | null {
    return this.components.find((_) => _.type == type) || null;
  }
  getAll(type: string): ComponentInstance<any, any, any, any>[] {
    return this.components.filter((_) => _.type == type);
  }
  async removeAll(
    type: string
  ): Promise<ComponentInstance<any, any, any, any>[]> {
    const filtered = this.getAll(type);
    this.components = this.components.filter((_) => _.type != type);
    for (const comp of filtered) {
      await comp.dispose();
    }
    for (const comp of filtered) {
      this.hasObservers &&
        this.observers.isComponentRemovedSet() &&
        this.observers.componentRemoved.notify(comp);
    }
    this.hasObservers &&
      this.observers.isComponentsUpdatedSet() &&
      this.observers.componentsUpdated.notify();
    return filtered;
  }

  getChild(type: string): ComponentInstance<any, any, any, any> | null {
    for (const child of this.node.traverseChildren()) {
      const found = child.components.get(type) as ComponentInstance;
      if (found) return found;
    }
    return null;
  }

  getParent(type: string): ComponentInstance<any, any, any, any> | null {
    for (const parent of this.node.traverseParents()) {
      const found = parent.components.get(type) as ComponentInstance;
      if (found) return found;
    }
    return null;
  }
}
