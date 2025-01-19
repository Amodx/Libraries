import { Graph } from "../Graphs/Graph";
import { SystemRegisterData } from "./System.types";
import { QueryInstance } from "../Queries/QueryInstance";
import { NodeCursor } from "../Nodes/NodeCursor";

export class SystemInstance {
  queries: QueryInstance[] = [];
  node = NodeCursor.Get();
  constructor(
    public graph: Graph,
    public proto: SystemRegisterData
  ) {
    for (const query of proto.queries) {
      this.queries.push(query.add(graph));
    }
    this.graph._systems.push(this);
  }

  update() {
    this.proto.update(this);
  }

  dispose() {
    for (let i = 0; i < this.graph._systems.length; i++) {
      if (this.graph._systems[i] == this) {
        this.graph._systems.splice(i, 1);
      }
    }
  }
}
