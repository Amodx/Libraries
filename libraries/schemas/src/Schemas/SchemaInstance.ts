import { Schema } from "../Schema";
import { SchemaNode } from "./SchemaNode";
import { Property } from "../Properties/Property";

export class SchemaInstance<DataInterface extends object = any> {
  __root = new SchemaNode(Property.Create({ id: "__root__" }),{});
  constructor(private readonly __schema: Schema) {}

  traverse(run: (node: SchemaNode) => void) {
    const traverse = (parent: SchemaNode) => {
      if (!parent.children) return;
      for (const node of parent.children) {
        run(node);
        if (node.property.children && node.property.children.length) {
          traverse(node);
        }
      }
    };
    traverse(this.__root);
  }

  getRoot() {
    return this.__root;
  }

  clone(): SchemaInstance & DataInterface {
    return this.__schema.instantiate();
  }

  store() {
    const rootObject: DataInterface = {} as any;
    const traverse = (schemaNode: SchemaNode, parentObject: any) => {
      if (!schemaNode.children) return;
      for (const node of schemaNode.children) {
        if (node.children && node.children.length) {
          const parent = {};
          traverse(node, parent);
          parentObject[node.property.id] = parent;
          continue;
        }

        parentObject[node.property.id] = node.store();
      }
    };

    traverse(this.getRoot(), rootObject);
    return rootObject;
  }

  loadIn(data: DataInterface) {
    const traverse = (schemaNode: SchemaNode, parentObject: any) => {
      if (!schemaNode.children) return;
      for (const node of schemaNode.children) {
        if (node.property.id in parentObject) {
          if (node.children && node.children.length) {
            traverse(node, parentObject[node.property.id]);
          } else {
            node.loadIn(parentObject[node.property.id]);
          }
        }
      }
    };

    traverse(this.getRoot(), data);
  }
}
