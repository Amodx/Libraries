import { Graph } from "../Graphs/Graph";
import { QueryData } from "./Query.types";
import { QueryInstance } from "./QueryInstance";

export class QueryPrototype {
  queries = new Map<Graph, QueryInstance>();

  constructor(public data: QueryData) {}

  add(graph: Graph) {
    if (this.queries.has(graph)) return this.queries.get(graph)!;
    const newQuery = new QueryInstance(graph, this.data);
    this.queries.set(graph, newQuery)!;
    newQuery.init();
    return newQuery;
  }
  remove(graph: Graph) {
    const query = this.queries.get(graph);
    if (!query) return false;
    query.dispose();
    return true;
  }
}
