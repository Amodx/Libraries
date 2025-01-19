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
const traverseCreateSchema = (object: any, parent: PropertyData) => {
  for (const key in object) {
    parent.children ??= [];
    const value = object[key];
    if (value instanceof SchemaProperty) {
      if (
        value.value instanceof SchemaProperty &&
        typeof value.value.value == "object"
      ) {
        const newParent = {
          id: key,
          meta: value.meta,
          value: value.value,
          children: [],
        };
        parent.children.push(newParent);
        traverseCreateSchema(value.value.value, newParent);
      } else {
        parent.children.push({
          id: key,
          meta: value.meta,
          value: value.value,
        });
      }
    }
  }
  return parent;
};

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
    const s = new Schema(
      traverseCreateSchema(schema, {
        id: "root",
        value: {},
        children: [],
      }).children!
    );
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
