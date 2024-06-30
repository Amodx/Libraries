import { SchemaNode } from "../Schemas/SchemaNode";
import type {
  ObjectPropertyValidatorData,
  ObjectPropertyValidatorResponse,
} from "./ObjectValidation.types";

export class ObjectPropertyValidator {
  constructor(public data: ObjectPropertyValidatorData) {}

  validate(value : unknown, data: SchemaNode): ObjectPropertyValidatorResponse {
    return this.data.validate(value,data);
  }
}
