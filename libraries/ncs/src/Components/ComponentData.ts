import { Property } from "@amodx/schemas";
import { ComponentInstance } from "./ComponentInstance";
import { TraitData } from "../Traits/TraitData";

/**
 * Interface representing the meta data of a trait.
 */
export interface ComponentMetaData {
  name: string;
  [key: string]: any;
}

/**
 * Interface representing the state data of a component.
 */
export interface ComponentStateData {
  [key: string]: any;
}

/**
 * Type representing the data of a component.
 *
 * @template ComponentSchema - The ComponentSchema of the component.
 */
export type ComponentData<ComponentSchema extends object = any> = {
  /**
   * The type of the component.
   */
  type: string;

  /**
   * The state data of the component.
   */
  state: ComponentStateData;

  /**
   * The ComponentSchema of the component.
   */
  schema: ComponentSchema;

  /**
   * The traits associated with the component.
   */
  traits: TraitData[];
};

/**
 * Type representing the data required to register a component.
 *
 * Used for serlization and creation.
 * @template ComponentSchema - The schema of the component.
 * @template Data - The runtime data of the component.
 * @template Logic - The logic functions of the component.
 * @template Shared - The shared data of all components of this type.
 * @template Meta - The shared meta data of all components of this type.
 */
export type ComponentRegisterData<
  ComponentSchema extends object = {},
  Data extends Record<string, any> = {},
  Logic extends Record<string, any> = {},
  Shared extends Record<string, any> = {}
> = {
  /**
   * The type of the component.
   */
  type: string;

  /**
   * The schema used to create an editable version of the component.
   * For the actual ComponentInstance the schema is created into an object.
   */
  schema?: Property<any, any>[];

  /**
   * The logic functions of the component.
   */
  logic?:
    | Logic
    | ((
        component: ComponentInstance<ComponentSchema, Data, Logic, Shared>
      ) => Logic);

  /**
   * The runtime data of the component.
   */
  data?:
    | Data
    | ((
        component: ComponentInstance<ComponentSchema, Data, Logic, Shared>
      ) => Data);

  /**
   * The shared data of all components.
   */
  shared?: Shared;

  /**
   * The shared meta data of all components.
   */
  meta?: ComponentMetaData;

  /**
   * Optional initialization function for the component.
   *
   * @param component - The instance of the component being initialized.
   */
  init?(
    component: ComponentInstance<ComponentSchema, Data, Logic, Shared>
  ): Promise<void> | void;

  /**
   * Optional update function for the component.
   * The update function is usually called once per frame.
   * It is up to the graph though when it gets called.
   *
   * @param component - The instance of the component being updated.
   */
  update?(
    component: ComponentInstance<ComponentSchema, Data, Logic, Shared>
  ): Promise<void> | void;

  /**
   * Optional disposal function for the component.
   *
   * @param component - The instance of the component being disposed.
   */
  dispose?(
    component: ComponentInstance<ComponentSchema, Data, Logic, Shared>
  ): Promise<void> | void;
};
