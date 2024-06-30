import type { ObjectPropertyValidatorData } from "./ObjectValidation.types.js";
import { ObjectPropertyValidator } from "./ObjectPropertyValidator.js";

export class ObjectPropertyValidatorRegister {
  static _validators = new Map<string, ObjectPropertyValidator>();

  static registerValidators(validators: ObjectPropertyValidatorData[]) {
    validators.forEach((data) =>
      this._validators.set(data.id, new ObjectPropertyValidator(data))
    );
  }
  static getValidator(id: string) {
    const validator = this._validators.get(id);
    if (!validator) throw new Error(`Validator with ${id} does not exist`);
    return validator;
  }
}
