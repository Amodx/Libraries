import { ContextInstance } from "./ContextInstance";

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
 * @template ContextSchema - The ContextSchema of the context.
 */
export type ContextData = {
  /**
   * The type of the context.
   */
  type: string;
};

/**
 * Type representing the data required to register a context.
 *
 * Used for serlization and creation.
 * @template Data - The runtime data of the context.
 */
export type ContextRegisterData<Data extends Record<string, any> = {}> = {
  /**
   * The type of the context.
   */
  type: string;

  /**
   * The optional name of the context.
   */
  name?: string;

  /**
   * The runtime data of the context.
   */
  data?: Data | ((component: ContextInstance<Data>) => Data);

  /**
   * The shared meta data of all contexts.
   */
  meta?: ContextMetaData;

  /**
   * Optional initialization function for the context.
   *
   * @param component - The instance of the component being initialized.
   */
  init?(component: ContextInstance<Data>): Promise<void> | void;

  /**
   * Optional disposal function for the context.
   *
   * @param component - The instance of the component being disposed.
   */
  dispose?(component: ContextInstance<Data>): Promise<void> | void;
};
