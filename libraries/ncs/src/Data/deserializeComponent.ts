import { CreateComponentData } from "../Components/Component.types";
import { NCSRegister } from "../Register/NCSRegister";
import { SerializedComponentData } from "./SerializedData.types";
export function deserializeComponentData(
  data: SerializedComponentData
): CreateComponentData {
  return [data.type, data.schema || null, data.schemaViewId || null, null];
}
