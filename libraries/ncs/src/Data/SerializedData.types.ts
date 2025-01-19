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

/**
 * Type representing the data of a node.
 *
 * Used for serlization and creation.
 */
export type SerializedNodeData = {
  /**
   * The unique 128 bit identifier of the node.
   *
   */
  id?: string;
  /**
   * The name of the node.
   */
  name: string;
  /**
   * The components of the node.
   */
  components?: SerializedComponentData[];
  /**
   * The tags of the node.
   */
  tags?: string[];
  /**
   * The children nodes of the node.
   */
  children?: SerializedNodeData[];
};



