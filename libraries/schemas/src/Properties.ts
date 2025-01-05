import { PropertyFC } from "./Property.types";
import {
  ColorPropertyInput,
  FloatPropertyInput,
  IntPropertyInput,
  RangePropertyInput,
  SelectPropertyInput,
  StringPropertyInput,
  Vec2PropertyInput,
  Vec3PropertyInput,
  BooleanPropertyInput,
} from "./Inputs/DefaultInputs";
import { ObjectPath } from "./Properties/ObjectPath";
import { Property } from "./Properties/Property";
import { PropertyCondition } from "./Properties/PropertyCondition";
import { PropertyConditionAction } from "./Properties/PropertyConditionAction";

export const PropConditions = Object.assign(
  (data: Property<any, any>, ...conditions: PropertyConditionAction[]) => {
    data.conditions = conditions;
    return data;
  },
  {
    Action: PropertyConditionAction.Create,
    Condition: PropertyCondition.Create,
    Path: ObjectPath.Create,
  }
);

export const ObjectProp = (
  id: string,
  name: string,
  ...properties: Property<any, any>[]
) => {
  return Property.Create({
    id: id,
    name: name,
    children: properties,
  });
};
export const AnyProp: PropertyFC<any, any> = (id, data = {}) => {
  return Property.Create({
    id,
    name: data.name,
    value: data.value ? data.value : null,
    initialize: data.initialize,
    input: null,
  });
};

export const StringProp = StringPropertyInput.createPropertyFC("");
export const FloatProp = FloatPropertyInput.createPropertyFC(0);
export const IntProp = IntPropertyInput.createPropertyFC(0);
export const RangeProp = RangePropertyInput.createPropertyFC(0);
export const ColorProp = ColorPropertyInput.createPropertyFC("#ffffff");
export const SelectProp = SelectPropertyInput.createPropertyFC("");
export const Vec2Prop = Vec2PropertyInput.createPropertyFC({ x: 0, y: 0 });
export const Vec3Prop = Vec3PropertyInput.createPropertyFC({
  x: 0,
  y: 0,
  z: 0,
});
export const BooleanProp = BooleanPropertyInput.createPropertyFC(false);


