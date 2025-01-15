import {
  SerializedComponentData,
  ComponentRegisterData,
  CreateComponentData,
} from "../Components/Component.types";
import { Graph } from "../Graphs/Graph";

import { SerializedNodeData } from "../Nodes/Node.types";
import { NCSRegister } from "./NCSRegister";
import { ComponentCursor } from "../Components/ComponentCursor";
import { SchemaCursor } from "../Schema/Schema.types";
import { NodeCursor } from "../Nodes/NodeCursor";
import { NCSPools } from "../Pools/NCSPools";
import { Nullable } from "Util/Util.types";

type RegisteredComponent<
  ComponentSchema extends object = {},
  Data extends object = {},
  Logic extends object = {},
  Shared extends object = {},
> = (ComponentRegisterData<ComponentSchema, Data, Logic, Shared> & {
  getNodes(grpah: Graph): any;
  getComponents(grpah: Graph): Generator<ComponentCursor>;
  set(
    node: NodeCursor,
    componentSchema?: Nullable<Partial<ComponentSchema>>,
    schemaCursor?: Nullable<SchemaCursor<ComponentSchema>>,
    cursor?: ComponentCursor<ComponentCursor, Data, Logic, Shared>
  ): ComponentCursor<ComponentSchema, Data, Logic, Shared>;
  get(
    node: NodeCursor,
    cursor?: ComponentCursor<ComponentCursor, Data, Logic, Shared>
  ): ComponentCursor<ComponentSchema, Data, Logic, Shared> | null;
  getRequired(
    node: NodeCursor,
    cursor?: ComponentCursor<ComponentCursor, Data, Logic, Shared>
  ): ComponentCursor<ComponentSchema, Data, Logic, Shared>;
  getChild(
    node: NodeCursor,
    cursor?: ComponentCursor<ComponentCursor, Data, Logic, Shared>
  ): ComponentCursor<ComponentSchema, Data, Logic, Shared> | null;
  getRequiredChild(
    node: NodeCursor,
    cursor?: ComponentCursor<ComponentCursor, Data, Logic, Shared>
  ): ComponentCursor<ComponentSchema, Data, Logic, Shared>;
  getParent(
    node: NodeCursor,
    cursor?: ComponentCursor<ComponentCursor, Data, Logic, Shared>
  ): ComponentCursor<ComponentSchema, Data, Logic, Shared> | null;
  getRequiredParent(
    node: NodeCursor,
    cursor?: ComponentCursor<ComponentCursor, Data, Logic, Shared>
  ): ComponentCursor<ComponentSchema, Data, Logic, Shared>;
  getAll(
    node: NodeCursor
  ): ComponentCursor<ComponentSchema, Data, Logic, Shared>[] | null;
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

  data: ComponentRegisterData<ComponentSchema, Data, Logic, Shared>;
  default: ComponentCursor<ComponentSchema, Data, Logic, Shared>;
}) &
  ((
    schema?: Partial<ComponentSchema> | null | undefined,
    schemaView?: string | null
  ) => CreateComponentData<ComponentSchema>);

export const registerComponent = <
  ComponentSchema extends object = {},
  Data extends object = {},
  Logic extends object = {},
  Shared extends object = {},
>(
  data: ComponentRegisterData<ComponentSchema, Data, Logic, Shared>
): RegisteredComponent<ComponentSchema, Data, Logic, Shared> => {
  const typeId = NCSRegister.components.register(data.type, data);

  const createComponent = (
    schema?: Partial<ComponentSchema> | null | undefined,
    schemaView?: string | null
  ): CreateComponentData<ComponentSchema> => {
    const createData: CreateComponentData<ComponentSchema> =
      NCSPools.createComponentData.get() || ([] as any);
    createData[0] = typeId;
    createData[1] = schema || {};
    createData[2] = schemaView || "default";

    return createData;
  };

  return Object.assign(createComponent, data, {
    data,
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
    get(node: NodeCursor, cursor?: ComponentCursor) {
      return node.components.get(data.type, cursor);
    },
    getRequired(node: NodeCursor, cursor?: ComponentCursor) {
      const found = node.components.get(data.type, cursor);
      if (!found)
        throw new Error(
          `Could not find required component ${data.type} on node instance.`
        );
      return found;
    },
    getChild(node: NodeCursor, cursor?: ComponentCursor) {
      return node.components.getChild(data.type, cursor);
    },
    getRequiredChild(node: NodeCursor, cursor?: ComponentCursor) {
      const comp = node.components.getChild(data.type, cursor);
      if (!comp)
        throw new Error(
          `Node does not have required child with component ${data.type}.`
        );
      return comp;
    },
    getParent(node: NodeCursor, cursor?: ComponentCursor) {
      return node.components.getParent(data.type, cursor);
    },
    getRequiredParent(node: NodeCursor, cursor = ComponentCursor.Get()) {
      const comp = node.components.getParent(data.type, cursor);
      if (!comp)
        throw new Error(
          `Node does not have required parent with component ${data.type}.`
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
