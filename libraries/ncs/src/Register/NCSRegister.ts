import { ComponentRegisterData } from "../Components/ComponentData";
import { ContextRegisterData } from "../Contexts/ContextData";
import { TraitRegisterData } from "../Traits/TraitData";

export class NCSRegister {
  static _components = new Map<string, ComponentRegisterData>();
  static _traits = new Map<string, TraitRegisterData>();
  static _context = new Map<string, ContextRegisterData>();

  static getComponent(type: string) {
    const component = this._components.get(type);
    if (!component)
      throw new Error(`Component with type [ ${type} ] is not registered.`);
    return component;
  }
  static getTrait(type: string) {
    const trait = this._traits.get(type);
    if (!trait)
      throw new Error(`Trait with type [ ${type} ] is not registered.`);
    return trait;
  }
  static getContext(type: string) {
    const context = this._context.get(type);
    if (!context)
      throw new Error(`Context with type [ ${type} ] is not registered.`);
    return context;
  }
}
