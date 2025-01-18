import { CreateComponentData } from "../Components/Component.types";
import { NCSRegister } from "../Register/NCSRegister";
import { SerializedComponentData } from "./SerializedData.types";
export function deserializeComponentData(
  data: SerializedComponentData
): CreateComponentData {
  const componentId = NCSRegister.components.idPalette.getNumberId(data.type);
  return [componentId, data.schema || null, data.schemaViewId || null];
}
