import { ContextPrototype } from "../Contexts/ContextPrototype";
import { ComponentPrototype } from "../Components/ComponentPrototype";
import { TraitPrototype } from "../Traits/TraitPrototype";
import { ItemRegister } from "./ItemRegister";
import { SystemPrototype } from "../Systems/SystemPrototype";
import { TagPrototype } from "../Tags/TagPrototype";

export class NCSRegister {
  static components = new ItemRegister<ComponentPrototype<any, any, any, any>>(
    "Components"
  );
  static traits = new ItemRegister<TraitPrototype<any, any, any, any>>(
    "Traits"
  );
  static contexts = new ItemRegister<ContextPrototype<any, any>>("Context");
  static tags = new ItemRegister<TagPrototype>("Tags");
  static systems = new ItemRegister<SystemPrototype>("Systems");
}
