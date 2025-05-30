import {
  ComponentRegisterData,
  CreateComponentData,
} from "../Components/Component.types";
import { Graph } from "../Graphs/Graph";

import {
  SerializedNodeData,
  SerializedComponentData,
} from "../Data/SerializedData.types";
import { NCSRegister } from "./NCSRegister";
import { ComponentCursor } from "../Components/ComponentCursor";
import { SchemaCursor } from "../Schema/Schema.types";
import { NodeCursor } from "../Nodes/NodeCursor";
import { NCSPools } from "../Pools/NCSPools";
import { Nullable } from "Util/Util.types";

type RegisteredComponent<
  ComponentSchema extends object = any,
  Data extends any = any,
  Shared extends any = any,
> = (ComponentRegisterData<ComponentSchema, Data, Shared> & {
  getNodes(grpah: Graph): Generator<NodeCursor>;
  getComponents(
    grpah: Graph
  ): Generator<ComponentCursor<ComponentSchema, Data, Shared>>;
  set(
    node: NodeCursor,
    componentSchema?: Nullable<Partial<ComponentSchema>>,
    schemaCursor?: Nullable<SchemaCursor<ComponentSchema>>,
    cursor?: ComponentCursor<ComponentSchema, Data, Shared>
  ): ComponentCursor<ComponentSchema, Data, Shared>;
  has(node: NodeCursor): boolean;
  get(
    node: NodeCursor,
    cursor?: ComponentCursor<ComponentSchema, Data, Shared>,
    nodeCursor?: NodeCursor
  ): ComponentCursor<ComponentSchema, Data, Shared> | null;
  getRequired(
    node: NodeCursor,
    cursor?: ComponentCursor<ComponentSchema, Data, Shared>,
    nodeCursor?: NodeCursor
  ): ComponentCursor<ComponentSchema, Data, Shared>;
  getChild(
    node: NodeCursor,
    cursor?: ComponentCursor<ComponentSchema, Data, Shared>,
    nodeCursor?: NodeCursor
  ): ComponentCursor<ComponentSchema, Data, Shared> | null;
  getRequiredChild(
    node: NodeCursor,
    cursor?: ComponentCursor<ComponentSchema, Data, Shared>,
    nodeCursor?: NodeCursor
  ): ComponentCursor<ComponentSchema, Data, Shared>;
  getParent(
    node: NodeCursor,
    cursor?: ComponentCursor<ComponentSchema, Data, Shared>,
    nodeCursor?: NodeCursor
  ): ComponentCursor<ComponentSchema, Data, Shared> | null;
  getRequiredParent(
    node: NodeCursor,
    cursor?: ComponentCursor<ComponentSchema, Data, Shared>,
    nodeCursor?: NodeCursor
  ): ComponentCursor<ComponentSchema, Data, Shared>;
  getAll(
    node: NodeCursor
  ): ComponentCursor<ComponentSchema, Data, Shared>[] | null;
  remove(node: NodeCursor): boolean;
  removeAll(node: NodeCursor): boolean;
  nodeData: {
    get(
      node: SerializedNodeData
    ): SerializedComponentData<ComponentSchema> | null;
    set(
      node: SerializedNodeData,
      componentSchema?: Partial<ComponentSchema>
    ): void;
    getAll(
      node: SerializedNodeData
    ): SerializedComponentData<ComponentSchema>[] | null;
    remove(
      node: SerializedNodeData
    ): SerializedComponentData<ComponentSchema> | null;
    removeAll(
      node: SerializedNodeData
    ): SerializedComponentData<ComponentSchema>[] | null;
  };

  type: string;
  typeId: number;
  data: ComponentRegisterData<ComponentSchema, Data, Shared>;
  default: ComponentCursor<ComponentSchema, Data, Shared>;
}) &
  ((
    schema?: Partial<ComponentSchema> | null | undefined,
    schemaView?: string | null
  ) => CreateComponentData<ComponentSchema>);

export const registerComponent = <
  Data extends any = any,
  Shared extends any = any,
  ComponentSchema extends object = any,
>(
  data: ComponentRegisterData<ComponentSchema, Data, Shared>
): RegisteredComponent<ComponentSchema, Data, Shared> => {
  const typeId = NCSRegister.components.register(data.type, data);

  data.shared = data.shared || ({} as Shared);
  const createComponent = (
    schema?: Partial<ComponentSchema> | null | undefined,
    schemaView?: string | null
  ): CreateComponentData<ComponentSchema> => {
    const createData: CreateComponentData<ComponentSchema> =
      NCSPools.createComponentData.get() || ([] as any);
    createData[0] = data.type;
    createData[1] = schema || {};
    createData[2] = schemaView || "default";

    return createData;
  };

  return Object.assign(createComponent, data, {
    data,
    type: data.type,
    typeId,
    *getNodes(
      graph: Graph,
      nodeCursor = NodeCursor.Get()
    ): Generator<NodeCursor> {
      const array = graph._components[typeId];
      if (!array) return false;

      for (let i = 0; i < array._disposed.length; i++) {
        nodeCursor.setNode(graph, array._node[i]);
        yield nodeCursor;
      }
      NodeCursor.Retrun(nodeCursor);
      return true;
    },
    *getComponents(
      graph: Graph,
      cursor = ComponentCursor.Get(),
      nodeCursor = NodeCursor.Get()
    ): Generator<ComponentCursor> {
      const array = graph._components[typeId];
      if (!array) return false;

      for (let i = 0; i < array._disposed.length; i++) {
        nodeCursor.setNode(graph, array._node[i]);
        cursor.setInstance(nodeCursor, typeId, i);
        yield cursor;
      }
      ComponentCursor.Retrun(cursor);
      NodeCursor.Retrun(nodeCursor);
      return true;
    },
    set(
      node: NodeCursor,
      schema?: Partial<ComponentSchema> | null,
      schemaView?: string | null,
      cursor = ComponentCursor.Get()
    ) {
      const newComponent = node.components.add(
        createComponent(schema, schemaView)
      );
      cursor.setInstance(node, typeId, newComponent);
      node.graph._components[typeId].init(newComponent);
      return cursor;
    },
    has(node: NodeCursor) {
      return node.components.has(data.type);
    },
    get(node: NodeCursor, cursor?: ComponentCursor, nodeCursor?: NodeCursor) {
      return node.components.get(data.type, cursor, nodeCursor);
    },
    getRequired(
      node: NodeCursor,
      cursor?: ComponentCursor,
      nodeCursor?: NodeCursor
    ) {
      const found = node.components.get(data.type, cursor, nodeCursor);
      if (!found)
        throw new Error(
          `Node [${node.name}] does not have required component [${data.type}].`
        );
      return found;
    },
    getChild(
      node: NodeCursor,
      cursor?: ComponentCursor,
      nodeCursor?: NodeCursor
    ) {
      return node.components.getChild(data.type, cursor, nodeCursor);
    },
    getRequiredChild(
      node: NodeCursor,
      cursor?: ComponentCursor,
      nodeCursor?: NodeCursor
    ) {
      const comp = node.components.getChild(data.type, cursor, nodeCursor);
      if (!comp)
        throw new Error(
          `Node [${node.name}] does not have a child with required component [${data.type}].`
        );
      return comp;
    },
    getParent(
      node: NodeCursor,
      cursor?: ComponentCursor,
      nodeCursor?: NodeCursor
    ) {
      return node.components.getParent(data.type, cursor, nodeCursor);
    },
    getRequiredParent(
      node: NodeCursor,
      cursor?: ComponentCursor,
      nodeCursor?: NodeCursor
    ) {
      const comp = node.components.getParent(data.type, cursor, nodeCursor);
      if (!comp)
        throw new Error(
          `Node [${node.name}] does not have a parent with required component [${data.type}].`
        );
      return comp;
    },
    getAll(node: NodeCursor) {
      return node.components.getAll(data.type);
    },
    removeAll(node: NodeCursor) {
      return node.components.removeAll(data.type);
    },
    remove(node: NodeCursor) {
      return node.components.remove(data.type);
    },
    nodeData: {
      get: (node: SerializedNodeData) =>
        node.components?.find((_) => _.type == data.type) || null,
      getAll: (node: SerializedNodeData) =>
        node.components?.filter((_) => _.type == data.type),
      remove: (node: SerializedNodeData) =>
        node.components?.splice(
          node.components?.findIndex((_) => _.type == data.type)
        )[0] || null,
      removeAll(node: SerializedNodeData) {
        const all = this.getAll(node);
        node.components = node.components?.filter((_) => _.type != data.type);
        return all?.length ? all : null;
      },
      set: (
        node: SerializedNodeData,
        schema?: Partial<ComponentSchema> | null
      ) => {
        node.components ??= [];
        node.components.push({
          type: data.type,
          schema: {},
        });
      },
    },
  }) as any;
};
