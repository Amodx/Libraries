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

    const compProto = NCSRegister.components.get(comp[0]);
    const typeId = NCSRegister.components.idPalette.getNumberId(compProto.type);
    let compArray = this.node.graph._components[typeId]!;
    if (!compArray) {
      compArray = new ComponentArray(this.node.graph, typeId);
      if (compArray.proto.update) {
        this.node.graph._updatingComponents.push(compArray);
      }
      this.node.graph._components[typeId] = compArray;
    }

    let compData = null;
    if (comp[3]) {
      compData = compArray.schemaArray.schema
        .getView(comp[2] || "default")!
        .fromRemote(comp[1]);
    } else {
      compData = compProto.schema
        ? compProto.schema.getView(comp[2] || "default")?.createData(comp[1]) ||
          null
        : null;
    }

    const componentIndex = compArray.addComponent(
      this.node.index,
      compData,
      comp[2] || "default"
    );

    comp[0] = "";
    comp[1] = null;
    comp[2] = null;
    comp[3] = null;

    NCSPools.createComponentData.addItem(comp);

    this.components.push(typeId, componentIndex);
    compArray.observers.nodeAdded.notify(this.node.index);
    if (this.node.hasObservers) {
      defaultCursor.setInstance(this.node, typeId, componentIndex);

      this.node.observers.isComponentAddedSet &&
        this.node.observers.componentAdded.notify(defaultCursor);
      this.node.observers.isComponentsUpdatedSet &&
        this.node.observers.componentsUpdated.notify(defaultCursor);
    }

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
  has(type: string): boolean {
    const components = this.components;
    if (!components) return false;
    const numberId = NCSRegister.components.idPalette.getNumberId(type);
    for (let i = 0; i < components.length; i += 2) {
      if (components[i] == numberId) {
        return true;
      }
    }
    return false;
  }
  get(
    type: string,
    cursor = ComponentCursor.Get(),
    nodeCursor = NodeCursor.Get()
  ): ComponentCursor<any, any, any> | null {
    const components = this.components;
    if (!components) return null;
    const numberId = NCSRegister.components.idPalette.getNumberId(type);
    for (let i = 0; i < components.length; i += 2) {
      if (components[i] == numberId) {
        if (nodeCursor !== this.node) this.node.cloneCursor(nodeCursor);
        cursor.setInstance(nodeCursor, numberId, components[i + 1]);
        return cursor;
      }
    }
    return null;
  }
  getAll(type: string): ComponentCursor<any, any, any>[] {
    const components = this.components;
    if (!components) return [];
    const cursors: ComponentCursor<any, any, any>[] = [];
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
    cursor = ComponentCursor.Get(),
    nodeCursor = NodeCursor.Get()
  ): ComponentCursor<any, any, any> | null {
    for (const child of this.node.traverseChildren()) {
      if (!child.components) continue;
      const found = child.components.get(type, cursor, nodeCursor);
      if (found) return found;
    }
    return null;
  }

  getParent(
    type: string,
    cursor = ComponentCursor.Get(),
    nodeCursor = NodeCursor.Get()
  ): ComponentCursor<any, any, any> | null {
    for (const parent of this.node.traverseParents()) {
      if (!parent.components) continue;
      const found = parent.components.get(type, cursor, nodeCursor);
      if (found) return found;
    }
    return null;
  }
}
