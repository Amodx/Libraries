import { ObjectSchemaInstance, Schema } from "@amodx/schemas";
import { ContextRegisterData } from "./ContextData";

export class ContextPrototype<
  ComponentSchema extends object = {},
  Data extends object = {}
> {
  schemaController: Schema<ComponentSchema> | null;
  baseContextSchema: ComponentSchema;
  constructor(public data: ContextRegisterData<ComponentSchema, Data>) {
    this.schemaController =
      Array.isArray(data.schema) && data.schema.length
        ? Schema.Create(...data.schema)
        : null;

    this.baseContextSchema = (
      this.schemaController ? this.schemaController.createData() : {}
    ) as ComponentSchema;
  }

  getSchema(overrides: Partial<ComponentSchema>): ObjectSchemaInstance<ComponentSchema> {
    if (!this.schemaController) return structuredClone(this.baseContextSchema) as any;
    return this.schemaController.instantiate(overrides);
  }
}
