import { RecursivePartial } from "../Util/Util.types";
import { Schema } from "../Schema/Schema";

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
export type SerializedContextData<Schema extends Record<string, any> = {}> = {
  /**
   * The type of the context.
   */
  type: string;
  /**
   * The schema of the context.
   */
  schema: Schema;
  /**
   * The schema view id  of the component.
   */
  schemaViewId: string | null;
};

export type CreateContextData<
  Schema extends Record<string, any> = {},
  Data extends Record<string, any> = {},
> = [
  /**
   * The type of the context.
   */
  type: string,
  /**
   * The schema of the context.
   */
  schema: RecursivePartial<Schema> | null,
  /**
   * The schema view id  of the component.
   */
  schemaViewId: string | null,
  /**
   * The runtime data of the context.
   */
  data: Data | null,
];

/**
 * Type representing the data required to register a context.
 *
 * Used for serlization and creation.
 * @template Data - The runtime data of the context.
 */
export type ContextRegisterData<
  ContextSchema extends Record<string, any> = {},
  Data extends Record<string, any> = {},
> = {
  /**
   * The type of the context.
   */
  type: string;
  /**
   * The schema used to create an editable version of the component.
   * For the actual ComponentInstance the schema is created into an object.
   */
  schema?: Schema<ContextSchema>;

  /**
   * The runtime data of the context.
   */
  data?: Data;
  /**
   * The shared meta data of all contexts.
   */
  meta?: ContextMetaData;
};

