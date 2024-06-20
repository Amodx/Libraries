import { BinaryObjectMarkers } from "../Constants/BinaryObjectMarkers.js";
import { TypedNode } from "../Classes/TypedNode.js";
import { BinaryNumberTypes, ByteCounts } from "../../Constants/BinaryTypes.js";
import { ByteEncoder } from "../../Util/ByteEncoder.js";

export class TypedNodesToBuffer {
  static _proto: number[] = [];
  static _tokenizeString(string: string) {
    for (let i = 0; i < string.length; i++) {
      this._addToken(BinaryNumberTypes.Uint8, string.charCodeAt(i));
    }
  }

  static _traverseObj(data: TypedNode<any>) {
    this._addMarker(BinaryObjectMarkers.Object);

    for (const key of Object.keys(data.value)) {
      let length = key.length;
      if (length > 255) {
        throw new Error("An object key cannot be longer then 255 chars.");
      }

      this._addMarker(BinaryObjectMarkers.Name);
      this._addToken(BinaryNumberTypes.Uint8, key.length);
      this._tokenizeString(key);

      const node = <TypedNode<any>>data.value[key];
      if (
        node.marker == BinaryObjectMarkers.Object &&
        !ArrayBuffer.isView(node.value)
      ) {
        this._traverseObj(node);
        continue;
      }
      if (
        node.marker == BinaryObjectMarkers.Array &&
        !ArrayBuffer.isView(node.value)
      ) {
        this._traverseArray(node);
        continue;
      }

      this._tokenizePrimiives(node);
    }

    this._addMarker(BinaryObjectMarkers.ObjectEnd);
  }

  static _traverseArray(data: TypedNode<any>) {
    this._addMarker(BinaryObjectMarkers.Array);
    //for object array start and end marks
    const array = data.value;

    for (const node of array) {
      if (
        typeof node.value == "object" &&
        !Array.isArray(node.value) &&
        !ArrayBuffer.isView(node.value)
      ) {
        this._traverseObj(node);
        continue;
      }
      if (
        typeof node.value == "object" &&
        Array.isArray(node.value) &&
        !ArrayBuffer.isView(node.value)
      ) {
        this._traverseArray(node);
        continue;
      }
      this._tokenizePrimiives(node);
    }
    this._addMarker(BinaryObjectMarkers.ArrayEnd);
  }

  static _tokenizePrimiives(node: TypedNode<any>) {
    if (node.marker == BinaryObjectMarkers.String) {
      this._addMarker(BinaryObjectMarkers.String);
      this._addToken(BinaryNumberTypes.Uint32, node.value.length);
      for (let i = 0; i < node.value.length; i++) {
        this._addToken(BinaryNumberTypes.Uint8, node.value.charCodeAt(i));
      }
      return;
    }
    if (typeof node.value == "number") {
      this._addMarker(node.marker);
      this._addToken(node.numberType!, node.value);
      return;
    }
    if (typeof node.value == "boolean") {
      this._addMarker(node.marker);
      this._addToken(BinaryNumberTypes.Uint8, node.value ? 0 : 1);
      return;
    }
    if (typeof node.value == "undefined") {
      this._addMarker(BinaryObjectMarkers.Undefined);
      return;
    }
    if (node.marker == BinaryObjectMarkers.ArrayBuffer) {

      this._addMarker(BinaryObjectMarkers.ArrayBuffer);
      const view = new Uint8Array(node.value as ArrayBuffer);
      this._addToken(BinaryNumberTypes.Uint32, view.length);
      for (let i = 0; i < view.length; i++) {
        this._addToken(BinaryNumberTypes.Uint8, view[i]);
      }
      return;
    }
    if (node.marker == BinaryObjectMarkers.TypedArray) {
      this._addMarker(BinaryObjectMarkers.TypedArray);
      this._addToken(BinaryNumberTypes.Uint8, node.listType);
      this._addToken(BinaryNumberTypes.Uint32, node.value.length);
      let array = node.value;
      for (let i = 0; i < array.length; i++) {
        this._addToken(node.listType, array[i]);
      }
    }

    if (node.marker == BinaryObjectMarkers.Json) {
      let json = "";
      if (typeof node.value == "object") {
        json = JSON.stringify(node.value);
      } else {
        json = node.value;
      }
      this._addMarker(BinaryObjectMarkers.Json);
      this._addToken(BinaryNumberTypes.Uint32, json.length);
      for (let i = 0; i < json.length; i++) {
        this._addToken(BinaryNumberTypes.Uint8, json.charCodeAt(i));
      }
      return;
    }
  }

  static _tokenize(node: TypedNode<any>) {
    //start as two bytes for the stand and end tags

    if (
      node.marker == BinaryObjectMarkers.Object &&
      !Array.isArray(node.value)
    ) {
      this._traverseObj(node);
    }
    if (
      node.marker == BinaryObjectMarkers.Array &&
      Array.isArray(node.value)
    ) {
      this._traverseArray(node);
    }
  }

  static toBuffer(data: TypedNode<any>): ArrayBuffer {
    this._tokenize(data);
    const array = Uint8Array.from(this._proto);
    this._proto = [];
    return array.buffer;
  }

  static _addMarker(marker: BinaryObjectMarkers) {
    ByteEncoder.setValue(BinaryNumberTypes.Uint8, marker).addBytes(this._proto);
  }

  static _addToken(type: BinaryNumberTypes, value: number) {
    ByteEncoder.setValue(type, value).addBytes(this._proto);
  }
}
