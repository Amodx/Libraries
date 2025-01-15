import { ItemPool } from "../Util/ItemPool";
import { Observable } from "../Util/Observable";
import { NodeCursor } from "../Nodes/NodeCursor";
import { NodeObservers } from "../Nodes/NodeObservers";
import { NodeEvents } from "../Nodes/NodeEvents";
import { NodeComponents } from "../Nodes/NodeComponents";
import { NodeTags } from "../Nodes/NodeTags";
import { ComponentCursor } from "../Components/ComponentCursor";
import { ContextCursor } from "../Contexts/ContextCursor";
import { TagCursor } from "../Tags/TagCursor";
import { NodeContext } from "../Nodes/NodeContext";
import { CreateNodeData } from "../Nodes/Node.types";
import { CreateComponentData } from "../Components/Component.types";
import { CreateContextData } from "../Contexts/Context.types";
export class NCSPools {
  static observers = new ItemPool<Observable>();
  static numberArray = new ItemPool<number[]>();

  static createNodeData = new ItemPool<CreateNodeData>();
  static createComponentData = new ItemPool<CreateComponentData>();
  static createContextData = new ItemPool<CreateContextData>();

  static nodeCursor = new ItemPool<NodeCursor>();
  static nodeContext = new ItemPool<NodeContext>();
  static nodeObservers = new ItemPool<NodeObservers>();
  static nodeEvents = new ItemPool<NodeEvents>();
  static nodeComponents = new ItemPool<NodeComponents>();
  static nodeTags = new ItemPool<NodeTags>();
  static tagCursor = new ItemPool<TagCursor>();
  static componentCursor = new ItemPool<ComponentCursor>();
  static contextCursor = new ItemPool<ContextCursor>();
}
