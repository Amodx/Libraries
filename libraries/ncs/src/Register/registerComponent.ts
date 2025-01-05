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
import { NCSRegister } from "./NCSRegister";
import { ComponentPrototype } from "../Components/ComponentPrototype";

type RegisteredComponent<
  ComponentSchema extends object = {},
  Data extends object = {},
  Logic extends object = {},
  Shared extends object = {},
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
  ) => ComponentInstance<ComponentSchema, Data, Logic, Shared>;
  get: (
    node: NodeInstance
  ) => ComponentInstance<ComponentSchema, Data, Logic, Shared> | null;
  getRequired: (
    node: NodeInstance
  ) => ComponentInstance<ComponentSchema, Data, Logic, Shared>;
  getChild: (
    node: NodeInstance
  ) => ComponentInstance<ComponentSchema, Data, Logic, Shared> | null;
  getRequiredChild: (
    node: NodeInstance
  ) => ComponentInstance<ComponentSchema, Data, Logic, Shared>;
  getParent: (
    node: NodeInstance
  ) => ComponentInstance<ComponentSchema, Data, Logic, Shared> | null;
  getRequiredParent: (
    node: NodeInstance
  ) => ComponentInstance<ComponentSchema, Data, Logic, Shared>;
  getAll: (
    node: NodeInstance
  ) => ComponentInstance<ComponentSchema, Data, Logic, Shared>[] | null;
  remove: (
    node: NodeInstance
  ) => ComponentInstance<ComponentSchema, Data, Logic, Shared> | null;
  removeAll: (
    node: NodeInstance
  ) => ComponentInstance<ComponentSchema, Data, Logic, Shared>[] | null;

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

  prototype: ComponentPrototype<ComponentSchema, Data, Logic, Shared>;
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
  Shared extends object = {},
>(
  data: ComponentRegisterData<ComponentSchema, Data, Logic, Shared>
): RegisteredComponent<ComponentSchema, Data, Logic, Shared> => {
  const prototype = new ComponentPrototype<
    ComponentSchema,
    Data,
    Logic,
    Shared
  >(data);
  NCSRegister.components.register(
    data.type,
    data.namespace || "main",
    prototype
  );

  const componentMap = ComponentInstanceMap.registerComponent(data.type);

  const createComponent = (
    schema?: Partial<ComponentSchema> | null | undefined,
    state?: Partial<ComponentStateData> | null | undefined,
    ...traits: TraitData[]
  ): ComponentData<ComponentSchema> => {
    return NCS.Pipelines.OnComponentDataCreate.pipe({
      type: data.type,
      state: state || {},
      traits: traits || [],
      namespace: data.namespace || "main",
      schema: {
        ...structuredClone(prototype.baseContextSchema),
        ...(schema || ({} as any)),
      },
    });
  };

  return Object.assign(createComponent, data, {
    prototype,
    getNodes: (graph: Graph) => componentMap.getNodes(graph),
    getComponents: (graph: Graph) => componentMap.getItems(graph),
    set: (
      node: NodeInstance,
      schema?: Partial<ComponentSchema> | null,
      state?: ComponentStateData | null,
      ...traits: TraitData[]
    ) => {
      const newComponent = node.components.add(
        createComponent(
          schema
            ? schema
            : data.schema
              ? structuredClone(prototype.baseContextSchema)
              : ({} as any),
          state,
          ...traits
        )
      );
      newComponent.init();
      return newComponent;
    },
    get: (node: NodeInstance) => node.components.get(data.type),
    getRequired: (node: NodeInstance) => {
      const found = node.components.get(data.type);
      if (!found)
        throw new Error(
          `Could not find required component ${data.type} on node instance.`
        );
      return found;
    },
    getChild: (node: NodeInstance) => node.components.getChild(data.type),
    getRequiredChild: (node: NodeInstance) => {
      const comp = node.components.getChild(data.type);
      if (!comp)
        throw new Error(
          `Node does not have required child with component ${data.type}.`
        );
      return comp;
    },
    getParent: (node: NodeInstance) => node.components.getParent(data.type),
    getRequiredParent: (node: NodeInstance) => {
      const comp = node.components.getParent(data.type);
      if (!comp)
        throw new Error(
          `Node does not have required parent with component ${data.type}.`
        );
      return comp;
    },
    getAll: (node: NodeInstance) => node.components.getAll(data.type),
    removeAll: (node: NodeInstance) => node.components.removeAll(data.type),
    remove: (node: NodeInstance) => node.components.remove(data.type),
    nodeData: {
      get: (node: NodeData) =>
        node.components?.find((_) => _.type == data.type) || null,
      getAll: (node: NodeData) =>
        node.components?.filter((_) => _.type == data.type),
      remove: (node: NodeData) =>
        node.components?.splice(
          node.components?.findIndex((_) => _.type == data.type)
        )[0] || null,
      removeAll(node: NodeData) {
        const all = this.getAll(node);
        node.components = node.components?.filter((_) => _.type != data.type);
        return all?.length ? all : null;
      },
      set: (
        node: NodeData,
        schema?: Partial<ComponentSchema> | null,
        state?: ComponentStateData | null,
        ...traits: TraitData[]
      ) => {
        node.components ??= [];
        node.components.push(
          createComponent(
            schema
              ? schema
              : data.schema
                ? structuredClone(prototype.baseContextSchema)
                : ({} as any),
            state,

            ...traits
          )
        );
      },
    },
  }) as any;
};
