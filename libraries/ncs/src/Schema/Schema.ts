import { createSchemaObjectCursorClass } from "./Functions/createSchemaObjectCursorClass";
import { createSchemaIndex } from "./Functions/createSchemaIndex";
import { Property } from "./Property/Property";
import {
  BinaryPropertyTypes,
  BinaryPropertyTypeSizeMap,
  PropertyData,
  PropertyMetaData,
} from "./Property/Property.types";
import {
  SchemaData,
  SchemaCursorIndex,
  SchemaCreateData,
  SchemaCursor,
} from "./Schema.types";
import { createSchemaTypedArrayCursorClass } from "./Functions/createSchemaTypedArrayCursorClass";
import { createSchemaBinaryObjectCursorClass } from "./Functions/createSchemaBinaryObjectCursorClass";
import { SchemaView } from "./SchemaView";
import { RecursivePartial } from "../Util/Util.types";
import { SchemaArray } from "./SchemaArray";
import { IdPalette } from "../Util/IdPalette";

const traverseCreate = (
  parent: Property,
  properties: PropertyData[],
  index: number
): number => {
  parent.children ??= [];
  for (let i = 0; i < properties.length; i++) {
    const data = properties[i];

    if (typeof data.value == "object" && !data.children) {
      data.children ??= [];
      for (const key in data.value) {
        const value = data.value[key];

        data.children!.push({
          id: key,
          meta: data.meta,
          value,
        });
      }
    }

    if (data.children) {
      const newChild = new Property(data, index + 1);
      parent.children!.push(newChild);

      index = traverseCreate(newChild, data.children, index);
      continue;
    } else {
      index++;
      parent.children!.push(new Property(data, index));
    }
  }

  return index;
};

const buildBinaryData = (meta: PropertyMetaData[]) => {
  let byteSize = 0;
  const byteOffsets: number[] = [];
  for (let i = 0; i < meta.length; i++) {
    const metaData = meta[i];
    if (!metaData || !metaData.binary) continue;
    byteOffsets[i] = byteSize;
    if (metaData.binary.type == "buffer") {
      byteSize += metaData.binary.byteSize;
    } else {
      byteSize += BinaryPropertyTypeSizeMap[metaData.binary.type];
    }
  }
  return { byteSize, byteOffsets };
};

const traverseArray = (
  parent: Property,
  data: any[],
  meta: PropertyMetaData[]
) => {
  for (let i = 0; i < parent.children!.length; i++) {
    const property = parent.children![i];
    if (!property.children) {
      data[property.index] = structuredClone(property.value);
      property.meta && (meta[property.index] = structuredClone(property.meta));
    } else {
      traverseArray(property, data, meta);
    }
  }
  return data;
};
type MetaOverrideData = PropertyMetaData[] | Record<number, PropertyMetaData>;
function buildMeta(
  data: any[],
  meta: PropertyMetaData[],
  metaOverrides: MetaOverrideData
) {
  let newMeta = [...meta];
  for (let i = 0; i < data.length; i++) {
    if (!metaOverrides[i]) continue;
    newMeta[i] = metaOverrides[i];
  }
  return newMeta;
}

function traverseCreateFromObject(object: any, property: PropertyData) {
  for (const id in object) {
    const value = object[id];
    if (typeof value == "object") {
      property.children!.push(
        traverseCreateFromObject(value, {
          id,
          value: {},
          children: [],
        })
      );
    } else {
      property.children!.push({
        id,
        value,
      });
    }
  }
  return property;
}
function traverseCreateData(property: Property, target: any, source: any) {
  for (const child of property.children!) {
    if (child.children) {
      if (!source[property.id]) continue;
      target[property.id] ??= {};
      traverseCreateData(child, target[property.id], source[property.id]);
    } else {
      if (typeof source[property.id] == "undefined") continue;
      target[property.id] = source[property.id];
    }
  }
  return property;
}

export class Schema<Shape extends Record<string, any> = {}> {
  static FromObject<Shape extends Record<string, any>>(shape: Shape) {
    const data: PropertyData[] = [];
    for (const id in shape) {
      const value = shape[id];
      if (typeof value == "object") {
        data.push(
          traverseCreateFromObject(value, {
            id,
            value: {},
            children: [],
          })
        );
      } else {
        data.push({
          id,
          value,
        });
      }
    }
    return new Schema<Shape>(data);
  }
  readonly root = new Property(
    {
      id: "__root__",
      meta: {},
      value: {},
    },
    -1
  );
  private _objectCursorClass: any;
  private _typedArrayCursorClass: any;
  private _binaryObjectCursorClass: any;
  readonly index: SchemaCursorIndex<Shape>;
  public readonly _data: any[] = [];
  public readonly _meta: PropertyMetaData[] = [];

  viewIdPalettew = new IdPalette();
  views: SchemaView[] = [];
  private defaultCursor: SchemaCursor<Shape>;
  private defaultInstance: any;

  array: SchemaArray;

  constructor(data: SchemaData) {
    traverseCreate(this.root, data, -1);
    this.index = createSchemaIndex(this);
    traverseArray(this.root, this._data, this._meta);
    const view = this.createObjectView("default");
    this.defaultCursor = view.createCursor();
    this.defaultInstance = view.createData();
    this.defaultInstance[0] = this._data;
    this.array = new SchemaArray(this);
  }

  createData(newData: any[] = [], overrides: RecursivePartial<Shape>) {
    for (let i = 0; i < this._data.length; i++) {
      newData[i] =
        typeof this._data[i] == "object"
          ? structuredClone(this._data[i])
          : this._data[i];
    }
    this.defaultInstance[0] = newData;
    this.defaultCursor.setInstance(this.defaultInstance);
    traverseCreateData(this.root, this.defaultCursor, overrides);
    return newData;
  }

  getView(id: string) {
    if (!this.viewIdPalettew.isRegistered(id)) return null;
    return this.views[this.viewIdPalettew.getNumberId(id)];
  }

  createObjectView(
    id: string,
    metaOverrides: MetaOverrideData | null = null
  ): SchemaView<Shape> {
    if (!this._objectCursorClass)
      this._objectCursorClass = createSchemaObjectCursorClass(this);
    let meta = this._meta;
    if (metaOverrides) meta = buildMeta(this._data, meta, metaOverrides);
    const createData: SchemaCreateData = {
      type: "object",
    };
    const view = new SchemaView(
      this,
      id,
      meta,
      [],
      createData,
      this._objectCursorClass
    );
    const viewIndex = this.viewIdPalettew.register(id);
    this.views[viewIndex] = view;

    return view;
  }

  createBinaryObjectView(
    id: string,
    sharedMemory: boolean = false,
    metaOverrides: MetaOverrideData | null = null
  ): SchemaView<Shape> {
    if (!this._binaryObjectCursorClass)
      this._binaryObjectCursorClass = createSchemaBinaryObjectCursorClass(this);
    let meta = this._meta;
    if (metaOverrides) meta = buildMeta(this._data, meta, metaOverrides);
    const { byteSize, byteOffsets } = buildBinaryData(meta);
    const createData: SchemaCreateData = {
      type: "binary-object",
      byteSize,
      sharedMemory,
    };
    const view = new SchemaView(
      this,
      id,
      meta,
      byteOffsets,
      createData,
      this._binaryObjectCursorClass
    );

    const viewIndex = this.viewIdPalettew.register(id);
    this.views[viewIndex] = view;

    return view;
  }

  createTypedArrayView(
    id: string,
    arrayType: BinaryPropertyTypes,
    sharedMemory: boolean = false,
    metaOverrides: MetaOverrideData | null = null
  ): SchemaView<Shape> {
    if (!this._typedArrayCursorClass)
      this._typedArrayCursorClass = createSchemaTypedArrayCursorClass(this);
    let meta = this._meta;
    if (metaOverrides) meta = buildMeta(this._data, meta, metaOverrides);
    const createData: SchemaCreateData = {
      type: "typed-array",
      arrayType,
      sharedMemory,
    };
    const view = new SchemaView(
      this,
      id,
      meta,
      [],
      createData,
      this._typedArrayCursorClass
    );
    const viewIndex = this.viewIdPalettew.register(id);
    this.views[viewIndex] = view;
    return view;
  }
}
