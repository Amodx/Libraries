import { ComponentData } from "../Components/ComponentData";

/**
 * Interface representing the state data of a node.
 */
export interface NodeStateData {
  [key: string]: any;
}

/**
 * Type representing the data of a node.
 *
 * Used for serlization and creation.
 */
export type NodeData = {
  /**
   * The unique 128 bit identifier of the node.
   *
   */
  id: string;

  /**
   * The name of the node.
   */
  name: string;

  /**
   * The state data of the node.
   */
  state: NodeStateData;

  /**
   * The children nodes of the node.
   */
  children: NodeData[];



  /**
   * The components of the node.
   */
  components: ComponentData[];
};
