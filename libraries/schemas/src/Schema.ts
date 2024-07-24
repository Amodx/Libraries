import { Property } from "./Properties/Property";
import { PropertyInputRegister } from "./Inputs/PropertyInputRegister";
import { SchemaNode, TemplateNode } from "./Schemas/SchemaNode";
import { ObjectSchema } from "./Schemas/ObjectSchema";
import {
  ObjectSchemaInstance,
  ObjectSchemaInstanceBase,
} from "./Schemas/ObjectSchemaInstance";
class SchemaData {
  static Create(data: Partial<SchemaData>): SchemaData {
    return {
      id: data.id ? data.id : crypto.randomUUID(),
      name: data.id ? data.id : data.name || "",
      properties: data.properties ? [...data.properties] : [],
    };
  }

  private constructor(
    public id: string,
    public name: string,
    public properties: Property<any, any>[]
  ) {}
}

export class Schema<DataInterface extends object = {}> {
  static Create<DataInterface extends object = {}>(
    ...properties: Property<any, any>[]
  ): Schema<DataInterface> {
    return new Schema<DataInterface>(
      SchemaData.Create({ id: "", name: "", properties })
    );
  }
  static CreateInstance<DataInterface extends object = {}>(
    ...properties: Property<any, any>[]
  ): ObjectSchemaInstance<DataInterface> {
    return new Schema<DataInterface>(
      SchemaData.Create({ id: "", name: "", properties })
    ).instantiate();
  }

  static Inputs = PropertyInputRegister;

  private constructor(public data: SchemaData) {
    this.process();
  }

  private template: TemplateNode;

  createData(): DataInterface {
    const traverse = (properties: TemplateNode, parentObject: any) => {
      for (const template of properties.children) {
        if (template.children && template.children.length) {
          const parent = {};
          traverse(template, parent);
          parentObject[template.property.id] = parent;
          continue;
        }
        Object.defineProperty(parentObject, template.property.id, {
          value: template.property.value,
        });
      }
    };

    const instance = {} as any;
    traverse(this.template, instance);
    return instance as any;
  }

  instantiate(
    data?: Partial<DataInterface>
  ): ObjectSchemaInstance<DataInterface> {
    const traverse = (
      properties: TemplateNode,
      schemaNode: SchemaNode,
      parentObject: any
    ) => {
      for (const template of properties.children) {
        schemaNode.children ??= [];
        const node = new SchemaNode(
          Property.Create(template.property),
          objectSchema
        );
        schemaNode.children.push(node);
        if (template.children && template.children.length) {
          const parent = {};
          traverse(template, node, parent);
          parentObject[template.property.id] = parent;
          continue;
        }
        Object.defineProperty(parentObject, template.property.id, {
          get() {
            return node.get();
          },
          set(value: any) {
            node.update(value);
          },
        });
      }
    };

    const objectSchema = new ObjectSchema(this);
    const instance = new ObjectSchemaInstanceBase(this, objectSchema);
    traverse(this.template, objectSchema.__root, instance);

    objectSchema.traverse((node) => {
      if (node.property.initialize) node.property.initialize(node);
    });
    if (data) objectSchema.loadIn(data);

    objectSchema.init();

    return instance as any;
  }

  private process() {
    const traverse = (properties: Property[], parent: TemplateNode) => {
      for (const property of properties) {
        parent.children ??= [];
        const newNode = new TemplateNode(property);
        parent.children.push(newNode);
        if (property.children) traverse(property.children, newNode);
      }
    };
    const root = new TemplateNode(Property.Create({ id: "__root__" }));

    traverse(this.data.properties, root);

    this.template = root;
  }
}
