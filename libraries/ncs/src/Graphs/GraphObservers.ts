import { Observable } from "@amodx/core/Observers";
import { NodeInstance } from "../Nodes/NodeInstance";
import { ComponentInstance } from "Components/ComponentInstance";

export interface GraphObservers {}

export class GraphObservers {
  nodeAdded = new Observable<NodeInstance>();
  nodeRemoved = new Observable<NodeInstance>();
  nodesUpdated = new Observable();

 
}
