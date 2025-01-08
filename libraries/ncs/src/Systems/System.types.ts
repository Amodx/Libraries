import { QueryPrototype } from "../Queries/QueryPrototype";
import { SystemInstance } from "./SystemInstance";

export type SystemRegisterData = {
  /**
   * The name of the system.
   */
  type: string;
  /**
   * The queries of the system.
   */
  queries: QueryPrototype[];
  /**
   * The update function  of the system.
   */
  update(system: SystemInstance): void;
};
