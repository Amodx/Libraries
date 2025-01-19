import { CreateComponentData } from "../Components/Component.types";
import { NCSRegister } from "../Register/NCSRegister";
import { ComponentCursor } from "../Components/ComponentCursor";
import { SerializedComponentData } from "./SerializedData.types";
export function serializeComponentData(
  data: CreateComponentData
): SerializedComponentData {
  const component = NCSRegister.components.get(data[0]);
  return {
    type: component.type,
    ...(data[1] ? { schema: data[1] } : {}),
    ...(data[2] && data[2] !== "default" ? { schemaViewId: data[2] } : {}),
  };
}

export function serializeComponent(
  component: ComponentCursor
): SerializedComponentData {
  return {
    type: component.type,
    ...(component.schema ? { schema: component.schema.toJSON() } : {}),
    ...(component.schema?.__view && component.schema?.__view.id !== "default"
      ? { schemaViewId: component.schema.__view.id }
      : {}),
  };
}

export function copyComponent(component: ComponentCursor): CreateComponentData {
  return [
    component.type,
    component.schema ? component.schema.toJSON() : null,
    component.schema ? component.schema.__view.id : null,
    null,
  ];
}

export function createRemoteComponent(
  component: ComponentCursor
): CreateComponentData {
  return [
    component.type,
    component.schema
      ? component.schema.__view.toRemote(component.schema)
      : null,
    component.schema ? component.schema.__view.id : null,
    true,
  ];
}
