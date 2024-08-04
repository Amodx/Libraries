import { GraphUpdate, GraphUpdtable } from "../Graphs/GraphUpdate";
import { Graph } from "../Graphs/Graph";
import { SystemRegisterData } from "./SystemData";
import { QueryInstance } from "../Queries/QueryInstance";

export class SystemInstance implements GraphUpdtable {
  queries: QueryInstance[] = [];
  constructor(public graph: Graph, public proto: SystemRegisterData) {
    for (const query of proto.queries) {
      this.queries.push(query.add(graph));
    }
  }

  update() {
    this.proto.update(this);
  }

  init() {
    GraphUpdate.addITem(this.graph, this);
  }
  dispose() {
    GraphUpdate.removeItem(this.graph, this);
  }
}
