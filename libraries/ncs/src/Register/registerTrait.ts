import { ComponentInstance } from "../Components/ComponentInstance";
import { NCS } from "../NCS";
import {
  TraitData,
  TraitRegisterData,
  TraitStateData,
} from "../Traits/TraitData";
import { TraitInstance } from "../Traits/TraitInstance";
import { NCSRegister } from "./NCSRegister";
import { TraitPrototype } from "../Traits/TraitPrototype";
import { TraitInstanceMap } from "../Traits/TraitInstanceMap";
import { Graph } from "../Graphs/Graph";
import { NodeInstance } from "../Nodes/NodeInstance";

type RegisteredTrait<
  TraitSchema extends object = {},
  Data extends object = {},
  Logic extends object = {},
  Shared extends object = {},
> = (TraitRegisterData<TraitSchema, Data, Logic, Shared> & {
  getNodes: (grpah: Graph) => Set<NodeInstance>;
  getTraits: (
    grpah: Graph
  ) => Set<TraitInstance<TraitSchema, Data, Logic, Shared>>;
  set: (
    parent:
      | ComponentInstance<any, any, any, any>
      | TraitInstance<any, any, any, any>,
    ComponentSchema?: Partial<TraitSchema>,
    traits?: TraitData[],
    state?: TraitStateData
  ) => TraitInstance<TraitSchema, Data, Logic, Shared>;
  get: (
    parent:
      | ComponentInstance<any, any, any, any>
      | TraitInstance<any, any, any, any>
  ) => TraitInstance<TraitSchema, Data, Logic, Shared> | null;
  getAll: (
    parent:
      | ComponentInstance<any, any, any, any>
      | TraitInstance<any, any, any, any>
  ) => TraitInstance<TraitSchema, Data, Logic, Shared>[] | null;
  remove: (
    parent:
      | ComponentInstance<any, any, any, any>
      | TraitInstance<any, any, any, any>
  ) => TraitInstance<TraitSchema, Data, Logic, Shared> | null;
  removeAll: (
    parent:
      | ComponentInstance<any, any, any, any>
      | TraitInstance<any, any, any, any>
  ) => TraitInstance<TraitSchema, Data, Logic, Shared>[] | null;
  prototype: TraitPrototype<TraitSchema, Data, Logic, Shared>;
  default: TraitInstance<TraitSchema, Data, Logic, Shared>;
}) &
  ((
    schema?: Partial<TraitSchema> | null | undefined,
    state?: TraitStateData | null | undefined,
    ...traits: TraitData[]
  ) => TraitData<TraitSchema>);

export function registerTrait<
  TraitSchema extends object = {},
  Data extends object = {},
  Logic extends object = {},
  Shared extends object = {},
>(
  data: TraitRegisterData<TraitSchema, Data, Logic, Shared>
): RegisteredTrait<TraitSchema, Data, Logic, Shared> {
  const prototype = new TraitPrototype<TraitSchema, Data, Logic, Shared>(data);
  NCSRegister.traits.register(data.type, data.namespace || "main", prototype);

  const createTrait = (
    schema?: Partial<TraitSchema> | null | undefined,
    state?: TraitStateData | null | undefined,
    ...traits: TraitData[]
  ): TraitData<TraitSchema> => {
    return NCS.Pipelines.OnTraitDataCreate.pipe({
      type: data.type,
      state: state || {},
      traits: traits || [],
      schema: {
        ...structuredClone(prototype.baseContextSchema),
        ...(schema || ({} as any)),
      },
    });
  };
  const traitMap = TraitInstanceMap.registerTrait(data.type);

  return Object.assign(createTrait, data, {
    prototype,
    getNodes: (graph: Graph) => traitMap.getNodes(graph),
    getTraits: (graph: Graph) => traitMap.getItems(graph),
    set: (
      parent: ComponentInstance | TraitInstance,
      schema?: Partial<TraitSchema> | null,
      state?: TraitStateData | null,
      ...traits: TraitData[]
    ) => {
      return parent.traits.add(
        createTrait(
          schema
            ? schema
            : data.schema
              ? structuredClone(prototype.baseContextSchema)
              : ({} as any),
          state,
          ...traits
        ),
        true
      );
    },
    get: (parent: ComponentInstance | TraitInstance) => {
      return parent.traits.get(data.type);
    },
    getAll: (parent: ComponentInstance | TraitInstance) => {
      return parent.traits.getAll(data.type);
    },
    removeAll: (parent: ComponentInstance | TraitInstance) => {
      return parent.traits.removeAll(data.type);
    },
    remove: (parent: ComponentInstance | TraitInstance) => {
      return parent.traits.remove(data.type);
    },
  }) as any;
}
