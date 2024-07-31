import { ContextInstance } from "../../Contexts/ContextInstance";
import { NodeInstance } from "../NodeInstance";
import { ContextAnchorInstance } from "../../Contexts/ContextInstanceAnchor";
import { ContextData } from "../../Contexts/ContextData";
import { NCSRegister } from "../../Register/NCSRegister";

export class NodeContext {
  contexts = new Map<string, ContextInstance>();
  anchors = new Map<string, ContextAnchorInstance>();

  constructor(public node: NodeInstance) {}

  add(context: ContextData) {
    if (this.contexts.has(context.type)) {
      return this.contexts.get(context.type)!;
    }
    const newContext = new ContextInstance(
      this.node,
      NCSRegister.contexts.get(context.type, context.namespace || "main"),
      context
    );
    this.contexts.set(context.type, newContext);
    return newContext;
  }

  remove(type: string) {
    const context = this.contexts.get(type);
    if (!context) return;
    this.contexts.delete(type);
    return context;
  }

  get(type: string): ContextInstance | ContextAnchorInstance | null {
    if (this.contexts.has(type)) return this.contexts.get(type)!;
    if (this.anchors.has(type)) return this.anchors.get(type)!;
    for (const parent of this.node.traverseParents()) {
      if (parent.hasContexts) {
        const found = parent.context.get(type);
        if (found) {
          const newAnchor =
            found instanceof ContextInstance
              ? new ContextAnchorInstance(this.node, found)
              : new ContextAnchorInstance(this.node, found.getContext());
          this.anchors.set(type, newAnchor);
          return newAnchor;
        }
      }
    }
    return null;
  }
}
