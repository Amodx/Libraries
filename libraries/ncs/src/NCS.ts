import { Graph } from "./Graphs/Graph";
import { CreateNodeData } from "./Nodes/Node.types";
import { NodeId } from "./Nodes/NodeId";

import { QueryData } from "./Queries/Query.types";
import { QueryPrototype } from "./Queries/QueryPrototype";

import { CreateComponentData } from "./Components/Component.types";
import { registerContext } from "./Register/registerContext";
import { registerComponent } from "./Register/registerComponent";
import { registerTag } from "./Register/registerTag";
import { registerSystem } from "./Register/registerSystem";
import { NCSPools } from "./Pools/NCSPools";
import { Schema } from "./Schema/Schema";
import {
  copyComponent,
  createRemoteComponent,
  serializeComponent,
  serializeComponentData,
} from "./Data/serializeComponent";
import { deserializeComponentData } from "./Data/deserializeComponent";
import {
  cloneNode,
  copyNode,
  createRemoteNode,
  serializeNode,
  serializeNodeData,
} from "./Data/serializeNode";
import { deserializeNodeData } from "./Data/deserializeNode";
import {
  ExtractSchemaClass,
  SchemaCreateData,
  SchemaProperty,
} from "./Schema/Schema.types";
import { PropertyData } from "Schema/Property/Property.types";
function traverseCreateSchema(
  obj: Record<string, SchemaProperty<any>>,
  parent: PropertyData
): PropertyData {
  parent.children ??= [];

  for (const key in obj) {
    const schemaProp = obj[key];
    // If this isn't a SchemaProperty, either skip or handle differently
    if (!(schemaProp instanceof SchemaProperty)) {
      continue;
    }

    // If the SchemaProperty's value is itself an object, we treat it as a parent
    if (
      schemaProp.value !== null &&
      typeof schemaProp.value === "object" &&
      !Array.isArray(schemaProp.value)
    ) {
      // Make a new "parent" property data
      const newParent: PropertyData = {
        id: key,
        meta: schemaProp.meta,
        value: schemaProp.value,
      };
      parent.children.push(newParent);

      // Recurse into the object’s own keys (which themselves may be SchemaProperties)
      traverseCreateSchema(
        schemaProp.value as Record<string, SchemaProperty<any>>,
        newParent
      );
    } else {
      // Otherwise it's a leaf (number, boolean, string, etc.)
      parent.children.push({
        id: key,
        meta: schemaProp.meta,
        value: schemaProp.value,
      });
    }
  }

  return parent;
}
export const NCS = {
  /** Create a graph. */
  createGraph() {
    return new Graph();
  },
  /** Create node data to add a node to a graph. */
  createNode(
    id?: true | null,
    name?: string | null,
    tags?: number[] | null,
    components?: CreateComponentData[],
    children: CreateNodeData[] = []
  ): CreateNodeData {
    const data: CreateNodeData = NCSPools.createNodeData.get() || ([] as any);
    data[0] = id ? NodeId.Create() : null;
    data[1] = name || "New Node";
    data[2] = components || null;
    data[3] = tags || null;
    data[4] = children || null;
    return data;
  },
  /** Create a schema from an object. */
  schemaFromObject<T extends Record<string, any>>(data: T) {
    return Schema.FromObject<T>(data);
  },
  /** Create a schema for a component or context. */
  schema<T extends Record<string, SchemaProperty<any>>>(
    schema: T,
    views?: SchemaCreateData[]
  ): Schema<ExtractSchemaClass<T>> {
    const data = traverseCreateSchema(schema, {
      id: "root",
      value: {},
      children: [],
    }).children!;

    const s = new Schema(data);
    if (views) {
      for (const view of views) {
        s.createView(view);
      }
    }


    return s as any;
  },
  /** Create a property for a schema. */
  property<T>(
    value: T,
    meta: SchemaProperty<T>["meta"] = {}
  ): SchemaProperty<T> {
    return new SchemaProperty<T>(value, meta);
  },
  /** Cast and set the type for the Data and Shared properties of a component. */
  data<T>(data: any = {}): T {
    return data;
  },
  /** Create a query to work with nodes based on specific components and tags. */
  createQuery(data: QueryData) {
    return new QueryPrototype(data);
  },
  /** Register a system for use with NCS. */
  registerSystem,
  /** Register a component for use with NCS. */
  registerComponent,
  /** Register a context for use with NCS. */
  registerContext,
  /** Register a tag for use with NCS. */
  registerTag,
  /** Serialize a component for storage. */
  serializeComponent,
  /** Serialize component data for storage. */
  serializeComponentData,
  /** Serialize a component to use in another context. */
  createRemoteComponent,
  /** Copy a component. */
  copyComponent,
  /** Deserialize a component from storage into component data. */
  deserializeComponentData,
  /** Serialize a node for storage. */
  serializeNode,
  /** Serialize node data for storage. */
  serializeNodeData,
  /** Copy a node as is. */
  copyNode,
  /** Copy a node and change IDs. */
  cloneNode,
  /** Serialize a node for use in another context. */
  createRemoteNode,
  /** Deserialize a node from storage into node data. */
  deserializeNodeData,
};
