import { ContextCursor } from "../Contexts/ContextCursor";
import { CreateContextData } from "../Contexts/Context.types";
import { NCSRegister } from "../Register/NCSRegister";
import { NodeCursor } from "./NodeCursor";

const defaultCursor = new ContextCursor();
export class NodeContext {
  node: NodeCursor;

  get context() {
    return this.node.arrays._context[this.node.index];
  }

  add(contextData: CreateContextData, cursor = defaultCursor) {
    const context = this.context;
    for (let i = 0; i < context.length; i++) {
      cursor.setContext(this.node, context[i]);
      if (cursor.type == contextData[0]) return contextData;
    }
    const contextType = NCSRegister.contexts.get(contextData[0]);
    const typeId = NCSRegister.contexts.idPalette.getNumberId(contextData[0]);

    const newContext = this.node.graph.contexts.addContext(
      typeId,
      [this.node.index],
      contextType,
      contextType.schema
        ? contextType.schema.views
            .get(contextData[2] || "default")!
            .createData(contextData[1])
        : null
    );
    context.push(newContext);
    cursor.setContext(this.node, newContext);
    return cursor;
  }

  remove(type: string) {
    const context = this.context;
    for (let i = 0; i < context.length; i++) {
      defaultCursor.setContext(this.node, context[i]);
      if (defaultCursor.type == type) {
        context.splice(i, 1);
        for (let n = 0; n < defaultCursor.nodes.length; n++) {
          if (defaultCursor.nodes[n] == this.node.index) {
            defaultCursor.nodes.splice(n, 1);
            break;
          }
        }
        return true;
      }
    }
    return false;
  }

  get(type: string,cursor = defaultCursor): ContextCursor | null {
    const context = this.context;
    for (let i = 0; i < context.length; i++) {
      cursor.setContext(this.node, context[i]);
      if (cursor.type == type) return cursor;
    }
    for (const parent of this.node.traverseParents()) {
      if (parent.hasContexts) {
        const found = parent.context.get(type);
        if (found) {
          found.nodes.push(this.node.index);
          this.context.push(found.index);
          return found;
        }
      }
    }
    return null;
  }
}
