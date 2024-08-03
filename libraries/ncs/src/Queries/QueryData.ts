import { ComponentRegisterData } from "../Components/ComponentData";
import { TagRegisterData } from "../Tags/TagData";

export type QueryData = {
  inclueComponents?: ComponentRegisterData<any,any,any,any>[];
  includeTags?: TagRegisterData[];
  excludeComponents?: ComponentRegisterData<any,any,any,any>[];
  excludeTags?: TagRegisterData[];
};
