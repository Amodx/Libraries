import { Schema } from "../Schema";
import { SchemaNode } from "./SchemaNode";
import { Property } from "../Properties/Property";
import { ObjectPath } from "../Properties/ObjectPath";

export class ObjectSchema<DataInterface extends object = {}> {
  __root = new SchemaNode(Property.Create({ id: "__root__" }), {});

  constructor(private readonly __schema: Schema) {}

  init() {
    this.traverse((_) => {
      _.property.initialize && _.property.initialize(_);
      _.init(this);
    });

    this.evaluate();
    this.validate();
    return this;
  }

  evaluate() {
    this.traverse((_) => {
      _.observers.evaluate.notify();
    });
  }

  validate() {
    this.traverse((_) => {
      _.observers.evaluate.notify();
    });
  }

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

  clone(): ObjectSchema<DataInterface> {
    return this.__schema
      .instantiate()
      .getSchema() as ObjectSchema<DataInterface>;
  }

  getNode(path: ObjectPath<DataInterface, any>): SchemaNode | null {
    let finalNode: SchemaNode | null = null;

    const traverse = (node: SchemaNode, path: string[]) => {
      if (!node.children) return;
      for (const child of node.children) {
        if (child.property.id == path[0]) {
          if (child.property.children && child.property.children.length) {
            path.shift();
            traverse(child, path);
            return;
          }
          finalNode = child;
        }
      }
    };

    traverse(this.getRoot(), [...path.path] as string[]);
    return finalNode;
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
