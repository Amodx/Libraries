import { ObjectSchemaInstance, Schema } from "@amodx/schemas";
import { TraitData, TraitRegisterData } from "./TraitData";
import { TraitInstance } from "./TraitInstance";
import { TraitInstanceMap } from "./TraitInstanceMap";
import { ItemPool } from "../Pools/ItemPool";

export class TraitPrototype<
  TraitSchema extends object = {},
  Data extends Record<string, any> = {},
  Logic extends Record<string, any> = {},
  Shared extends Record<string, any> = {}
> {
  schemaController: Schema<TraitSchema> | null;
  baseContextSchema: TraitSchema;
  pool = new ItemPool<TraitInstance<TraitSchema, Data, Logic, Shared>>();
  constructor(
    public data: TraitRegisterData<TraitSchema, Data, Logic, Shared>
  ) {
    this.schemaController =
      Array.isArray(data.schema) && data.schema.length
        ? Schema.Create(...data.schema)
        : null;

    this.baseContextSchema = (
      this.schemaController ? this.schemaController.createData() : {}
    ) as TraitSchema;
    this.pool.maxSize = data.pool?.maxSize || 100;
  }

  getSchema(
    overrides: Partial<TraitSchema>
  ): ObjectSchemaInstance<TraitSchema> {
    if (!this.schemaController)
      return structuredClone(this.baseContextSchema) as any;
    return this.schemaController.instantiate(overrides);
  }

  private getPooled() {
    let comp: TraitInstance<TraitSchema, Data, Logic, Shared> | null = null;
    if (this.data.pool?.maxSize) {
      comp = this.pool.get();
    }
    return comp || new TraitInstance();
  }
  private return(component: TraitInstance<TraitSchema, Data, Logic, Shared>) {
    if (this.data.pool?.maxSize) {
      return this.pool.addItem(component);
    }
    return null;
  }

  create(parent: TraitInstance["parent"], data: TraitData) {
    const instance = this.getPooled();
    instance.proto = this;
    instance.parent = parent;

    if (this.data.schema && !instance.schema) {
      instance.schema = this.getSchema(data.schema);
    }
    if (this.data.schema && instance.schema) {
      instance.schema.getSchema().loadIn(this.data.schema);
    }

    if (this.data.logic) {
      instance.logic = this.data.logic
        ? typeof this.data.logic == "function"
          ? this.data.logic(instance)
          : structuredClone(this.data.logic)
        : ({} as Logic);
    }

    if (this.data.data) {
      instance.data = this.data.data
        ? typeof this.data.data == "function"
          ? this.data.data(instance)
          : structuredClone(this.data.data)
        : ({} as Data);
    }

    if (data.state) {
      instance.state = structuredClone(data.state);
    }

    return instance;
  }

  destory(instance: TraitInstance<TraitSchema, Data, Logic, Shared>) {
    const node = instance.getNode();
    const map = TraitInstanceMap.getMap(instance.type);
    map.removeNode(node, instance);
    this.return(instance);
  }
}
