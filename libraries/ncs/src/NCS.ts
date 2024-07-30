import { Pipeline } from "@amodx/core/Pipelines";

import { Graph, GraphDependencies } from "./Graphs/Graph";

import { NodeData, NodeStateData } from "./Nodes/NodeData";
import { NodeInstance } from "./Nodes/NodeInstance";
import { NodeId } from "./Nodes/NodeId";

import { ComponentData } from "./Components/ComponentData";

import { TraitData } from "./Traits/TraitData";

import { ContextData } from "./Contexts/ContextData";

import { registerContext } from "./Functions/registerContext";
import { registerComponent } from "./Functions/registerComponent";
import { registerTrait } from "./Functions/registerTrait";
export class NCS {
  static Pipelines = {
    OnComponentDataCreate: new Pipeline<ComponentData>(),
    OnTraitDataCreate: new Pipeline<TraitData>(),
    OnNodeDataCreate: new Pipeline<NodeData>(),
    OnContextDataCreate: new Pipeline<ContextData>(),
  };

  static createGraph(dependencies: GraphDependencies) {
    return new Graph(dependencies);
  }

  static createNode(
    name?: string | null,
    state?: NodeStateData | null,
    components: ComponentData[] = [],
    children: NodeData[] = []
  ): NodeData {
    return NCS.Pipelines.OnNodeDataCreate.pipe({
      id: NodeId.Create().idString,
      components,
      children,
      name: name ? name : "",
      state: state ? state : {},
    });
  }

  static registerComponent = registerComponent;
  static registerTrait = registerTrait;
  static registerContext = registerContext;
}

export function Node(
  data: { name?: string; state?: NodeStateData },
  components?: ComponentData[],
  ...children: NodeData[]
): NodeData {
  return NCS.createNode(data.name, data.state, components, children);
}
