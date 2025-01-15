import { Schema } from "../Schema/Schema";
import { ComponentCursor } from "./ComponentCursor";
import { RecursivePartial } from "../Util/Util.types";
/**
 * Interface representing the meta data of a component.
 */
export interface ComponentMetaData {
  name: string;
  [key: string]: any;
}
/**
 * Interface representing the pool data of a component.
 */
export interface ComponentPoolData {
  maxSize: number;
  [key: string]: any;
}



/**
 * Type representing the data of a component.
 *
 * @template ComponentSchema - The ComponentSchema of the component.
 */
export type SerializedComponentData<ComponentSchema extends object = any> = {
  /**
   * The type of the component.
   */
  type: string;
  /**
   * The ComponentSchema of the component.
   */
  schema?: ComponentSchema;
  schemaViewId?: string;
};

export type CreateComponentData<ComponentSchema extends object = any> = [
  /**
   * The type of the component.
   */
  type: number,
  /**
   * The ComponentSchema of the component.
   */
  schema: RecursivePartial<ComponentSchema> | null,
  /**
   * The schema view id  of the component.
   */
  schemaViewId: string | null,
];

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
  Shared extends Record<string, any> = {},
> = {
  /**
   * The type of the component.
   */
  type: string;
  pool?: ComponentPoolData;

  /**
   * The schema used to create an editable version of the component.
   * For the actual ComponentInstance the schema is created into an object.
   */
  schema?: Schema<ComponentSchema>;

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
  init?(component: ComponentCursor<ComponentSchema, Data, Logic, Shared>): void;

  /**
   * Optional update function for the component.
   * The update function is usually called once per frame.
   * It is up to the graph though when it gets called.
   *
   * @param component - The instance of the component being updated.
   */
  update?(
    component: ComponentCursor<ComponentSchema, Data, Logic, Shared>
  ): void;

  /**
   * Optional disposal function for the component.
   *
   * @param component - The instance of the component being disposed.
   */
  dispose?(
    component: ComponentCursor<ComponentSchema, Data, Logic, Shared>
  ): void;
};
