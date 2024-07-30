import { Schema } from "@amodx/schemas";
import { ComponentInstance } from "../Components/ComponentInstance";
import { NCS } from "../NCS";
import {
  TraitData,
  TraitRegisterData,
  TraitStateData,
} from "../Traits/TraitData";
import { TraitInstance } from "../Traits/TraitInstance";
import { NCSRegister } from "../Register/NCSRegister";

type RegisteredTrait<
  TraitSchema extends object = {},
  Data extends object = {},
  Logic extends object = {},
  Shared extends object = {}
> = (TraitRegisterData<TraitSchema, Data, Logic, Shared> & {
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
  ) => TraitData<TraitSchema>);




export function registerTrait<
  TraitSchema extends object = {},
  Data extends object = {},
  Logic extends object = {},
  Shared extends object = {}
>(data: TraitRegisterData<TraitSchema, Data, Logic, Shared>): RegisteredTrait {
  NCSRegister._traits.set(data.type, data as any);

  const baseComponentSchema =
    Array.isArray(data.schema) && data.schema.length
      ? Schema.Create(...data.schema).createData()
      : {};

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
        ...structuredClone(baseComponentSchema),
        ...(schema || ({} as any)),
      },
    });
  };

  return Object.assign(createTrait, data, {
    set: (
      parent: ComponentInstance | TraitInstance,
      schema?: Partial<TraitSchema> | null,
      state?: TraitStateData | null,
      ...traits: TraitData[]
    ) => {
      return parent.traits.addTraits(
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
      return parent.traits.get(data.type);
    },
    getAll: (parent: ComponentInstance | TraitInstance) => {
      return parent.traits.getAll(data.type);
    },
    removeAll: (parent: ComponentInstance | TraitInstance) => {
      return parent.traits.removeAll(data.type);
    },
    reove: (parent: ComponentInstance | TraitInstance) => {
      return parent.traits.remove(data.type);
    },
  }) as any;
}
