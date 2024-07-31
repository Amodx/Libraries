import { ComponentRegisterData } from "../Components/ComponentData";
import { TagRegisterData } from "../Tags/TagData";

export type QueryData = {
  inclueComponents: ComponentRegisterData[];
  includeTags: TagRegisterData[];
  excludeComponents: ComponentRegisterData[];
  excludeTags: TagRegisterData[];
};
