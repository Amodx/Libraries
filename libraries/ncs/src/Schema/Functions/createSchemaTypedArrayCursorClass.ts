import { SchemaCursorClassBase, SchemaProxyData } from "../Schema.types";
import { Property } from "../Property/Property";
import { Schema } from "../Schema";
import { createBaseSchemaCursor } from "./createBaseSchemaCursor";
import { SchemaArrayCursor } from "Schema/SchemaArrayCursor";

function traverse(parent: any, properties: Property[]) {
  for (let i = 0; i < properties.length; i++) {
    const property = properties[i];
    const index = property.index;
    if (!property.children) {
      Object.defineProperty(parent.prototype, property.id, {
        get(this: SchemaCursorClassBase): any {
          if (this.__cursor.hasProxy(index)) {
            return this.__cursor.fetchProxyData(index);
          }
          return this.__cursor.data[index];
        },
        set(this: SchemaCursorClassBase, value: any) {
          let obs = this.__cursor.getObserver(index);
          let proxy = this.__cursor.hasProxy(index);
          if (obs) {
            const oldVale = proxy
              ? this.__cursor.fetchProxyData(index)
              : this.__cursor.data[index];
            if (oldVale != value) {
              this.__cursor.data[index] = value;
              if (proxy) {
                this.__cursor.setProxyData(index, value);
              }
              obs.notify(value);
              return;
            }
          }
          this.__cursor.data[index] = value;
          if (proxy) {
            this.__cursor.setProxyData(index, value);
          }
        },
      });
      continue;
    }
    class SchemaCursorProperty {
      constructor(
        public __cursor: SchemaArrayCursor,
        public __cursors: SchemaCursorClassBase[]
      ) {}
    }
    traverse(SchemaCursorProperty, property.children!);
    Object.defineProperty(parent.prototype, property.id, {
      get(this: SchemaCursorClassBase): any {
        let v = this.__cursors[index];
        if (!v) {
          v = new SchemaCursorProperty(this.__cursor, this.__cursors);
          this.__cursors[index] = v;
        }
        return v;
      },
      set(this: SchemaCursorClassBase, value: any) {
        //  (this as SchemaClassBase).__data.current[index] = value;
      },
    });
  }
}

export function createSchemaTypedArrayCursorClass(schema: Schema) {
  const SchemaCursor = createBaseSchemaCursor();
  traverse(SchemaCursor, schema.root.children!);
  return SchemaCursor;
}
