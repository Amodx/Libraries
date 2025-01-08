import { ItemPool } from "./ItemPool";
import { Observable } from "../Util/Observable";
export class NCSPools {
  static observers = new ItemPool<Observable>();
}
