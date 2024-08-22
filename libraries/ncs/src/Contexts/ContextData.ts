import { Property } from "@amodx/schemas";

/**
 * Interface representing the meta data of a context.
 */
export interface ContextMetaData {
  name: string;
  [key: string]: any;
}

/**
 * Interface representing the state data of a context.
 */
export interface ContextStateData {
  [key: string]: any;
}

/**
 * Type representing the data of a context.
 *
 */
export type ContextData<Schema extends Record<string, any> = {}> = {
  /**
   * The type of the context.
   */
  type: string;
  /**
   * The namespace of the context.
   */
  namespace?: string;
  /**
   * The schema of the context.
   */
  schema: Schema;
};

/**
 * Type representing the data required to register a context.
 *
 * Used for serlization and creation.
 * @template Data - The runtime data of the context.
 */
export type ContextRegisterData<
  Schema extends Record<string, any> = {},
  Data extends Record<string, any> = {}
> = {
  /**
   * The type of the context.
   */
  type: string;
  /**
   * The namespace of the context.
   */
  namespace?: string;
  /**
   * The schema used to create an editable version of the component.
   * For the actual ComponentInstance the schema is created into an object.
   */
  schema?: Property<any, any>[];

  /**
   * The runtime data of the context.
   */
  data?: Data;
  /**
   * The shared meta data of all contexts.
   */
  meta?: ContextMetaData;
};
