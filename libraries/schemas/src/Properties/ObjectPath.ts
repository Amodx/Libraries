type QueryPathTree<T> = {
  [P in keyof T]-?: T[P] extends (infer U)[]
    ? [P] | [P, number] | [P, number, ...QueryPath<U>]
    : T[P] extends object
    ? [P] | [P, ...QueryPath<T[P]>]
    : [P];
};

export type QueryPath<T> = QueryPathTree<T>[keyof T];

type QueryPathValue<T, P extends any[]> = P extends [infer K, ...infer Rest]
  ? K extends keyof T
    ? Rest extends []
      ? T[K]
      : Rest extends [number, ...infer R]
      ? T[K] extends (infer U)[]
        ? R extends []
          ? U
          : QueryPathValue<U, R>
        : never
      : QueryPathValue<T[K], Rest>
    : never
  : never;

export class ObjectPath<Data extends object, Path extends QueryPath<Data>> {
  static Create<Data extends object, Path extends QueryPath<Data> = any>(
    path: Path
  ): ObjectPath<Data, typeof path> {
    return new ObjectPath<Data, Path>(path);
  }
  static Generator<Data extends object>() {
    return <Path extends QueryPath<Data>>(path: Path) =>
      new ObjectPath<Data, Path>(path);
  }
  private propertyPath: Path;

  private constructor(public path: Path) {
    this.propertyPath = path;
  }

  private resolvePath(obj: Data): QueryPathValue<Data, Path> {
    return this.propertyPath.reduce(
      (acc, part) => acc && (acc as any)[part],
      obj
    ) as QueryPathValue<Data, Path>;
  }

  private resolveParentPath(obj: Data): any {
    return this.propertyPath
      .slice(0, -1)
      .reduce((acc, part) => acc && (acc as any)[part], obj);
  }

  get(obj: Data): QueryPathValue<Data, Path> {
    return this.resolvePath(obj);
  }

  set(obj: Data, value: QueryPathValue<Data, Path>): void {
    const path = [...this.propertyPath];
    const lastProperty = path.pop();
    const target = this.resolveParentPath(obj);
    if (lastProperty && target) {
      (target as any)[lastProperty] = value;
    }
  }
}
