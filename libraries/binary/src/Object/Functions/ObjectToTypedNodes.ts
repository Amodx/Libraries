import { TypedArrayClassRecord } from "../../Util/TypedArrayMap.js";
import { TypedNode } from "../Classes/TypedNode.js";
import { TypedNodes } from "../TypedNodes.js";
import { TypedNodesToBuffer } from "./TypedNodesToBuffer.js";

export class ObjectToTypedNodes {
  static _name = "";

  static _traverseObj(obj: any) {
    const node = TypedNodes.object(<any>{});

    for (const key of Object.keys(obj)) {
      const value = obj[key];
      this._name = key;

      if (value instanceof TypedNode) {
        node.value[key] = value;
        continue;
      }

      if (ArrayBuffer.isView(value)) {
        node.value[key] = this._addPrimitive(value);
        continue;
      }
      if (value instanceof ArrayBuffer || value instanceof SharedArrayBuffer) {
        node.value[key] = this._addPrimitive(value);
        continue;
      }
      if (
        value instanceof Blob ||
        (typeof File !== "undefined" && value instanceof File)
      ) {
        continue;
      }
      if (typeof value == "object" && !Array.isArray(value)) {
        node.value[key] = this._traverseObj(value);
        continue;
      }
      if (typeof value == "object" && Array.isArray(value)) {
        node.value[key] = this._traverseArray(value);
        continue;
      }

      node.value[key] = this._addPrimitive(value);
    }

    return node;
  }

  static _traverseArray(array: any) {
    const node = TypedNodes.array(<any[]>[]);
    for (const value of array) {
      if (value instanceof TypedNode) {
        node.value.push(value);
        continue;
      }
      if (ArrayBuffer.isView(value)) {
        node.value.push(this._addPrimitive(value));
        continue;
      }
      if (typeof value == "object" && !Array.isArray(value)) {
        node.value.push(this._traverseObj(value));
        continue;
      }
      if (
        typeof value == "object" &&
        Array.isArray(value) &&
        !ArrayBuffer.isView(value)
      ) {
        node.value.push(this._traverseArray(value));
        continue;
      }
      node.value.push(this._addPrimitive(value));
    }

    return node;
  }

  static _addPrimitive(node: any) {
    if (typeof node == "string") {
      return TypedNodes.string(node);
    }
    if (typeof node == "number") {
      return TypedNodes.float64(node);
    }
    if (typeof node == "boolean") {
      return TypedNodes.boolean(node);
    }
    if (typeof node == "undefined") {
      return TypedNodes.undefined();
    }
    if (node instanceof ArrayBuffer || node instanceof SharedArrayBuffer) {
      return TypedNodes.arrayBuffer(node);
    }
    if (ArrayBuffer.isView(node)) {
      if (TypedArrayClassRecord.has((node as any).constructor)) {
        return TypedNodes.typedArray(
          TypedArrayClassRecord.get((node as any).constructor)!,
          node as any
        );
      }
    }
    if (node instanceof TypedNode) {
      return node;
    }

    throw new Error(`Unsuppourted type for DBO parser.`);
  }

  static tokTypedNodes(object: any) {
    if (typeof object == "object" && !Array.isArray(object)) {
      const parent = TypedNodes.object(<any>{});

      parent.value = this._traverseObj(object).value;
      return parent;
    }
    if (typeof object == "object" && Array.isArray(object)) {
      const parent = TypedNodes.array(<any>[]);

      parent.value = this._traverseArray(object).value;
      return parent;
    }

    return this._addPrimitive(object);
  }

  static toBuffer(object: any) {
    const typedNodes = this.tokTypedNodes(object);
    return TypedNodesToBuffer.toBuffer(typedNodes);
  }
}
