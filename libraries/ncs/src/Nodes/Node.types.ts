import {
  SerializedComponentData,
  CreateComponentData,
} from "../Components/Component.types";

/**
 * Interface representing the state data of a node.
 */
export interface NodeStateData {
  [key: string]: any;
}

export type CreateNodeData = [
  /**
   * The unique 128 bit identifier of the node.
   *
   */
  id: bigint | null,
  /**
   * The name of the node.
   */
  name: string,
  /**
   * The state data of the node.
   */
  state: NodeStateData,
  /**
   * The components of the node.
   */
  components: CreateComponentData[] | null,
  /**
   * The tags of the node.
   */
  tags: string[] | null,
  /**
   * The children nodes of the node.
   */
  children: CreateNodeData[] | null,
];
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
   * The state data of the node.
   */
  state: NodeStateData;
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
export enum NodeObserverIds {
  Disposed,
  Parented,
  RemovedFromParent,
  ChildAdded,
  ChildRemoved,
  ChildrenUpdated,
  ComponentAdded,
  ComponentRemoved,
  ComponentsUpdated,
  TagAdded,
  TagRemoved,
  TagsUpdated,
}
