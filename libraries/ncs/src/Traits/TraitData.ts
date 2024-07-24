import { Property } from "@amodx/schemas";
import { TraitInstance } from "./TraitInstance";

/**
 * Interface representing the meta data of a trait.
 */
export interface TraitMetaData {
  name: string;
  [key: string]: any;
}

/**
 * Interface representing the state data of a trait.
 */
export interface TraitStateData {
  [key: string]: any;
}

/**
 * Type representing the data of a trait.
 *
 * @template TraitSchema - The TraitSchema of the trait.
 */
export type TraitData<TraitSchema extends object = any> = {
  /**
   * The type of the trait.
   */
  type: string;

  /**
   * The state data of the trait.
   */
  state: TraitStateData;

  /**
   * The TraitSchema of the trait.
   */
  schema: TraitSchema;

  /**
   * The traits associated with the trait.
   */
  traits: TraitData[];
};

/**
 * Type representing the data required to register a trait.
 *
 * Used for serlization and creation.
 * @template TraitSchema - The schema of the trait.
 * @template Data - The runtime data of the trait.
 * @template Logic - The logic functions of the trait.
 * @template Shared - The shared data of all traits of this type.
 */
export type TraitRegisterData<
  TraitSchema extends object = {},
  Data extends Record<string, any> = {},
  Logic extends Record<string, any> = {},
  Shared extends Record<string, any> = {}
> = {
  /**
   * The type of the trait.
   */
  type: string;

  /**
   * The optional name of the trait.
   */
  name?: string;

  /**
   * The schema used to create an editable version of the trait.
   * For the actual TraitInstance the schema is created into an object.
   */
  schema?: Property<any, any>[];

  /**
   * The logic functions of the trait.
   */
  logic?:
    | Logic
    | ((component: TraitInstance<TraitSchema, Data, Logic, Shared>) => Logic);

  /**
   * The runtime data of the trait.
   */
  data?:
    | Data
    | ((component: TraitInstance<TraitSchema, Data, Logic, Shared>) => Data);

  /**
   * The shared data of all traits.
   */
  shared?: Shared;

  /**
   * The shared meta data of all traits.
   */
  meta?: TraitMetaData;

  /**
   * Optional initialization function for the trait.
   *
   * @param component - The instance of the component being initialized.
   */
  init?(
    component: TraitInstance<TraitSchema, Data, Logic>
  ): Promise<void> | void;

  /**
   * Optional disposal function for the trait.
   *
   * @param component - The instance of the component being disposed.
   */
  dispose?(
    component: TraitInstance<TraitSchema, Data, Logic>
  ): Promise<void> | void;
};
