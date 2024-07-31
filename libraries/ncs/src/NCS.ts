import { Pipeline } from "@amodx/core/Pipelines";

import { Graph, GraphDependencies } from "./Graphs/Graph";

import { NodeData, NodeStateData } from "./Nodes/NodeData";
import { NodeInstance } from "./Nodes/NodeInstance";
import { NodeId } from "./Nodes/NodeId";

import { QueryData } from "./Queries/QueryData";
import { QueryPrototype } from "./Queries/QueryPrototype";

import { ComponentData } from "./Components/ComponentData";
import { TraitData } from "./Traits/TraitData";
import { ContextData } from "./Contexts/ContextData";
import { TagData } from "./Tags/TagData";
import { registerContext } from "./Register/registerContext";
import { registerComponent } from "./Register/registerComponent";
import { registerTrait } from "./Register/registerTrait";
import { registerTag } from "./Register/registerTag";
import { registerSystem } from "./Register/registerSystem";

export class NCS {
  static Pipelines = {
    OnComponentDataCreate: new Pipeline<ComponentData>(),
    OnTraitDataCreate: new Pipeline<TraitData>(),
    OnNodeDataCreate: new Pipeline<NodeData>(),
    OnContextDataCreate: new Pipeline<ContextData>(),
    OnTagDataCreate: new Pipeline<TagData>(),
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

  static createQuery(data: QueryData) {
    return new QueryPrototype(data);
  }
  static registerSystem = registerSystem;
  static registerComponent = registerComponent;
  static registerTrait = registerTrait;
  static registerContext = registerContext;
  static registerTag = registerTag;
}

export function Node(
  data: { name?: string; state?: NodeStateData },
  components?: ComponentData[],
  ...children: NodeData[]
): NodeData {
  return NCS.createNode(data.name, data.state, components, children);
}
