import { NodeId } from "../Nodes/NodeId";
import { CreateNodeData } from "../Nodes/Node.types";
import { SerializedNodeData } from "./SerializedData.types";
import { deserializeComponentData } from "./deserializeComponent";
import { NCSRegister } from "../Register/NCSRegister";
import { CreateComponentData } from "../Components/Component.types";
export function deserializeNodeData(data: SerializedNodeData): CreateNodeData {
  let components: CreateComponentData[] | null = null;
  if (data.components) {
    components = [];
    for (let i = 0; i < data.components.length; i++) {
      const comp = data.components[i];
      components.push(deserializeComponentData(comp));
    }
  }

  let tags: number[] | null = null;
  if (data.tags) {
    tags = [];
    for (let i = 0; i < data.tags.length; i++) {
      tags.push(NCSRegister.tags.idPalette.getNumberId(data.tags[i]));
    }
  }

  let children: CreateNodeData[] | null = null;
  if (data.children) {
    children = [];
    for (let i = 0; i < data.children.length; i++) {
      children.push(deserializeNodeData(data.children[i]));
    }
  }

  return [
    data.id ? NodeId.FromString(data.id) : null,
    data.name,
    components,
    tags,
    children,
  ];
}
