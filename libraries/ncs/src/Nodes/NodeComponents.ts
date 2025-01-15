import { CreateComponentData } from "../Components/Component.types";
import { ComponentCursor } from "../Components/ComponentCursor";
import { NodeCursor } from "./NodeCursor";
import { NCSRegister } from "../Register/NCSRegister";
import { ComponentArray } from "../Components/ComponentArray";
import { NCSPools } from "../Pools/NCSPools";

const defaultCursor = ComponentCursor.Get();
export class NodeComponents {
  static Get() {
    const cursor = NCSPools.nodeComponents.get();
    if (!cursor) return new NodeComponents();
    return cursor;
  }

  static Retrun(cursor: NodeComponents) {
    return NCSPools.nodeComponents.addItem(cursor);
  }
  get components() {
    return this.node.arrays._components[this.node.index] || null;
  }
  node: NodeCursor;
  private constructor() {}

  dispose() {
    if (!this.components) return;
    const components = this.components;
    for (let i = 0; i < components.length; i += 2) {
      defaultCursor.setInstance(this.node, components[i], components[i + 1]);
      defaultCursor.dispose();
    }
  }

  add(comp: CreateComponentData) {
    if (!this.components) {
      this.node.arrays._components[this.node.index] =
        NCSPools.numberArray.get() || [];
    }

    const type = NCSRegister.components.get(comp[0]);
    let compArray = this.node.graph._components[comp[0]]!;
    if (!compArray) {
      compArray = new ComponentArray(this.node.graph, comp[0]);
      if (compArray.proto.update) {
        this.node.graph._updatingComponents.push(compArray);
      }
      this.node.graph._components[comp[0]] = compArray;
    }

    const componentIndex = compArray.addComponent(
      this.node.index,
      type.schema
        ? type.schema.getView(comp[2] || "default")?.createData(comp[1]) || null
        : null,
      comp[2] || "default"
    );
    let componentsArray = this.components;
    if (!componentsArray) {
      componentsArray = [];
      this.node.arrays._components[this.node.index] = componentsArray;
    }
    this.components.push(comp[0], componentIndex);
    defaultCursor.setInstance(this.node, comp[0], componentIndex);
    if (this.node.hasObservers) {
      this.node.observers.isComponentAddedSet &&
        this.node.observers.componentAdded.notify(defaultCursor);
      this.node.observers.isComponentsUpdatedSet &&
        this.node.observers.componentsUpdated.notify(defaultCursor);
    }

    comp[0] = -1;
    comp[1] = null;
    comp[2] = null;

    NCSPools.createComponentData.addItem(comp);

    return componentIndex;
  }

  remove(type: string) {
    const components = this.components;
    if (!components) return;
    let removeIndex = -1;
    let removeComponentIndex = -1;
    const numberId = NCSRegister.components.idPalette.getNumberId(type);
    for (let i = 0; i < components.length; i += 2) {
      if (components[i] == numberId) {
        removeIndex = i;
        removeComponentIndex = components[i + 1];
        break;
      }
    }
    if (removeIndex == -1) return;
    const component = this.components[removeIndex];
    if (component) {
      defaultCursor.setInstance(this.node, numberId, removeComponentIndex);
      this.components.splice(removeIndex, 2)!;

      if (this.node.hasObservers) {
        this.node.observers.isComponentRemovedSet &&
          this.node.observers.componentRemoved.notify(defaultCursor);
        this.node.observers.isComponentsUpdatedSet &&
          this.node.observers.componentsUpdated.notify(defaultCursor);
      }
      defaultCursor.dispose();
      return true;
    }
  }

  get(
    type: string,
    cursor = defaultCursor
  ): ComponentCursor<any, any, any, any> | null {
    const components = this.components;
    if (!components) return null;
    const numberId = NCSRegister.components.idPalette.getNumberId(type);
    for (let i = 0; i < components.length; i += 2) {
      if (components[i] == numberId) {
        cursor.setInstance(this.node, numberId, components[i + 1]);
        return cursor;
      }
    }
    return null;
  }
  getAll(type: string): ComponentCursor<any, any, any, any>[] {
    const components = this.components;
    if (!components) return [];
    const cursors: ComponentCursor<any, any, any, any>[] = [];
    const numberId = NCSRegister.components.idPalette.getNumberId(type);
    for (let i = 0; i < components.length; i += 2) {
      if (components[i] == numberId) {
        const cursor = ComponentCursor.Get();
        cursor.setInstance(this.node, components[i], components[i + 1]);
        cursors.push(cursor);
      }
    }
    return cursors;
  }
  removeAll(type: string) {
    const components = this.components;
    if (!components) return false;
    const numberId = NCSRegister.components.idPalette.getNumberId(type);
    for (let i = components.length; i > 0; i -= 2) {
      if (components[i] == numberId) {
        defaultCursor.setInstance(this.node, components[i], components[i + 1]);
        this.components.splice(i, 2)!;
        if (this.node.hasObservers) {
          this.node.observers.isComponentRemovedSet &&
            this.node.observers.componentRemoved.notify(defaultCursor);
          this.node.observers.isComponentsUpdatedSet &&
            this.node.observers.componentsUpdated.notify(defaultCursor);
        }
      }
    }
    return true;
  }

  getChild(
    type: string,
    cursor = defaultCursor
  ): ComponentCursor<any, any, any, any> | null {
    for (const child of this.node.traverseChildren()) {
      if (!child.components) continue;
      const found = child.components.get(type, cursor);
      if (found) return found;
    }
    return null;
  }

  getParent(
    type: string,
    cursor = defaultCursor
  ): ComponentCursor<any, any, any, any> | null {
    for (const parent of this.node.traverseParents()) {
      if (!parent.components) continue;
      const found = parent.components.get(type, cursor);
      if (found) return found;
    }
    return null;
  }
}
