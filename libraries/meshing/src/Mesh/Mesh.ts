import {
  BinaryNumberTypes,
  TypedArrays,
  TypedArrayClassMap,
} from "@amodx/binary/";
import {
  MeshDefaultAttributes,
  type MeshAttributes,
} from "../MeshData.types.js";
import { Vector3Like } from "@amodx/math";
import { BVHBuilder } from "./BVH/BVHBuilder.js";

export class Mesh {
  indicieIndex = 0;
  attributes: Map<
    string,
    [
      value: number[],
      stride: number,
      dataType: Exclude<
        BinaryNumberTypes,
        BinaryNumberTypes.BigInt | BinaryNumberTypes.BigUint
      >,
    ]
  >;

  minBounds = Vector3Like.Create(Infinity, Infinity, Infinity);
  maxBounds = Vector3Like.Create(-Infinity, -Infinity, -Infinity);

  readonly positions: number[] = [];
  readonly normals: number[] = [];
  readonly indices: number[] = [];

  bvhBuilder: BVHBuilder;

  addNewAABB(
    minX: number,
    minY: number,
    minZ: number,
    maxX: number,
    maxY: number,
    maxZ: number
  ) {
    if (minX < this.minBounds.x ) this.minBounds.x = minX;
    if (minY < this.minBounds.y) this.minBounds.y = minY;
    if (minZ < this.minBounds.z) this.minBounds.z = minZ;
    
    if (maxX > this.maxBounds.x) this.maxBounds.x = maxX;
    if (maxY > this.maxBounds.y ) this.maxBounds.y = maxY;
    if (maxZ > this.maxBounds.z ) this.maxBounds.z = maxZ;

    if (this.bvhBuilder)
      this.bvhBuilder.addAABB(minX, minY, minZ, maxX, maxY, maxZ);
  }

  constructor(public buildBVH?: boolean) {
    if (this.buildBVH) {
      this.bvhBuilder = new BVHBuilder();
    }
    this.attributes = new Map([
      [
        MeshDefaultAttributes.Position,
        [this.positions, 3, BinaryNumberTypes.Float32],
      ],
      [
        MeshDefaultAttributes.Normal,
        [this.normals, 3, BinaryNumberTypes.Float32],
      ],
      [
        MeshDefaultAttributes.Indices,
        [this.indices, 1, BinaryNumberTypes.Uint16],
      ],
    ]);
  }

  clear() {
    this.resetAttributes();
    if (this.bvhBuilder) this.bvhBuilder.clear();
    this.indicieIndex = 0;

    this.minBounds.x = Infinity;
    this.minBounds.y = Infinity;
    this.minBounds.z = Infinity;
    this.maxBounds.x = -Infinity;
    this.maxBounds.y = -Infinity;
    this.maxBounds.z = -Infinity;
  }

  resetAttributes() {
    for (const [key, v] of this.attributes) {
      v[0].length = 0;
    }
    return this;
  }

  getAttribute(id: string) {
    return this.attributes.get(id)![0];
  }

  getMeshData() {
    const arrays: any[] = [];
    const strides: number[] = [];
    const trasnfers: any[] = [];
    for (let [key, [value, stride, type]] of this.attributes) {
      if (key == MeshDefaultAttributes.Indices) {
        if (value.length > 60_000) {
          type = BinaryNumberTypes.Uint32;
        }
      }
      //@ts-ignore
      const newArray: Uint8Array = TypedArrayClassMap[type].from(value);
      arrays.push(newArray);
      strides.push(stride);
      trasnfers.push(newArray.buffer);
    }

    return <[TypedArrays[], ArrayBuffer[], number[]]>[
      arrays,
      trasnfers,
      strides,
    ];
  }

  getAllAttributes(): [MeshAttributes, ArrayBuffer[]] {
    const data: MeshAttributes = [];
    const trasnfers: ArrayBuffer[] = [];
    for (let [key, [value, stride, type]] of this.attributes) {
      if (key == MeshDefaultAttributes.Indices) {
        if (value.length > 60_000) {
          type = BinaryNumberTypes.Uint32;
        }
      }
      //@ts-ignore
      const newArray: Uint8Array = TypedArrayClassMap[type].from(value);
      trasnfers.push(newArray.buffer);
      data.push([key, newArray, stride]);
    }
    return [data, trasnfers];
  }

  getAllAttributesRaw(): [id: string, value: number[], stride: number][] {
    const data: any[] = [];
    for (let [key, [value, stride, type]] of this.attributes) {
      data.push([key, value, stride]);
    }
    return data;
  }
}
