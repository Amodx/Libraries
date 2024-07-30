import { Schema } from "../Schema";
import { ObjectSchema } from "./ObjectSchema";

export class ObjectSchemaInstanceBase {
  constructor(
    private readonly __schema: Schema,
    private readonly __objectSchema: ObjectSchema
  ) {}

  getSchema() {
    return this.__objectSchema;
  }

  toJSON() {
    return this.__objectSchema.store();
  }
}                 

export type ObjectSchemaInstance<T extends object = {}> =
  ObjectSchemaInstanceBase & T;
