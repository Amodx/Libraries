import { ItemPool } from "./ItemPool";
import { Observable } from "@amodx/core/Observers";
import { Pipeline } from "@amodx/core/Pipelines";
export class NCSPools {
  static observers = new ItemPool<Observable>();
  static pipelines = new ItemPool<Pipeline>();
}
