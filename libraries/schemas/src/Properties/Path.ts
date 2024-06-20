type NestedProperty<T extends string = string> = `${T}.${T}`;

export class Path<Data extends object> {
  static Create<Data extends object>(path: NestedProperty) {
    return new Path<Data>(path);
  }

  private propertyPath: string[];

  private constructor(public path: NestedProperty) {
    this.propertyPath = path.split(".");
  }

  private resolvePath(obj: Data): any {
    return this.propertyPath.reduce(
      (acc, part) => acc && (acc as any)[part],
      obj
    );
  }

  get(obj: Data): any {
    return this.resolvePath(obj);
  }

  set(obj: Data, value: any): void {
    const lastProperty = this.propertyPath.pop();
    const target = this.resolvePath(obj);
    if (lastProperty && target) {
      target[lastProperty] = value;
    }
  }
}
