import { ObjectPath } from "./ObjectPath";

type LogicalOperation = "==" | "===" | "!=" | "!==" | "<" | ">" | "<=" | ">=";

export class PropertyCondition<Data extends object> {
  static Create<Data extends object>(
    path: ObjectPath<Data,any>,
    operation: LogicalOperation,
    value: any
  ) {
    const query = new PropertyCondition<Data>(path, operation);
    query.value = value;
    return query;
  }

  private constructor(
    public path: ObjectPath<Data,any>,
    public operation: LogicalOperation
  ) {}

  value: any;

  evaluate(obj: Data, value = this.value): boolean {
    const propertyValue = this.path.get(obj);

    switch (this.operation) {
      case "==":
        return propertyValue == value;
      case "===":
        return propertyValue === value;
      case "!=":
        return propertyValue != value;
      case "!==":
        return propertyValue !== value;
      case "<":
        return propertyValue < value;
      case ">":
        return propertyValue > value;
      case "<=":
        return propertyValue <= value;
      case ">=":
        return propertyValue >= value;
      default:
        throw new Error(`Unsupported operation: ${this.operation}`);
    }
  }
}

