import { Graph } from "../Graphs/Graph";
import { SystemRegisterData } from "./System.types";
import { QueryInstance } from "../Queries/QueryInstance";

export class SystemInstance {
  queries: QueryInstance[] = [];
  constructor(
    public graph: Graph,
    public proto: SystemRegisterData
  ) {
    for (const query of proto.queries) {
      this.queries.push(query.add(graph));
    }
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
