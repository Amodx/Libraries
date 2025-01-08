import {
  SerializedComponentData,
  ComponentRegisterData,
  ComponentStateData,
  CreateComponentData,
} from "../Components/Component.types";
import { Graph } from "../Graphs/Graph";

import { SerializedNodeData } from "../Nodes/Node.types";
import { NCSRegister } from "./NCSRegister";
import { ComponentCursor } from "../Components/ComponentCursor";
import { SchemaCursor } from "../Schema/Schema.types";
import { NodeCursor } from "../Nodes/NodeCursor";

type RegisteredComponent<
  ComponentSchema extends object = {},
  Data extends object = {},
  Logic extends object = {},
  Shared extends object = {},
> = (ComponentRegisterData<ComponentSchema, Data, Logic, Shared> & {
  getNodes: (grpah: Graph) => any;
  getComponents: (grpah: Graph) => Set<any>;
  set: (
    node: NodeCursor,
    componentSchema?: Partial<ComponentSchema>,
    schemaCursor?: SchemaCursor<ComponentSchema>,
    state?: ComponentStateData
  ) => ComponentCursor<ComponentSchema, Data, Logic, Shared>;
  get: (
    node: NodeCursor
  ) => ComponentCursor<ComponentSchema, Data, Logic, Shared> | null;
  getRequired: (
    node: NodeCursor
  ) => ComponentCursor<ComponentSchema, Data, Logic, Shared>;
  getChild: (
    node: NodeCursor
  ) => ComponentCursor<ComponentSchema, Data, Logic, Shared> | null;
  getRequiredChild: (
    node: NodeCursor
  ) => ComponentCursor<ComponentSchema, Data, Logic, Shared>;
  getParent: (
    node: NodeCursor
  ) => ComponentCursor<ComponentSchema, Data, Logic, Shared> | null;
  getRequiredParent: (
    node: NodeCursor
  ) => ComponentCursor<ComponentSchema, Data, Logic, Shared>;
  getAll: (
    node: NodeCursor
  ) => ComponentCursor<ComponentSchema, Data, Logic, Shared>[] | null;
  remove: (
    node: NodeCursor
  ) => ComponentCursor<ComponentSchema, Data, Logic, Shared> | null;
  removeAll: (
    node: NodeCursor
  ) => ComponentCursor<ComponentSchema, Data, Logic, Shared>[] | null;

  nodeData: {
    get: (
      node: SerializedNodeData
    ) => SerializedComponentData<ComponentSchema> | null;
    set: (
      node: SerializedNodeData,
      componentSchema?: Partial<ComponentSchema>,
      state?: ComponentStateData
    ) => void;
    getAll: (
      node: SerializedNodeData
    ) => SerializedComponentData<ComponentSchema>[] | null;
    remove: (
      node: SerializedNodeData
    ) => SerializedComponentData<ComponentSchema> | null;
    removeAll: (
      node: SerializedNodeData
    ) => SerializedComponentData<ComponentSchema>[] | null;
  };

  data: ComponentRegisterData<ComponentSchema, Data, Logic, Shared>;
  default: ComponentCursor<ComponentSchema, Data, Logic, Shared>;
}) &
  ((
    schema?: Partial<ComponentSchema> | null | undefined,
    state?: Partial<ComponentStateData> | null | undefined
  ) => SerializedComponentData<ComponentSchema>);

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
    state?: Partial<ComponentStateData> | null | undefined
  ): CreateComponentData<ComponentSchema> => {
    return [data.type, state || {}, schema || null, null];
  };

  return Object.assign(createComponent, data, {
    data,
    getNodes: (graph: Graph) => [],
    getComponents: (graph: Graph) => [],
    set: (
      node: NodeCursor,
      schema?: Partial<ComponentSchema> | null,
      state?: ComponentStateData | null
    ) => {
      const cursor = new ComponentCursor();
      const newComponent = node.components.add(createComponent(schema, state));
      cursor.setInstance(node, typeId, newComponent.index);
      cursor.init();
      return cursor;
    },
    get: (node: NodeCursor) => node.components.get(data.type),
    getRequired: (node: NodeCursor) => {
      const found = node.components.get(data.type);
      if (!found)
        throw new Error(
          `Could not find required component ${data.type} on node instance.`
        );
      return found;
    },
    getChild: (node: NodeCursor) => node.components.getChild(data.type),
    getRequiredChild: (node: NodeCursor) => {
      const comp = node.components.getChild(data.type);
      if (!comp)
        throw new Error(
          `Node does not have required child with component ${data.type}.`
        );
      return comp;
    },
    getParent: (node: NodeCursor) => node.components.getParent(data.type),
    getRequiredParent: (node: NodeCursor) => {
      const comp = node.components.getParent(data.type);
      if (!comp)
        throw new Error(
          `Node does not have required parent with component ${data.type}.`
        );
      return comp;
    },
    getAll: (node: NodeCursor) => node.components.getAll(data.type),
    removeAll: (node: NodeCursor) => node.components.removeAll(data.type),
    remove: (node: NodeCursor) => node.components.remove(data.type),
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
        schema?: Partial<ComponentSchema> | null,
        state?: ComponentStateData | null
      ) => {
        node.components ??= [];
        node.components.push({
          type: data.type,
          schema: {},
          state: state || {},
        });
      },
    },
  }) as any;
};
