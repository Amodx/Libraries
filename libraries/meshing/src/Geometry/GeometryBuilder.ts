import type { Vector3Like, Vec3Array } from "@amodx/math";

import { GeometryNormals } from "./GeometryNormals.js";
import { MesherDataTool } from "../Tools/MesherDataTools.js";
import { Quad } from "../Classes/Quad";

export class GeometryBuilder {
  static addTriangle(
    tool: MesherDataTool,
    origin: Vector3Like,
    [[p1x, p1y, p1z], [p2x, p2y, p2z], [p3x, p3y, p3z]]: [
      Vec3Array,
      Vec3Array,
      Vec3Array
    ]
  ) {
    const { positions, normals, indices } = tool;
    const baseIndex = tool.indicieIndex;
    let posIndex = tool.positions.length;
    let normIndex = tool.normals.length;
    let indIndex = tool.indices.length;

    positions[posIndex++] = origin.x + p1x;
    positions[posIndex++] = origin.y + p1y;
    positions[posIndex++] = origin.z + p1z;
    positions[posIndex++] = origin.x + p2x;
    positions[posIndex++] = origin.y + p2y;
    positions[posIndex++] = origin.z + p2z;
    positions[posIndex++] = origin.x + p3x;
    positions[posIndex++] = origin.y + p3y;
    positions[posIndex++] = origin.z + p3z;

    const triangleNormals = GeometryNormals.getTriangleNormals(
      [p1x, p1y, p1z],
      [p2x, p2y, p2z],
      [p3x, p3y, p3z]
    );

    for (let i = 0; i < 3; i++) {
      normals[normIndex++] = triangleNormals[0];
      normals[normIndex++] = triangleNormals[1];
      normals[normIndex++] = triangleNormals[2];
    }

    indices[indIndex++] = baseIndex;
    indices[indIndex++] = baseIndex + 1;
    indices[indIndex++] = baseIndex + 2;

    tool.positions.length = posIndex;
    tool.normals.length = normIndex;
    tool.indices.length = indIndex;
    tool.indicieIndex += 3;
  }

  static addQuad(tool: MesherDataTool, origin: Vector3Like, quad: Quad) {
    const { positions, normals, indices } = tool;
    const baseIndex = tool.indicieIndex;
    let posIndex = tool.positions.length;
    let normIndex = tool.normals.length;
    let indIndex = tool.indices.length;

    const topRight = quad.positions.vertices[0];
    const topLeft = quad.positions.vertices[1];
    const bottomLeft = quad.positions.vertices[2];
    const bottomRight = quad.positions.vertices[3];

    let normalMulti = 1;

    const { orientation: orin, flip } = quad;

    let orientation = orin;
    if (orientation) {
      normalMulti = -1;
    }

    let sides = quad.doubleSided ? 2 : 1;
    while (sides--) {
      if (!flip) {
        positions[posIndex++] = topRight.x + origin.x;
        positions[posIndex++] = topRight.y + origin.y;
        positions[posIndex++] = topRight.z + origin.z;
        positions[posIndex++] = topLeft.x + origin.x;
        positions[posIndex++] = topLeft.y + origin.y;
        positions[posIndex++] = topLeft.z + origin.z;
        positions[posIndex++] = bottomLeft.x + origin.x;
        positions[posIndex++] = bottomLeft.y + origin.y;
        positions[posIndex++] = bottomLeft.z + origin.z;
        positions[posIndex++] = bottomRight.x + origin.x;
        positions[posIndex++] = bottomRight.y + origin.y;
        positions[posIndex++] = bottomRight.z + origin.z;
      } else {
        positions[posIndex++] = topLeft.x + origin.x;
        positions[posIndex++] = topLeft.y + origin.y;
        positions[posIndex++] = topLeft.z + origin.z;
        positions[posIndex++] = topRight.x + origin.x;
        positions[posIndex++] = topRight.y + origin.y;
        positions[posIndex++] = topRight.z + origin.z;
        positions[posIndex++] = bottomRight.x + origin.x;
        positions[posIndex++] = bottomRight.y + origin.y;
        positions[posIndex++] = bottomRight.z + origin.z;
        positions[posIndex++] = bottomLeft.x + origin.x;
        positions[posIndex++] = bottomLeft.y + origin.y;
        positions[posIndex++] = bottomLeft.z + origin.z;
      }

      if (!orientation && !flip) {
        indices[indIndex++] = baseIndex;
        indices[indIndex++] = baseIndex + 1;
        indices[indIndex++] = baseIndex + 2;
        indices[indIndex++] = baseIndex + 2;
        indices[indIndex++] = baseIndex + 3;
        indices[indIndex++] = baseIndex;
      } else if (!orientation && flip) {
        indices[indIndex++] = baseIndex;
        indices[indIndex++] = baseIndex + 3;
        indices[indIndex++] = baseIndex + 2;
        indices[indIndex++] = baseIndex + 2;
        indices[indIndex++] = baseIndex + 1;
        indices[indIndex++] = baseIndex;
      }

      if (orientation && !flip) {
        indices[indIndex++] = baseIndex;
        indices[indIndex++] = baseIndex + 3;
        indices[indIndex++] = baseIndex + 2;
        indices[indIndex++] = baseIndex + 2;
        indices[indIndex++] = baseIndex + 1;
        indices[indIndex++] = baseIndex;
      } else if (orientation && flip) {
        indices[indIndex++] = baseIndex;
        indices[indIndex++] = baseIndex + 1;
        indices[indIndex++] = baseIndex + 2;
        indices[indIndex++] = baseIndex + 2;
        indices[indIndex++] = baseIndex + 3;
        indices[indIndex++] = baseIndex;
      }
      {
        const topRight = quad.normals.vertices[0];
        const topLeft = quad.normals.vertices[1];
        const bottomLeft = quad.normals.vertices[2];
        const bottomRight = quad.normals.vertices[3];

        normals[normIndex++] = topRight.x * normalMulti;
        normals[normIndex++] = topRight.y * normalMulti;
        normals[normIndex++] = topRight.z * normalMulti;
        normals[normIndex++] = topLeft.x * normalMulti;
        normals[normIndex++] = topLeft.y * normalMulti;
        normals[normIndex++] = topLeft.z * normalMulti;
        normals[normIndex++] = bottomLeft.x * normalMulti;
        normals[normIndex++] = bottomLeft.y * normalMulti;
        normals[normIndex++] = bottomLeft.z * normalMulti;
        normals[normIndex++] = bottomRight.x * normalMulti;
        normals[normIndex++] = bottomRight.y * normalMulti;
        normals[normIndex++] = bottomRight.z * normalMulti;
      }
      tool.indicieIndex += 4;

      orientation = orientation == 1 ? 0 : 1;
      normalMulti *= -1;
    }

    tool.positions.length = posIndex;
    tool.normals.length = normIndex;
    tool.indices.length = indIndex;
  }

  
}
