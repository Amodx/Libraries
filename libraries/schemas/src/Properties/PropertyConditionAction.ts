import { SchemaNode } from "Schemas/SchemaNode";
import { PropertyCondition } from "./PropertyCondition";

type PropertyConditionFunction = <Data extends object = any>(
  action: PropertyConditionAction<Data>,
  node: SchemaNode,
  result: boolean
) => void;

export class PropertyConditionAction<Data extends object = any> {
  static Create<Data extends object = any>(
    action: "enable" | "lock" | PropertyConditionFunction,
    conditions: PropertyCondition<Data>[]
  ): PropertyConditionAction {
    return new PropertyConditionAction(action, conditions);
  }
  private constructor(
    public action: "enable" | "lock" | PropertyConditionFunction,
    public conditions: PropertyCondition<Data>[]
  ) {}

  node: SchemaNode;

  evaluate(obj: Data, value?: any) {
    let result = false;
    for (const e of this.conditions) {
      result = e.evaluate(obj, value);
    }
    if (result) {
      if (this.action == "enable") {
        this.node.property.state.enabled = true;
        return;
      }
      if (this.action == "lock") {
        this.node.property.state.locked = true;
        return;
      }
    } else {
      if (this.action == "enable") {
        this.node.property.state.enabled = false;
        return;
      }
      if (this.action == "lock") {
        this.node.property.state.locked = false;
        return;
      }
    }
    return this.action(this, this.node, result);
  }
}
