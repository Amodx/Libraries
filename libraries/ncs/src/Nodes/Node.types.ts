import { CreateComponentData } from "../Components/Component.types";
export type CreateNodeData = [
  /**
   * The unique 128 bit identifier of the node.
   *
   */
  id: bigint | string | null,
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
