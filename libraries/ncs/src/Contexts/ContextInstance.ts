import { ContextData } from "./ContextData";
import { NodeInstance } from "../Nodes/NodeInstance";
import { ObjectPath, ObjectSchemaInstance, QueryPath } from "@amodx/schemas";
import { SchemaNode } from "@amodx/schemas/Schemas/SchemaNode";
import { ContextPrototype } from "./ContextPrototype";
export class ContextInstance<
  ContextSchema extends {} = {},
  Data extends {} = {}
> {
  type: string;
  data: Data;
  schema: ObjectSchemaInstance<ContextSchema>;
  constructor(
    public node: NodeInstance,
    proto: ContextPrototype<ContextSchema, Data>,
    data: ContextData
  ) {
    this.schema = proto.getSchema(data.schema);

    this.type = proto.data.type;

    proto.data.data && (this.data = proto.data.data);
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
