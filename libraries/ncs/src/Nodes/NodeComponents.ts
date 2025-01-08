import { CreateComponentData } from "../Components/Component.types";
import { ComponentCursor } from "../Components/ComponentCursor";
import { NodeCursor } from "./NodeCursor";
import { NCSRegister } from "../Register/NCSRegister";

const defaultCursor = new ComponentCursor();
export class NodeComponents {
  get components() {
    return this.node.arrays._components[this.node.index];
  }
  node: NodeCursor;

  dispose() {
    const components = this.components;
    if (!components) return;
    for (let i = 0; i < components.length; i += 2) {
      defaultCursor.setInstance(this.node, components[i], components[i + 1]);
      defaultCursor.dispose();
    }
  }

  add(comp: CreateComponentData, cursor = defaultCursor) {
    const type = NCSRegister.components.get(comp[0]);
    const compArray = this.node.graph.components.get(comp[0])!;
    const typeNumberId = NCSRegister.components.idPalette.getNumberId(comp[0]);
    const componentIndex = compArray.addComponent(
      this.node.index,
      comp[1],
      comp[2],
      type.schema
        ? type.schema.views.get(comp[3] || "default")?.createData(comp[2]) ||
            null
        : null
    );
    this.components.push(typeNumberId, componentIndex);
    cursor.setInstance(this.node, typeNumberId, componentIndex);
    if (this.node.hasObservers) {
      this.node.observers.isComponentAddedSet &&
        this.node.observers.componentAdded.notify(cursor);
      this.node.observers.isComponentsUpdatedSet &&
        this.node.observers.componentsUpdated.notify(cursor);
    }

    return cursor;
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
        const cursor = new ComponentCursor();
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
        defaultCursor.setInstance(this.node,components[i],components[i+1]);
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
