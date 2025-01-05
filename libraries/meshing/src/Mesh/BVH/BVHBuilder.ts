import BuildFastBVH from "./Functions/BuildFastBVH";
import BuildSAHBVH from "./Functions/BuildSAHBVH";

export class BVHBuilder {
  workList: number[] = [];
  nodes: number[] = [];

  _count = 0;
  addAABB(
    minX: number,
    minY: number,
    minZ: number,
    maxX: number,
    maxY: number,
    maxZ: number
  ) {
    let nodeStartIndex = this.nodes.length;
    //min
    this.nodes[nodeStartIndex++] = minX;
    this.nodes[nodeStartIndex++] = minY;
    this.nodes[nodeStartIndex++] = minZ;
    //max
    this.nodes[nodeStartIndex++] = maxX;
    this.nodes[nodeStartIndex++] = maxY;
    this.nodes[nodeStartIndex++] = maxZ;
    //center
    this.nodes[nodeStartIndex++] = (minX + maxX) / 2;
    this.nodes[nodeStartIndex++] = (minY + maxY) / 2;
    this.nodes[nodeStartIndex++] = (minZ + maxZ) / 2;

    this.nodes.length = nodeStartIndex;

    this.workList[this.workList.length] = this._count >>> 0;

    this.workList.length += 1;
    this._count++;
  }

  clear() {
    this.workList.length = 0;
    this.nodes.length = 0;
    this._count = 0;
  }

  buildFast() {
    console.warn("build svh fast");

    const nodes = BuildFastBVH(
      new Uint32Array(this.workList),
      new Float32Array(this.nodes) as any as Float32Array,
      this.nodes
    );

    console.log(
      this.nodes.length,
      nodes.length,
      this.nodes.length / 9,
      nodes.length / 9
    );

    return nodes;
  }
  buildSAH() {
    return BuildSAHBVH(
      new Uint32Array(this.workList) as any as Uint32Array,
      new Float32Array(this.nodes) as any as Float32Array
    );
  }
}
