import { SchemaNode } from "../Schemas/SchemaNode";
import { PropertyCondition } from "./PropertyCondition";

type PropertyConditionFunction = <Data extends object = {}>(
  action: PropertyConditionAction<Data>,
  node: SchemaNode,
  result: boolean
) => void;

export class PropertyConditionAction<Data extends object = {}> {
  static Create<Data extends object = any>(
    action: "enable" | "lock" | PropertyConditionFunction,
    conditions: PropertyCondition<Data>[]
  ): PropertyConditionAction {
    return new PropertyConditionAction(action, conditions);
  }
  private constructor(
    public action: "enable" | "lock" | PropertyConditionFunction,
    public conditions: PropertyCondition<Data>[]
  ) {

  }

  evaluate(newValue: any, affectedNode: SchemaNode) {
    let result = false;
    for (const e of this.conditions) {
      result = e.evaluate(newValue);
    }
    if (result) {
      if (this.action == "enable") {
        affectedNode.setEnabled(true);
        return;
      }
      if (this.action == "lock") {
        affectedNode.setLocked(true);
        return;
      }
    } else {
      if (this.action == "enable") {
        affectedNode.setEnabled(false);
        return;
      }
      if (this.action == "lock") {
        affectedNode.setLocked(false);
        return;
      }
    }
    return this.action(this, affectedNode, result);
  }
}
