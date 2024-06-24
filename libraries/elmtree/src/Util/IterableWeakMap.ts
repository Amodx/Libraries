export class IterableWeakMap<K extends object, V> {
  #weakMap = new WeakMap();
  #refSet = new Set();
  #finalizationGroup = new FinalizationRegistry((data: any) => {
    data.set.delete(data.ref);
  });

  constructor(iterable: [key: K, value: V][]) {
    for (const [key, value] of iterable) {
      this.set(key, value);
    }
  }

  set(key: K, value: V) {
    const ref = new WeakRef(key);

    this.#weakMap.set(key, { value, ref });
    this.#refSet.add(ref);
    this.#finalizationGroup.register(
      key,
      {
        set: this.#refSet,
        ref,
      },
      ref
    );
  }

  get(key: K) {
    const entry = this.#weakMap.get(key);
    return entry && entry.value;
  }

  delete(key: K) {
    const entry = this.#weakMap.get(key);
    if (!entry) {
      return false;
    }

    this.#weakMap.delete(key);
    this.#refSet.delete(entry.ref);
    this.#finalizationGroup.unregister(entry.ref);
    return true;
  }

  *[Symbol.iterator]() {
    for (const ref of this.#refSet) {
      //@ts-ignore
      const key = ref.deref();
      if (!key) continue;
      const { value } = this.#weakMap.get(key);
      yield [key, value];
    }
  }

  entries() {
    return this[Symbol.iterator]();
  }

  *keys() {
    for (const [key, value] of this) {
      yield key;
    }
  }

  *values() {
    for (const [key, value] of this) {
      yield value;
    }
  }
}
