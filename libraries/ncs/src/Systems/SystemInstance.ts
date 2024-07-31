import { GraphUpdate } from "../Graphs/GraphUpdate";
import { Graph } from "../Graphs/Graph";
import { SystemRegisterData } from "./SystemData";
import { QueryInstance } from "../Queries/QueryInstance";

export class SystemInstance {
  queries: QueryInstance[] = [];
  constructor(public graph: Graph, public systemPrototype: SystemRegisterData) {
    for (const query of systemPrototype.queries) {
      this.queries.push(query.add(graph));
    }
  }

  init() {
    GraphUpdate.addSystemToUpdate(this);
  }
  dispose() {
    GraphUpdate.removeSystemFromUpdate(this);
  }
}
