import { Schema } from "../Schema/Schema";
import { ComponentCursor } from "./ComponentCursor";
import { RecursivePartial } from "../Util/Util.types";

export type CreateComponentData<ComponentSchema extends object = any> = [
  /**
   * The type of the component.
   */
  type: string,
  /**
   * The ComponentSchema of the component.
   */
  schema: RecursivePartial<ComponentSchema> | any | null,
  /**
   * The schema view id  of the component.
   */
  schemaViewId: string | null,

  /**
   * Wether or not if the component is remote. 
   */
  remote: true | null,
];

/**
 * Interface representing the meta data of a component.
 */
export interface ComponentMetaData {
  name: string;
  [key: string]: any;
}
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
  ComponentSchema extends object = any,
  Data extends any = any,
  Shared extends any = any,
> = {
  /**
   * The type of the component.
   */
  type: string;

  /**
   * The schema used to create an editable version of the component.
   * For the actual ComponentInstance the schema is created into an object.
   */
  schema?: Schema<ComponentSchema>;

  data?: Data;
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
  init?(component: ComponentCursor<ComponentSchema, Data, Shared>): void;

  /**
   * Optional update function for the component.
   * The update function is usually called once per frame.
   * It is up to the graph though when it gets called.
   *
   * @param component - The instance of the component being updated.
   */
  update?(component: ComponentCursor<ComponentSchema, Data, Shared>): void;

  /**
   * Optional disposal function for the component.
   *
   * @param component - The instance of the component being disposed.
   */
  dispose?(component: ComponentCursor<ComponentSchema, Data, Shared>): void;
};
