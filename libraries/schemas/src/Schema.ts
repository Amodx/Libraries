import { Property } from "./Properties/Property";
import { PropertyInputBase } from "./Inputs/PropertyInput";
import { PropertyInputRegister } from "./Inputs/PropertyInputRegister";
import { SchemaNode, TemplateNode } from "Schemas/SchemaNode";
import { SchemaInstance } from "./Schemas/SchemaInstance";
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
    public properties: Property[]
  ) {}
}

export class Schema<DataInterface extends object = any> {
  static Create<DataInterface extends object = any>(
    ...properties: Property[]
  ): SchemaInstance<DataInterface> & DataInterface {
    return new Schema<DataInterface>(
      SchemaData.Create({ id: "", name: "", properties })
    ).instantiate();
  }
  static Inputs = PropertyInputRegister;

  private constructor(public data: SchemaData) {
    this.process();
  }

  private template: TemplateNode;

  instantiate(): SchemaInstance<DataInterface> & DataInterface {
    const traverse = (
      properties: TemplateNode,
      schemaNode: SchemaNode,
      parentObject: any
    ) => {
      for (const template of properties.children) {
        schemaNode.children ??= [];
        const node = new SchemaNode(
          Property.Create(template.property),
          instance
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
            return node.property.value;
          },
          set(value: any) {
            node.update(value);
          },
        });
      }
    };

    const instance = new SchemaInstance(this);
    traverse(this.template, instance.__root, instance);
    return instance as any;
  }

  private process() {
    const traverse = (properties: Property[], parent: TemplateNode) => {
      for (const property of properties) {
        parent.children ??= [];
        parent.children.push(new TemplateNode(property));
        if (property.children) traverse(property.children, parent);
      }
    };
    const root = new TemplateNode(Property.Create({ id: "__root__" }));

    traverse(this.data.properties, root);

    this.template = root;
  }
}
