import { Schema } from "../Schema";
import { SchemaNode } from "./SchemaNode";
import { Property } from "../Properties/Property";
import { ObjectPath } from "../Properties/ObjectPath";
import { ObjectSchema } from "./ObjectSchema";

export class ObjectSchemaInstanceBase {
  constructor(
    private readonly __schema: Schema,
    private readonly __objectSchema: ObjectSchema
  ) {}

  getSchema() {
    return this.__objectSchema;
  }
}

export type ObjectSchemaInstance<T extends object = {}> =
  ObjectSchemaInstanceBase & T;
