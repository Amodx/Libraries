import { NCSRegister } from "./NCSRegister";
import { SystemPrototype } from "../Systems/SystemPrototype";
import { SystemRegisterData } from "../Systems/System.types";
import { Graph } from "../Graphs/Graph";
import { SystemInstance } from "../Systems/SystemInstance";

type RegisteredSystem = SystemRegisterData & {
  set: (graph: Graph) => void;
  get: (graph: Graph) => SystemInstance | null;
  remove: (graph: Graph) => SystemInstance | null;

  prototype: SystemPrototype;
};

export function registerSystem(data: SystemRegisterData): RegisteredSystem {
  const prototype = new SystemPrototype(data);

  NCSRegister.systems.register(data.type,  prototype);

  return Object.assign(data, {
    prototype,
    set: (graph: Graph) => prototype.add(graph),
    get: (graph: Graph) => prototype.systems.get(graph) || null,
    remove: (graph: Graph) => prototype.remove(graph),
  }) as any;
}
