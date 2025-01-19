import { ComponentRegisterData } from "../Components/Component.types";
import { TagRegisterData } from "../Tags/Tag.types";

export type QueryData = {
  inclueComponents?: ComponentRegisterData<any,any,any>[];
  includeTags?: TagRegisterData[];
  excludeComponents?: ComponentRegisterData<any,any,any>[];
  excludeTags?: TagRegisterData[];
};
