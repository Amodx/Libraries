import { NodeId } from "../Nodes/NodeId";
import { CreateNodeData } from "../Nodes/Node.types";
import { NodeCursor } from "../Nodes/NodeCursor";
import {
  createRemoteComponent,
  serializeComponent,
} from "./serializeComponent";
import {
  SerializedComponentData,
  SerializedNodeData,
} from "./SerializedData.types";
import {
  ComponentRegisterData,
  CreateComponentData,
} from "Components/Component.types";
export function serializeNodeData(data: CreateNodeData): SerializedNodeData {
  return {
    name: data[1],
  };
}

/** Serialize the node data as is for storage*/
export function serializeNode(node: NodeCursor): SerializedNodeData {
  const id = node.id;

  let components: SerializedComponentData[] | null = null;
  if (node.hasComponents) {
    components = [];
    for (const comp of node.traverseComponents()) {
      components.push(serializeComponent(comp));
    }
  }
  let tags: string[] | null = null;
  if (node.hasTags) {
    tags = [];
    for (const tag of node.traverseTags()) {
      tags.push(tag.type);
    }
  }
  let children: SerializedNodeData[] | null = null;
  if (node.childrenArray?.length) {
    children = [];
    for (const child of node.children()) {
      children.push(serializeNode(child));
    }
  }

  return {
    ...(id ? { id: NodeId.ToHexString(id) } : {}),
    name: node.name,
    ...(components ? { components } : {}),
    ...(tags ? { tags } : {}),
    ...(children ? { children } : {}),
  };
}

/** Copy the node data as is */
export function copyNode(node: NodeCursor): CreateNodeData {
  return [null, node.name, null, null, null];
}

/** Clone the node data and create new ids if needed. */
export function cloneNode(node: NodeCursor): SerializedNodeData {
  return {
    name: node.name,
  };
}

export function createRemoteNode(
  node: NodeCursor,
  includeChildren = false,
  includedComponents: { type: string }[] = []
): CreateNodeData {
  let children: CreateNodeData[] | null = null;
  if (includeChildren) {
    children = [];
    for (const child of node.children()) {
      children.push(
        createRemoteNode(child, includeChildren, includedComponents)
      );
    }
  }
  let components: CreateComponentData[] | null = null;
  if (node.hasComponents) {
    components = [];
    for (const component of node.traverseComponents()) {
      if (includedComponents.length) {
        for (let i = 0; i < includedComponents.length; i++) {
          if (includedComponents[i].type == component.type) {
            components.push(createRemoteComponent(component));
            break;
          }
        }
      } else {
        components.push(createRemoteComponent(component));
      }
    }
  }
  let tags: number[] | null = null;
  if (node.hasTags) {
    tags = [];
    for (const tag of node.traverseTags()) {
      tags.push(tag.typeId);
    }
  }

  return [node.id ? node.id : null, node.name, components, tags, children];
}
