import { TraitInstance } from "./TraitInstance";
import { ComponentInstance } from "../Components/ComponentInstance";
import { TraitData } from "./TraitData";
import { TraitContainerObservers } from "./TraitContaienrObservers";
import { NCSRegister } from "../Register/NCSRegister";

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

  async dispose() {
    for (const child of this.traits) {
      child.dispose();
    }
  }
  async initAllTraits() {
    for (const trait of this.traits) {
      await trait.init();
    }
  }
  async add(trait: TraitData): Promise<TraitInstance<any, any, any, any>> {
    const traitType = NCSRegister.getTrait(trait.type);
    const newTrait = new TraitInstance(this.parent, traitType, trait);
    this.traits.push(newTrait);
    await newTrait.init();
    if (trait.traits?.length) {
      newTrait.traits.addTraits(...trait.traits);
    }
    this.hasObservers &&
      this.observers.isTraitAddedSet() &&
      this.observers.traitAdded.notify(newTrait);
    this.hasObservers &&
      this.observers.isTraitsUpdatedSet() &&
      this.observers.traitsUpdated.notify();
    return newTrait;
  }
  async addTraits(...traits: TraitData[]) {
    const newTraits: TraitInstance<any, any, any, any>[] = [];
    for (const trait of traits) {
      const traitType = NCSRegister.getTrait(trait.type);
      const newTrait = new TraitInstance(this.parent, traitType, trait);
      this.traits.push(newTrait);
      newTraits.push(newTrait);
      await newTrait.init();
      if (trait.traits?.length) {
        newTrait.traits.addTraits(...trait.traits);
      }
      this.hasObservers &&
        this.observers.isTraitAddedSet() &&
        this.observers.traitAdded.notify(newTrait);
    }
    this.hasObservers &&
      this.observers.isTraitsUpdatedSet() &&
      this.observers.traitsUpdated.notify();
    return newTraits;
  }
  async removeByIndex(index: number) {
    const trait = this.traits[index];
    if (trait) {
      const child = this.traits.splice(index, 1)![0];
      this.hasObservers &&
        this.observers.isTraitRemovedSet() &&
        this.observers.traitRemoved.notify(child);
      this.hasObservers &&
        this.observers.isTraitsUpdatedSet() &&
        this.observers.traitsUpdated.notify();
      await trait.dispose();
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
  async removeAll(type: string): Promise<TraitInstance<any, any, any, any>[]> {
    const filtered = this.getAll(type);
    for (const trait of filtered) {
      await trait.dispose();
    }
    this.traits = this.traits.filter((_) => _.type != type);
    for (const comp of filtered) {
      this.hasObservers &&
        this.observers.isTraitRemovedSet() &&
        this.observers.traitRemoved.notify(comp);
    }
    this.hasObservers &&
      this.observers.isTraitsUpdatedSet() &&
      this.observers.traitsUpdated.notify();
    return filtered;
  }
}
