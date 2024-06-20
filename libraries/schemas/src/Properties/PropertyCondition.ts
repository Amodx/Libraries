import { Path } from "./Path";

type LogicalOperation = "==" | "===" | "!=" | "!==" | "<" | ">" | "<=" | ">=";

export class PropertyCondition<Data extends object> {
  static Create<Data extends object>(
    path: Path<Data>,
    operation: LogicalOperation,
    value: any
  ) {
    const query = new PropertyCondition<Data>(path, operation);
    query.value = value;
    return query;
  }

  private constructor(
    public path: Path<Data>,
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

