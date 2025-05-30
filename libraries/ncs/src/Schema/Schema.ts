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
  SchemaMetaOverrideData,
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

    if (typeof data.value == "object" && !data.children?.length) {
      data.children ??= [];
      for (const key in data.value) {
        const value = data.value[key];
        const meta = structuredClone(data.meta || {});
        meta.child = true;
        data.children!.push({
          id: key,
          meta,
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
    if (typeof metaData.binary == "object") {
      byteSize += metaData.binary.byteSize;
      continue;
    }
    if (typeof metaData.binary == "string") {
      byteSize += BinaryPropertyTypeSizeMap[metaData.binary];
      continue;
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
      data[Number(property.index)] = structuredClone(property.value);
      property.meta && (meta[property.index] = structuredClone(property.meta));
    } else {
      traverseArray(property, data, meta);
    }
  }
  return data;
};

function buildMeta(
  data: any[],
  meta: PropertyMetaData[],
  metaOverrides: SchemaMetaOverrideData
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
function traverseCreateData(parent: Property, target: any[], source: any) {
  for (const property of parent.children!) {
    if (typeof source[property.id] === "undefined") continue;
    if (property.children) {
      traverseCreateData(property, target, source[property.id]);
    } else {
      target[property.index] = source[property.id];
    }
  }
  return target;
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
  public readonly shape: Shape;
  public readonly _data: any[] = [];
  public readonly _meta: PropertyMetaData[] = [];

  viewIdPalettew = new IdPalette();
  views: SchemaView[] = [];

  array: SchemaArray;

  constructor(data: SchemaData) {
    traverseCreate(this.root, data, -1);
    this.index = createSchemaIndex(this);
    traverseArray(this.root, this._data, this._meta);
    this.createObjectView("default");
    this.array = new SchemaArray(this);
  }

  createData(newData: any[] = [], overrides: RecursivePartial<Shape>) {
    for (let i = 0; i < this._data.length; i++) {
      newData[i] =
        typeof this._data[i] == "object"
          ? structuredClone(this._data[i])
          : this._data[i];
    }
    traverseCreateData(this.root, newData, overrides);
    return newData;
  }

  getView(id: string) {
    if (!this.viewIdPalettew.isRegistered(id)) return null;
    return this.views[this.viewIdPalettew.getNumberId(id)];
  }

  createView(data: SchemaCreateData) {
    let view: SchemaView | null = null;
    let meta = this._meta;
    if (data.meta) meta = buildMeta(this._data, meta, data.meta);
    if (data.type == "object") {
      if (!this._objectCursorClass)
        this._objectCursorClass = createSchemaObjectCursorClass(this);
      view = new SchemaView(
        this,
        data.id,
        meta,
        [],
        0,
        data,
        this._objectCursorClass
      );
    }
    if (data.type == "typed-array") {
      if (!this._typedArrayCursorClass)
        this._typedArrayCursorClass = createSchemaTypedArrayCursorClass(this);

      view = new SchemaView(
        this,
        data.id,
        meta,
        [],
        0,
        data,
        this._typedArrayCursorClass
      );
    }
    if (data.type == "binary-object") {
      if (!this._binaryObjectCursorClass)
        this._binaryObjectCursorClass =
          createSchemaBinaryObjectCursorClass(this);
      const { byteSize, byteOffsets } = buildBinaryData(meta);

      view = new SchemaView(
        this,
        data.id,
        meta,
        byteOffsets,
        byteSize,
        data,
        this._binaryObjectCursorClass
      );
    }
    if (!view) throw new Error(`Invalid data`);
    const viewIndex = this.viewIdPalettew.register(data.id);
    this.views[viewIndex] = view;
    return view;
  }

  createObjectView(
    id: string,
    meta: SchemaMetaOverrideData | null = null
  ): SchemaView<Shape> {
    return this.createView({
      id,
      type: "object",
      meta,
    });
  }

  createBinaryObjectView(
    id: string,
    sharedMemory: boolean = false,
    meta: SchemaMetaOverrideData | null = null
  ): SchemaView<Shape> {
    return this.createView({
      id,
      type: "binary-object",
      meta,
      sharedMemory: sharedMemory || undefined,
    });
  }

  createTypedArrayView(
    id: string,
    arrayType: BinaryPropertyTypes,
    sharedMemory: boolean = false,
    meta: SchemaMetaOverrideData | null = null
  ): SchemaView<Shape> {
    return this.createView({
      id,
      type: "typed-array",
      meta,
      arrayType,
      sharedMemory: sharedMemory || undefined,
    });
  }
}
