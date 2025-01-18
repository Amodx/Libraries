import { ContextCursor } from "../Contexts/ContextCursor";
import { CreateContextData } from "../Contexts/Context.types";
import { NCSRegister } from "../Register/NCSRegister";
import { NodeCursor } from "./NodeCursor";
import { NCSPools } from "../Pools/NCSPools";

export class NodeContext {
  node: NodeCursor;
  static Get() {
    const cursor = NCSPools.nodeContext.get();
    if (!cursor) return new NodeContext();
    return cursor;
  }

  static Retrun(cursor: NodeContext) {
    return NCSPools.nodeContext.addItem(cursor);
  }

  get context() {
    return this.node.arrays._context[this.node.index];
  }

  private constructor() {}

  dispose() {
    if (!this.context) return;
    const context = this.context;
    const defaultCursor = ContextCursor.Get();
    for (let i = 0; i < context.length; i += 2) {
      defaultCursor.setContext(this.node, context[i]);
      defaultCursor.dispose();
    }
    ContextCursor.Retrun(defaultCursor);
  }

  add(contextData: CreateContextData) {
    const cursor = ContextCursor.Get();

    if (!this.context) {
      this.node.arrays._context[this.node.index] =
        NCSPools.numberArray.get() || [];
    }
    const context = this.context;
    for (let i = 0; i < context.length; i++) {
      cursor.setContext(this.node, context[i]);
      if (cursor.type == contextData[0]) return cursor.index;
    }
    const contextType = NCSRegister.contexts.get(contextData[0]);
    const typeId = NCSRegister.contexts.idPalette.getNumberId(contextData[0]);

    const newContext = this.node.graph._contexts.addContext(
      typeId,
      [this.node.index],
      contextType,
      contextType.schema
        ? contextType.schema
            .getView(contextData[2] || "default")!
            .createData(contextData[1])
        : null,
      contextData[3]
    );
    context.push(newContext);
    cursor.setContext(this.node, newContext);
    contextData[0] = "";
    contextData[1] = null;
    contextData[2] = null;
    contextData[3] = null;
    NCSPools.createContextData.addItem(contextData);
    ContextCursor.Retrun(cursor);

    return newContext;
  }

  remove(type: string) {
    const cursor = ContextCursor.Get();
    const context = this.context;
    for (let i = 0; i < context.length; i++) {
      cursor.setContext(this.node, context[i]);
      if (cursor.type == type) {
        context.splice(i, 1);
        for (let n = 0; n < cursor.nodes.length; n++) {
          if (cursor.nodes[n] == this.node.index) {
            cursor.nodes.splice(n, 1);
            break;
          }
        }
        ContextCursor.Retrun(cursor);
        return true;
      }
    }
    ContextCursor.Retrun(cursor);
    return false;
  }

  get(type: string): ContextCursor | null {
    const context = this.context;
    const cursor = ContextCursor.Get();

    if (context) {
      for (let i = 0; i < context.length; i++) {
        cursor.setContext(this.node, context[i]);
        if (cursor.type == type) return cursor;
      }
    }

    const parentCursor = NodeCursor.Get();

    for (const parent of this.node.traverseParents(parentCursor)) {
      if (this.node.arrays._context[parent.index]) {
        const context = this.node.arrays._context[parent.index];
        for (let i = 0; i < context.length; i++) {
          cursor.setContext(parent, context[i]);
          if (cursor.type == type) {
            //@todo add anchor
            cursor.setContext(parent, context[i]);

            return cursor;
          }
        }
      }
    }
    NodeCursor.Retrun(parentCursor);
    return null;
  }
}
