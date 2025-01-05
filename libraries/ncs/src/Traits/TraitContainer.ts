import { TraitInstance } from "./TraitInstance";
import { ComponentInstance } from "../Components/ComponentInstance";
import { TraitData } from "./TraitData";
import { TraitContainerObservers } from "./TraitContaienrObservers";
import { NCSRegister } from "../Register/NCSRegister";
import { TraitInstanceMap } from "./TraitInstanceMap";

export class TraintContainer {
  private _observers?: TraitContainerObservers;
  get observers() {
    if (!this._observers) {
      this._observers = new TraitContainerObservers();
    }
    return this._observers;
  }
  get hasObservers() {
    return Boolean(this._observers);
  }

  traits: TraitInstance[] = [];
  constructor(
    public parent: ComponentInstance<any, any, any> | TraitInstance
  ) {}
  *traverseTraits(): Generator<any> {
    const children = [...this.traits];
    while (children.length) {
      const child = children.shift()!;
      yield child;
      if (child.traits.traits.length) children.push(...child.traits.traits);
    }
  }

  dispose() {
    for (const child of this.traits) {
      child.dispose();
    }
  }
  initAllTraits() {
    for (const trait of this.traits) {
      trait.init();
    }
  }
  add(trait: TraitData,init = false): TraitInstance<any, any, any, any> {
    const traitType = NCSRegister.traits.get(
      trait.type,
      trait.namespace || "main"
    );
    const newTrait = traitType.create(this.parent, trait);

    this.traits.push(newTrait);
    const node = newTrait.getNode();

    const map = TraitInstanceMap.getMap(newTrait.type);
    map.addNode(node, newTrait);
  if(init)  newTrait.init();
    if (trait.traits?.length) {
      newTrait.traits.addTraits(init,...trait.traits);
    }
    this.hasObservers &&
      this.observers.isTraitAddedSet &&
      this.observers.traitAdded.notify(newTrait);
    this.hasObservers &&
      this.observers.isTraitsUpdatedSet &&
      this.observers.traitsUpdated.notify();
    return newTrait;
  }
  addTraits(init:boolean,...traits: TraitData[]) {
    const newTraits: TraitInstance<any, any, any, any>[] = [];
    for (const trait of traits) {
      const traitType = NCSRegister.traits.get(
        trait.type,
        trait.namespace || "main"
      );
      const newTrait = traitType.create(this.parent, trait);
      this.traits.push(newTrait);
      newTraits.push(newTrait);
    if(init)  newTrait.init();
      if (trait.traits?.length) {
        newTrait.traits.addTraits(init,...trait.traits);
      }
      this.hasObservers &&
        this.observers.isTraitAddedSet &&
        this.observers.traitAdded.notify(newTrait);
    }
    this.hasObservers &&
      this.observers.isTraitsUpdatedSet &&
      this.observers.traitsUpdated.notify();
    return newTraits;
  }
  removeByIndex(index: number) {
    const trait = this.traits[index];
    if (trait) {
      const child = this.traits.splice(index, 1)![0];
      this.hasObservers &&
        this.observers.isTraitRemovedSet &&
        this.observers.traitRemoved.notify(child);
      this.hasObservers &&
        this.observers.isTraitsUpdatedSet &&
        this.observers.traitsUpdated.notify();
      trait.dispose();
      return true;
    }
    return false;
  }
  remove(type: string) {
    return this.removeByIndex(this.traits.findIndex((_) => _.type == type));
  }

  get(type: string): TraitInstance<any, any, any, any> | null {
    return this.traits.find((_) => _.type == type) || null;
  }
  getAll(type: string): TraitInstance<any, any, any, any>[] {
    return this.traits.filter((_) => _.type == type);
  }
  removeAll(type: string): TraitInstance<any, any, any, any>[] {
    const filtered = this.getAll(type);
    for (const trait of filtered) {
      trait.dispose();
    }
    this.traits = this.traits.filter((_) => _.type != type);
    for (const comp of filtered) {
      this.hasObservers &&
        this.observers.isTraitRemovedSet &&
        this.observers.traitRemoved.notify(comp);
    }
    this.hasObservers &&
      this.observers.isTraitsUpdatedSet &&
      this.observers.traitsUpdated.notify();
    return filtered;
  }
}
