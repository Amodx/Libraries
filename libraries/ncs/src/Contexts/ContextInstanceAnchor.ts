import { NodeInstance } from "../Nodes/NodeInstance";
import { ContextInstance } from "./ContextInstance";
import { ObjectPath, QueryPath } from "@amodx/schemas";
import { SchemaNode } from "@amodx/schemas/Schemas/SchemaNode";
export class ContextAnchorInstance<
  ContextSchema extends {} = {},
  Data extends {} = {}
> {
  get type() {
    return this.context.type;
  }
  get schema() {
    return this.context.schema;
  }
  get data() {
    return this.context.data;
  }

  constructor(
    public node: NodeInstance,
    private context: ContextInstance<Data>
  ) {}
  getContext() {
    return this.context;
  }
  addOnSchemaUpdate(
    path: QueryPath<ContextSchema>,
    listener: (node: SchemaNode) => void
  ) {
    this.schema
      .getSchema()
      .getNode(ObjectPath.Create<ContextSchema>(path as unknown as any))
      ?.observers.updatedOrLoadedIn.subscribe(listener);
  }
  removeOnSchemaUpdate(
    path: QueryPath<ContextSchema>,
    listener: (node: SchemaNode) => void
  ) {
    this.schema
      .getSchema()
      .getNode(ObjectPath.Create<ContextSchema>(path as unknown as any))
      ?.observers.updatedOrLoadedIn.unsubscribe(listener);
  }
}
