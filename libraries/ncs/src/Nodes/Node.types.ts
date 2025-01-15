import {
  SerializedComponentData,
  CreateComponentData,
} from "../Components/Component.types";



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
   * The components of the node.
   */
  components: CreateComponentData[] | null,
  /**
   * The tags of the node.
   */
  tags: number[] | null,
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
  Enabled,
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
