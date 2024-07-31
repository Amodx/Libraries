import { ObjectSchemaInstance, Schema } from "@amodx/schemas";
import { ComponentData, ComponentRegisterData } from "./ComponentData";
import { ComponentInstance } from "./ComponentInstance";
import { ComponentInstanceMap } from "./ComponentInstanceMap";
import { NodeInstance } from "../Nodes/NodeInstance";
import { ItemPool } from "../Pools/ItemPool";

export class ComponentPrototype<
  ComponentSchema extends object = {},
  Data extends Record<string, any> = {},
  Logic extends Record<string, any> = {},
  Shared extends Record<string, any> = {}
> {
  schemaController: Schema<ComponentSchema> | null;
  baseContextSchema: ComponentSchema;
  pool = new ItemPool<
    ComponentInstance<ComponentSchema, Data, Logic, Shared>
  >();
  constructor(
    public data: ComponentRegisterData<ComponentSchema, Data, Logic, Shared>
  ) {
    this.schemaController =
      Array.isArray(data.schema) && data.schema.length
        ? Schema.Create(...data.schema)
        : null;

    this.baseContextSchema = (
      this.schemaController ? this.schemaController.createData() : {}
    ) as ComponentSchema;
    this.pool.maxSize = data.pool?.maxSize || 100;
  }

  getSchema(
    overrides: Partial<ComponentSchema>
  ): ObjectSchemaInstance<ComponentSchema> {
    if (!this.schemaController)
      return structuredClone(this.baseContextSchema) as any;
    return this.schemaController.instantiate(overrides);
  }

  private getPooled() {
    let comp: ComponentInstance<ComponentSchema, Data, Logic, Shared> | null =
      null;
    if (this.data.pool?.maxSize) {
      comp = this.pool.get();
    }
    return comp || new ComponentInstance();
  }
  private return(
    component: ComponentInstance<ComponentSchema, Data, Logic, Shared>
  ) {
    if (this.data.pool?.maxSize) {
      return this.pool.addItem(component);
    }
    return null;
  }

  create(node: NodeInstance, data: ComponentData) {
    const instance = this.getPooled();
    instance.node = node;

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

    const map = ComponentInstanceMap.getMap(data.type);
    map.addNode(node, instance);
    return instance;
  }

  destory(component: ComponentInstance<ComponentSchema, Data, Logic, Shared>) {
    const map = ComponentInstanceMap.getMap(component.type);
    map.removeNode(component.node, component);
    this.return(component);
  }
}
