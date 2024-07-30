import { Schema } from "@amodx/schemas";
import {
  ComponentData,
  ComponentRegisterData,
  ComponentStateData,
} from "../Components/ComponentData";
import { ComponentInstance } from "../Components/ComponentInstance";
import { ComponentInstanceMap } from "../Components/ComponentInstanceMap";
import { Graph } from "../Graphs/Graph";
import { NCS } from "../NCS";
import { NodeInstance } from "../Nodes/NodeInstance";
import { TraitData } from "../Traits/TraitData";
import { NodeData } from "../Nodes/NodeData";
import { NCSRegister } from "../Register/NCSRegister";

type RegisteredComponent<
  ComponentSchema extends object = {},
  Data extends object = {},
  Logic extends object = {},
  Shared extends object = {}
> = (ComponentRegisterData<ComponentSchema, Data, Logic, Shared> & {
  getNodes: (grpah: Graph) => Set<NodeInstance>;
  getComponents: (
    grpah: Graph
  ) => Set<ComponentInstance<ComponentSchema, Data, Logic, Shared>>;
  set: (
    node: NodeInstance,
    componentSchema?: Partial<ComponentSchema>,
    traits?: TraitData[],
    state?: ComponentStateData
  ) => Promise<ComponentInstance<ComponentSchema, Data, Logic, Shared>>;
  get: (
    node: NodeInstance
  ) => ComponentInstance<ComponentSchema, Data, Logic, Shared> | null;
  getChild: (
    node: NodeInstance
  ) => ComponentInstance<ComponentSchema, Data, Logic, Shared> | null;
  getParent: (
    node: NodeInstance
  ) => ComponentInstance<ComponentSchema, Data, Logic, Shared> | null;
  getAll: (
    node: NodeInstance
  ) => ComponentInstance<ComponentSchema, Data, Logic, Shared>[] | null;
  remove: (
    node: NodeInstance
  ) => Promise<ComponentInstance<ComponentSchema, Data, Logic, Shared> | null>;
  removeAll: (
    node: NodeInstance
  ) => Promise<
    ComponentInstance<ComponentSchema, Data, Logic, Shared>[] | null
  >;
  nodeData: {
    get: (node: NodeData) => ComponentData<ComponentSchema> | null;
    set: (
      node: NodeData,
      componentSchema?: Partial<ComponentSchema>,
      traits?: TraitData[],
      state?: ComponentStateData
    ) => void;
    getAll: (node: NodeData) => ComponentData<ComponentSchema>[] | null;
    remove: (node: NodeData) => ComponentData<ComponentSchema> | null;
    removeAll: (node: NodeData) => ComponentData<ComponentSchema>[] | null;
  };

  default: ComponentInstance<ComponentSchema, Data, Logic, Shared>;
}) &
  ((
    schema?: Partial<ComponentSchema> | null | undefined,
    state?: Partial<ComponentStateData> | null | undefined,
    ...traits: TraitData[]
  ) => ComponentData<ComponentSchema>);

export const registerComponent = <
  ComponentSchema extends object = {},
  Data extends object = {},
  Logic extends object = {},
  Shared extends object = {}
>(
  data: ComponentRegisterData<ComponentSchema, Data, Logic, Shared>
): RegisteredComponent<ComponentSchema, Data, Logic, Shared> => {
  if (NCSRegister._components.has(data.type))
    throw new Error(`Component already registered: ${data.type}`);
  NCSRegister._components.set(data.type, data as any);

  const componentMap = ComponentInstanceMap.registerComponent(data.type);

  const baseComponentSchema =
    Array.isArray(data.schema) && data.schema.length
      ? Schema.Create(...data.schema).createData()
      : {};

  const createComponent = (
    schema?: Partial<ComponentSchema> | null | undefined,
    state?: Partial<ComponentStateData> | null | undefined,
    ...traits: TraitData[]
  ): ComponentData<ComponentSchema> => {
    return NCS.Pipelines.OnComponentDataCreate.pipe({
      type: data.type,
      state: state || {},
      traits: traits || [],
      schema: {
        ...structuredClone(baseComponentSchema),
        ...(schema || ({} as any)),
      },
    });
  };

  return Object.assign(createComponent, data, {
    set: (
      node: NodeInstance,
      schema?: Partial<ComponentSchema> | null,
      state?: ComponentStateData | null,
      ...traits: TraitData[]
    ) =>
      node.components.add(
        createComponent(
          schema
            ? schema
            : data.schema
            ? structuredClone(baseComponentSchema)
            : ({} as any),
          state,
          ...traits
        )
      ),
    getNodes: (graph: Graph) => componentMap.getNodes(graph),
    getComponents: (graph: Graph) => componentMap.getComponents(graph),
    get: (node: NodeInstance) => node.components.get(data.type),
    getChild: (node: NodeInstance) => node.components.getChild(data.type),
    getParent: (node: NodeInstance) => node.components.getParent(data.type),
    getAll: (node: NodeInstance) => node.components.getAll(data.type),
    removeAll: (node: NodeInstance) => node.components.removeAll(data.type),
    remove: (node: NodeInstance) => node.components.remove(data.type),
    nodeData: {
      get: (node: NodeData) =>
        node.components.find((_) => _.type == data.type) || null,
      getAll: (node: NodeData) =>
        node.components.filter((_) => _.type == data.type),
      remove: (node: NodeData) =>
        node.components.splice(
          node.components.findIndex((_) => _.type == data.type)
        )[0] || null,
      removeAll(node: NodeData) {
        const all = this.getAll(node);
        node.components = node.components.filter((_) => _.type != data.type);
        return all.length ? all : null;
      },
      set: (
        node: NodeData,
        schema?: Partial<ComponentSchema> | null,
        state?: ComponentStateData | null,
        ...traits: TraitData[]
      ) =>
        node.components.push(
          createComponent(
            schema
              ? schema
              : data.schema
              ? structuredClone(baseComponentSchema)
              : ({} as any),
            state,

            ...traits
          )
        ),
    },
  }) as any;
};
