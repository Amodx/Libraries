import { SchemaCursorIndex } from "../Schema.types";
import { Property } from "../Property/Property";
import { Schema } from "../Schema";

function traverse(parent: any, properties: Property[]) {
  for (let i = 0; i < properties.length; i++) {
    const property = properties[i];
    const index = property.index;
    if (!property.children) {
      parent[property.id] = index;
      continue;
    }

    const newParent = {};
    traverse(newParent, property.children!);
    parent[property.id] = newParent;
  }
}

export function createSchemaIndex<T = any>(
  schema: Schema
): SchemaCursorIndex<T> {
  const data: any = {};
  traverse(data, schema.root.children!);
  return data;
}
