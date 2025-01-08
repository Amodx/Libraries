import { SchemaCursorClassBase } from "../Schema.types";
import { SchemaArrayCursor } from "../SchemaArrayCursor";
import { SchemaView } from "../SchemaView";
import { SchemaArray } from "../SchemaArray";

export function createBaseSchemaCursor() {
  class SchemaCursor implements SchemaCursorClassBase {
    __cursor: SchemaArrayCursor;
    __cursors = [];

    constructor(public __view: SchemaView<any>) {
      this.__cursor = new SchemaArrayCursor(this.__view.schema.array);
    }
    __array: SchemaArray;
    __index: number;
    setInstance(index: number): void {
      this.__cursor.setIndex(index);
    }
    getInstance(): number {
      return this.__cursor._index;
    }

    getCursor(): SchemaArrayCursor {
      return this.__cursor;
    }
    getSchemaIndex() {
      return this.__view.schema.index;
    }

    clone() {
      const newCursor = new SchemaCursor(this.__view);
      return newCursor;
    }

    toJSON() {
      return this.__view.toJSON(this);
    }
  }

  return SchemaCursor;
}
