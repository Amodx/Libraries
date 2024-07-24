import { Pipeline } from "@amodx/core/Pipelines";
import {
  ComponentData,
  ComponentRegisterData,
  ComponentStateData,
} from "./Components/ComponentData";
import {
  TraitData,
  TraitRegisterData,
  TraitStateData,
} from "./Traits/TraitData";
import { Schema } from "@amodx/schemas";
import { ComponentInstance } from "./Components/ComponentInstance";
import { NodeInstance } from "./Nodes/NodeInstance";
import { NodeData, NodeStateData } from "./Nodes/NodeData";
import { TraitInstance } from "./Traits/TraitInstance";
import { NodeId } from "./Nodes/NodeId";
import { Graph, GraphDependencies } from "./Graph/Graph";
import { ComponentInstanceMap } from "./Components/ComponentInstanceMap";

export class NCS {
  static Pipelines = {
    OnComponentDataCreate: new Pipeline<ComponentData>(),
    OnTraitDataCreate: new Pipeline<TraitData>(),
    OnNodeDataCreate: new Pipeline<NodeData>(),
  };
  private static _components = new Map<string, ComponentRegisterData>();
  private static _traits = new Map<string, TraitRegisterData>();

  static createGraph(dependencies: GraphDependencies) {
    return new Graph(dependencies);
  }

  static createNode(
    name?: string | null,
    state?: NodeStateData | null,
    components: ComponentData[] = [],
    children: NodeData[] = []
  ): NodeData {
    return NCS.Pipelines.OnNodeDataCreate.pipe({
      id: NodeId.Create().idString,
      components,
      children,
      name: name ? name : "",
      state: state ? state : {},
    });
  }

  static getComponent(type: string) {
    const component = this._components.get(type);
    if (!component)
      throw new Error(`Component with type [ ${type} ] is not registered.`);
    return component;
  }

  static registerComponent<
    ComponentSchema extends object = {},
    Data extends object = {},
    Logic extends object = {},
    Shared extends object = {}
  >(
    data: ComponentRegisterData<ComponentSchema, Data, Logic, Shared>
  ): (ComponentRegisterData<ComponentSchema, Data, Logic, Shared> & {
    getNodes: (grpah: Graph) => Set<NodeInstance>;
    getComponents: (grpah: Graph) => Set<ComponentInstance<ComponentSchema, Data, Logic, Shared> >;
    set: (
      node: NodeInstance,
      componentSchema?: Partial<ComponentSchema>,
      traits?: TraitData[],
      state?: ComponentStateData
    ) => Promise<void>;
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
    ) => Promise<ComponentInstance<
      ComponentSchema,
      Data,
      Logic,
      Shared
    > | null>;
    removeAll: (
      node: NodeInstance
    ) => Promise<
      ComponentInstance<ComponentSchema, Data, Logic, Shared>[] | null
    >;
    default: ComponentInstance<ComponentSchema, Data, Logic, Shared>;
  }) &
    ((
      schema?: Partial<ComponentSchema> | null | undefined,
      state?: Partial<ComponentStateData> | null | undefined,
      ...traits: TraitData[]
    ) => ComponentData<ComponentSchema>) {
    if (this._components.has(data.type))
      throw new Error(`Component already registered: ${data.type}`);
    this._components.set(data.type, data as any);

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
      ) => {
        return node.addComponents(
          createComponent(
            schema
              ? schema
              : data.schema
              ? structuredClone(baseComponentSchema)
              : ({} as any),
            state,

            ...traits
          )
        );
      },
      getNodes: (graph: Graph) => {
        return componentMap.getNodes(graph);
      },
      getComponents: (graph: Graph) => {
        return componentMap.getComponents(graph);
      },
      get: (node: NodeInstance) => {
        return node.getCompnent(data.type);
      },
      getChild: (node: NodeInstance) => {
        return node.getChildWithComponent(data.type);
      },
      getParent: (node: NodeInstance) => {
        return node.getParentWithComponent(data.type);
      },
      getAll: (node: NodeInstance) => {
        return node.getAllComponentsOfType(data.type);
      },
      removeAll: (node: NodeInstance) => {
        return node.removeAllComponentsOfType(data.type);
      },
      remove: (node: NodeInstance) => {
        return node.removeComponent(data.type);
      },
    }) as any;
  }

  static getTrait(type: string) {
    const trait = this._traits.get(type);
    if (!trait)
      throw new Error(`Trait with type [ ${type} ] is not registered.`);
    return trait;
  }

  static registerTrait<
    TraitSchema extends object = {},
    Data extends object = {},
    Logic extends object = {},
    Shared extends object = {}
  >(
    data: TraitRegisterData<TraitSchema, Data, Logic, Shared>
  ): (TraitRegisterData<TraitSchema, Data, Logic, Shared> & {
    set: (
      parent: ComponentInstance | TraitInstance,
      ComponentSchema?: Partial<TraitSchema>,
      traits?: TraitData[],
      state?: TraitStateData
    ) => Promise<void>;
    get: (
      parent: ComponentInstance | TraitInstance
    ) => TraitInstance<TraitSchema, Data, Logic, Shared> | null;
    getAll: (
      parent: ComponentInstance | TraitInstance
    ) => TraitInstance<TraitSchema, Data, Logic, Shared>[] | null;
    remove: (
      parent: ComponentInstance | TraitInstance
    ) => Promise<TraitInstance<TraitSchema, Data, Logic, Shared> | null>;
    removeAll: (
      parent: ComponentInstance | TraitInstance
    ) => Promise<TraitInstance<TraitSchema, Data, Logic, Shared>[] | null>;
    default: TraitInstance<TraitSchema, Data, Logic, Shared>;
  }) &
    ((
      schema?: Partial<TraitSchema> | null | undefined,
      state?: TraitStateData | null | undefined,
      ...traits: TraitData[]
    ) => TraitData<TraitSchema>) {
    this._traits.set(data.type, data as any);

    const baseComponentSchema =
      Array.isArray(data.schema) && data.schema.length
        ? Schema.Create(...data.schema).createData()
        : {};

    const createTrait = (
      schema?: Partial<TraitSchema> | null | undefined,
      state?: ComponentStateData | null | undefined,
      ...traits: TraitData[]
    ): TraitData<TraitSchema> => {
      return NCS.Pipelines.OnTraitDataCreate.pipe({
        type: data.type,
        state: state || {},
        traits: traits || [],
        schema: {
          ...structuredClone(baseComponentSchema),
          ...(schema || ({} as any)),
        },
      });
    };

    return Object.assign(createTrait, data, {
      set: (
        parent: ComponentInstance | TraitInstance,
        schema?: Partial<TraitSchema> | null,
        state?: ComponentStateData | null,
        ...traits: TraitData[]
      ) => {
        return parent.addTraits(
          createTrait(
            schema
              ? schema
              : data.schema
              ? structuredClone(baseComponentSchema)
              : ({} as any),
            state,
            ...traits
          )
        );
      },
      get: (parent: ComponentInstance | TraitInstance) => {
        return parent.getTrait(data.type);
      },
      getAll: (parent: ComponentInstance | TraitInstance) => {
        return parent.getAllTraitsOfType(data.type);
      },
      removeAll: (parent: ComponentInstance | TraitInstance) => {
        return parent.removeAllTraitsOfType(data.type);
      },
      reove: (parent: ComponentInstance | TraitInstance) => {
        return parent.removeTrait(data.type);
      },
    }) as any;
  }
}

export function Node(
  data: { name?: string; state?: NodeStateData },
  components?: ComponentData[],
  ...children: NodeData[]
): NodeData {
  return NCS.createNode(data.name, data.state, components, children);
}
