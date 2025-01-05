import { Vector3 } from "./shared";
//https://raw.githubusercontent.com/erichlof/THREE.js-PathTracing-Renderer/gh-pages/js/BVH_Acc_Structure_Iterative_SAH_Builder.js

/* BVH (Bounding Volume Hierarchy) Iterative SAH (Surface Area Heuristic) Builder */
/*
Inspired by: Thanassis Tsiodras (ttsiodras on GitHub)
https://github.com/ttsiodras/renderer-cuda/blob/master/src/BVH.cpp
Edited and Ported from C++ to Javascript by: Erich Loftis (erichlof on GitHub)
https://github.com/erichlof/THREE.js-PathTracing-Renderer
*/

export class BVH_FlatNode {
  constructor(
    public idSelf = 0,
    public idPrimitive = -1,
    public idRightChild = 0,
    public idParent = 0,
    public minCorner = new Vector3(),
    public maxCorner = new Vector3()
  ) {}
}

// Global variables
let stackptr: number = 0;
let buildnodes: BVH_FlatNode[] = [];
let leftWorkLists: Uint32Array[] = [];
let rightWorkLists: Uint32Array[] = [];
let parentList: number[] = [];
let currentList: Uint32Array | undefined;
let aabb_array_copy: Float32Array;

let bestSplit: number | null = null;
let bestAxis: number | null = null;
let leftWorkCount: number = 0;
let rightWorkCount: number = 0;
let bestSplitHasBeenFound: boolean = false;

let currentMinCorner: Vector3 = new Vector3();
let currentMaxCorner: Vector3 = new Vector3();
let testMinCorner: Vector3 = new Vector3();
let testMaxCorner: Vector3 = new Vector3();
let testCentroid: Vector3 = new Vector3();
let currentCentroid: Vector3 = new Vector3();
let minCentroid: Vector3 = new Vector3();
let maxCentroid: Vector3 = new Vector3();
let centroidAverage: Vector3 = new Vector3();
let spatialAverage: Vector3 = new Vector3();
let LBottomCorner: Vector3 = new Vector3();
let LTopCorner: Vector3 = new Vector3();
let RBottomCorner: Vector3 = new Vector3();
let RTopCorner: Vector3 = new Vector3();

let k: number,
  value: number,
  side0: number,
  side1: number,
  side2: number,
  minCost: number,
  testSplit: number,
  testStep: number;
let countLeft: number, countRight: number;
let currentAxis: number,
  longestAxis: number,
  mediumAxis: number,
  shortestAxis: number;
let lside0: number,
  lside1: number,
  lside2: number,
  rside0: number,
  rside1: number,
  rside2: number;
let surfaceLeft: number, surfaceRight: number, totalCost: number;

const numBins: number = 4; // must be 2 or higher for the BVH to work properly

/**
 * Creates a new BVH node.
 */
function BVH_Create_Node(
  workList: Uint32Array,
  idParent: number,
  isRightBranch: boolean
): void {
  // Reset flag
  bestSplitHasBeenFound = false;

  // Re-initialize bounding box extents
  currentMinCorner.set(Infinity, Infinity, Infinity);
  currentMaxCorner.set(-Infinity, -Infinity, -Infinity);

  if (workList.length < 1) {
    // Should never happen, but just in case...
    return;
  } else if (workList.length === 1) {
    // Create a leaf node if there's only one primitive
    k = workList[0];
    const flatLeafNode = new BVH_FlatNode();
    flatLeafNode.idSelf = buildnodes.length;
    flatLeafNode.idPrimitive = k; // ID of the primitive (e.g., triangle)
    flatLeafNode.idRightChild = -1; // Leaf nodes do not have children
    flatLeafNode.idParent = idParent;
    flatLeafNode.minCorner.set(
      aabb_array_copy[9 * k + 0],
      aabb_array_copy[9 * k + 1],
      aabb_array_copy[9 * k + 2]
    );
    flatLeafNode.maxCorner.set(
      aabb_array_copy[9 * k + 3],
      aabb_array_copy[9 * k + 4],
      aabb_array_copy[9 * k + 5]
    );
    buildnodes.push(flatLeafNode);

    // If this is a right branch, link it to its parent
    if (isRightBranch) {
      buildnodes[idParent].idRightChild = flatLeafNode.idSelf;
    }

    return;
  } else if (workList.length === 2) {
    // If there are two primitives, create one inner node and two leaf nodes
    for (let i = 0; i < 2; i++) {
      k = workList[i];
      testMinCorner.set(
        aabb_array_copy[9 * k + 0],
        aabb_array_copy[9 * k + 1],
        aabb_array_copy[9 * k + 2]
      );
      testMaxCorner.set(
        aabb_array_copy[9 * k + 3],
        aabb_array_copy[9 * k + 4],
        aabb_array_copy[9 * k + 5]
      );
      currentMinCorner.min(testMinCorner);
      currentMaxCorner.max(testMaxCorner);
    }

    // Create inner node
    const flatnode0 = new BVH_FlatNode();
    flatnode0.idSelf = buildnodes.length;
    flatnode0.idPrimitive = -1; // Inner node indicator
    flatnode0.idRightChild = buildnodes.length + 2;
    flatnode0.idParent = idParent;
    flatnode0.minCorner.copy(currentMinCorner);
    flatnode0.maxCorner.copy(currentMaxCorner);
    buildnodes.push(flatnode0);

    // Link to parent if it's a right branch
    if (isRightBranch) {
      buildnodes[idParent].idRightChild = flatnode0.idSelf;
    }

    // Create 'left' leaf node
    k = workList[0];
    const flatnode1 = new BVH_FlatNode();
    flatnode1.idSelf = buildnodes.length;
    flatnode1.idPrimitive = k;
    flatnode1.idRightChild = -1;
    flatnode1.idParent = flatnode0.idSelf;
    flatnode1.minCorner.set(
      aabb_array_copy[9 * k + 0],
      aabb_array_copy[9 * k + 1],
      aabb_array_copy[9 * k + 2]
    );
    flatnode1.maxCorner.set(
      aabb_array_copy[9 * k + 3],
      aabb_array_copy[9 * k + 4],
      aabb_array_copy[9 * k + 5]
    );
    buildnodes.push(flatnode1);

    // Create 'right' leaf node
    k = workList[1];
    const flatnode2 = new BVH_FlatNode();
    flatnode2.idSelf = buildnodes.length;
    flatnode2.idPrimitive = k;
    flatnode2.idRightChild = -1;
    flatnode2.idParent = flatnode0.idSelf;
    flatnode2.minCorner.set(
      aabb_array_copy[9 * k + 0],
      aabb_array_copy[9 * k + 1],
      aabb_array_copy[9 * k + 2]
    );
    flatnode2.maxCorner.set(
      aabb_array_copy[9 * k + 3],
      aabb_array_copy[9 * k + 4],
      aabb_array_copy[9 * k + 5]
    );
    buildnodes.push(flatnode2);

    return;
  } else {
    // More than two primitives: create an inner node and attempt to split
    // Re-initialize min/max centroids
    minCentroid.set(Infinity, Infinity, Infinity);
    maxCentroid.set(-Infinity, -Infinity, -Infinity);
    centroidAverage.set(0, 0, 0);

    // Construct/grow bounding box and calculate centroid averages
    for (let i = 0; i < workList.length; i++) {
      k = workList[i];

      testMinCorner.set(
        aabb_array_copy[9 * k + 0],
        aabb_array_copy[9 * k + 1],
        aabb_array_copy[9 * k + 2]
      );
      testMaxCorner.set(
        aabb_array_copy[9 * k + 3],
        aabb_array_copy[9 * k + 4],
        aabb_array_copy[9 * k + 5]
      );
      currentCentroid.set(
        aabb_array_copy[9 * k + 6],
        aabb_array_copy[9 * k + 7],
        aabb_array_copy[9 * k + 8]
      );

      currentMinCorner.min(testMinCorner);
      currentMaxCorner.max(testMaxCorner);

      minCentroid.min(currentCentroid);
      maxCentroid.max(currentCentroid);

      centroidAverage.add(currentCentroid); // Sum all centroid positions
    }
    // Calculate average centroid
    centroidAverage.divideScalar(workList.length);

    // Create inner node representing the bounding box
    const flatnode = new BVH_FlatNode();
    flatnode.idSelf = buildnodes.length;
    flatnode.idPrimitive = -1; // Inner node indicator
    flatnode.idRightChild = 0; // To be set later
    flatnode.idParent = idParent;
    flatnode.minCorner.copy(currentMinCorner);
    flatnode.maxCorner.copy(currentMaxCorner);
    buildnodes.push(flatnode);

    // Link to parent if it's a right branch
    if (isRightBranch) {
      buildnodes[idParent].idRightChild = flatnode.idSelf;
    }

    // Begin split plane determination using the Surface Area Heuristic (SAH)
    side0 = currentMaxCorner.x - currentMinCorner.x; // X-axis length
    side1 = currentMaxCorner.y - currentMinCorner.y; // Y-axis length
    side2 = currentMaxCorner.z - currentMinCorner.z; // Z-axis length

    minCost = workList.length * (side0 * side1 + side1 * side2 + side2 * side0);

    // Reset bestSplit and bestAxis
    bestSplit = null;
    bestAxis = null;

    // Try all 3 axes: X, Y, Z
    for (let axis = 0; axis < 3; axis++) {
      // Determine initial split position and step
      if (axis === 0) {
        testSplit = currentMinCorner.x;
        testStep = side0 / numBins;
      } else if (axis === 1) {
        testSplit = currentMinCorner.y;
        testStep = side1 / numBins;
      } else {
        // axis === 2
        testSplit = currentMinCorner.z;
        testStep = side2 / numBins;
      }

      for (let partition = 1; partition < numBins; partition++) {
        testSplit += testStep;

        // Initialize potential left and right bounding boxes
        LBottomCorner.set(Infinity, Infinity, Infinity);
        LTopCorner.set(-Infinity, -Infinity, -Infinity);
        RBottomCorner.set(Infinity, Infinity, Infinity);
        RTopCorner.set(-Infinity, -Infinity, -Infinity);

        // Reset counters
        countLeft = 0;
        countRight = 0;

        // Allocate triangle AABBs based on centroid positions
        for (let i = 0; i < workList.length; i++) {
          k = workList[i];
          testMinCorner.set(
            aabb_array_copy[9 * k + 0],
            aabb_array_copy[9 * k + 1],
            aabb_array_copy[9 * k + 2]
          );
          testMaxCorner.set(
            aabb_array_copy[9 * k + 3],
            aabb_array_copy[9 * k + 4],
            aabb_array_copy[9 * k + 5]
          );
          testCentroid.set(
            aabb_array_copy[9 * k + 6],
            aabb_array_copy[9 * k + 7],
            aabb_array_copy[9 * k + 8]
          );

          // Get bbox center along the current axis
          value =
            axis === 0
              ? testCentroid.x
              : axis === 1
                ? testCentroid.y
                : testCentroid.z;

          if (value < testSplit) {
            // Assign to left bounding box
            LBottomCorner.min(testMinCorner);
            LTopCorner.max(testMaxCorner);
            countLeft++;
          } else {
            // Assign to right bounding box
            RBottomCorner.min(testMinCorner);
            RTopCorner.max(testMaxCorner);
            countRight++;
          }
        }

        // Skip invalid partitions
        if (countLeft < 1 || countRight < 1) continue;

        // Calculate Surface Area for left and right bounding boxes
        lside0 = LTopCorner.x - LBottomCorner.x;
        lside1 = LTopCorner.y - LBottomCorner.y;
        lside2 = LTopCorner.z - LBottomCorner.z;

        rside0 = RTopCorner.x - RBottomCorner.x;
        rside1 = RTopCorner.y - RBottomCorner.y;
        rside2 = RTopCorner.z - RBottomCorner.z;

        surfaceLeft = lside0 * lside1 + lside1 * lside2 + lside2 * lside0;
        surfaceRight = rside0 * rside1 + rside1 * rside2 + rside2 * rside0;

        // Calculate total cost using SAH
        totalCost = surfaceLeft * countLeft + surfaceRight * countRight;

        // Update best split if a cheaper cost is found
        if (totalCost < minCost) {
          minCost = totalCost;
          bestSplit = testSplit;
          bestAxis = axis;
          bestSplitHasBeenFound = true;
        }
      }
    }

    // If SAH found a valid split, proceed
    if (bestSplitHasBeenFound && bestSplit !== null && bestAxis !== null) {
      // Allocate left and right work lists based on the best split
      leftWorkLists[stackptr] = new Uint32Array(leftWorkCount);
      rightWorkLists[stackptr] = new Uint32Array(rightWorkCount);

      leftWorkCount = 0;
      rightWorkCount = 0;

      for (let i = 0; i < workList.length; i++) {
        k = workList[i];
        testCentroid.set(
          aabb_array_copy[9 * k + 6],
          aabb_array_copy[9 * k + 7],
          aabb_array_copy[9 * k + 8]
        );

        value =
          bestAxis === 0
            ? testCentroid.x
            : bestAxis === 1
              ? testCentroid.y
              : testCentroid.z;

        if (value < bestSplit) {
          leftWorkLists[stackptr][leftWorkCount++] = k;
        } else {
          rightWorkLists[stackptr][rightWorkCount++] = k;
        }
      }

      return; // Successful split
    }

    // If SAH failed, attempt Object Median strategy
    if (!bestSplitHasBeenFound) {
      // Determine the longest, medium, and shortest axes
      if (side0 >= side1 && side0 >= side2) {
        longestAxis = 0;
        if (side1 >= side2) {
          mediumAxis = 1;
          shortestAxis = 2;
        } else {
          mediumAxis = 2;
          shortestAxis = 1;
        }
      } else if (side1 >= side0 && side1 >= side2) {
        longestAxis = 1;
        if (side0 >= side2) {
          mediumAxis = 0;
          shortestAxis = 2;
        } else {
          mediumAxis = 2;
          shortestAxis = 0;
        }
      } else {
        // side2 >= side0 && side2 >= side1
        longestAxis = 2;
        if (side0 >= side1) {
          mediumAxis = 0;
          shortestAxis = 1;
        } else {
          mediumAxis = 1;
          shortestAxis = 0;
        }
      }

      // Try longest axis first
      currentAxis = longestAxis;
      leftWorkCount = 0;
      rightWorkCount = 0;

      // Count how many primitives go to left and right
      for (let i = 0; i < workList.length; i++) {
        k = workList[i];
        testCentroid.set(
          aabb_array_copy[9 * k + 6],
          aabb_array_copy[9 * k + 7],
          aabb_array_copy[9 * k + 8]
        );

        // Get bbox center along the current axis
        value =
          currentAxis === 0
            ? testCentroid.x
            : currentAxis === 1
              ? testCentroid.y
              : testCentroid.z;

        if (value < (centroidAverage as any)[currentAxis]) {
          leftWorkCount++;
        } else {
          rightWorkCount++;
        }
      }

      if (leftWorkCount > 0 && rightWorkCount > 0) {
        bestSplit = (centroidAverage as any)[currentAxis];
        bestAxis = currentAxis;
        bestSplitHasBeenFound = true;
      }

      // If longest axis failed, try medium axis
      if (!bestSplitHasBeenFound) {
        currentAxis = mediumAxis;
        leftWorkCount = 0;
        rightWorkCount = 0;

        for (let i = 0; i < workList.length; i++) {
          k = workList[i];
          testCentroid.set(
            aabb_array_copy[9 * k + 6],
            aabb_array_copy[9 * k + 7],
            aabb_array_copy[9 * k + 8]
          );

          value =
            currentAxis === 0
              ? testCentroid.x
              : currentAxis === 1
                ? testCentroid.y
                : testCentroid.z;

          if (value < (centroidAverage as any)[currentAxis]) {
            leftWorkCount++;
          } else {
            rightWorkCount++;
          }
        }

        if (leftWorkCount > 0 && rightWorkCount > 0) {
          bestSplit = (centroidAverage as any)[currentAxis];
          bestAxis = currentAxis;
          bestSplitHasBeenFound = true;
        }
      }

      // If medium axis failed, try shortest axis
      if (!bestSplitHasBeenFound) {
        currentAxis = shortestAxis;
        leftWorkCount = 0;
        rightWorkCount = 0;

        for (let i = 0; i < workList.length; i++) {
          k = workList[i];
          testCentroid.set(
            aabb_array_copy[9 * k + 6],
            aabb_array_copy[9 * k + 7],
            aabb_array_copy[9 * k + 8]
          );

          value =
            currentAxis === 0
              ? testCentroid.x
              : currentAxis === 1
                ? testCentroid.y
                : testCentroid.z;

          if (value < (centroidAverage as any)[currentAxis]) {
            leftWorkCount++;
          } else {
            rightWorkCount++;
          }
        }

        if (leftWorkCount > 0 && rightWorkCount > 0) {
          bestSplit = (centroidAverage as any)[currentAxis];
          bestAxis = currentAxis;
          bestSplitHasBeenFound = true;
        }
      }
    }

    // If Object Median strategy failed, distribute primitives manually
    if (!bestSplitHasBeenFound) {
      leftWorkCount = 0;
      rightWorkCount = 0;

      for (let i = 0; i < workList.length; i++) {
        if (i % 2 === 0) {
          leftWorkCount++;
        } else {
          rightWorkCount++;
        }
      }

      leftWorkLists[stackptr] = new Uint32Array(leftWorkCount);
      rightWorkLists[stackptr] = new Uint32Array(rightWorkCount);

      leftWorkCount = 0;
      rightWorkCount = 0;

      for (let i = 0; i < workList.length; i++) {
        k = workList[i];
        if (i % 2 === 0) {
          leftWorkLists[stackptr][leftWorkCount++] = k;
        } else {
          rightWorkLists[stackptr][rightWorkCount++] = k;
        }
      }

      return; // Return early after manual distribution
    }

    // If a valid split was found, distribute the primitives
    leftWorkCount = 0;
    rightWorkCount = 0;

    for (let i = 0; i < workList.length; i++) {
      k = workList[i];
      testCentroid.set(
        aabb_array_copy[9 * k + 6],
        aabb_array_copy[9 * k + 7],
        aabb_array_copy[9 * k + 8]
      );

      // Get bbox center along the best axis
      value =
        bestAxis === 0
          ? testCentroid.x
          : bestAxis === 1
            ? testCentroid.y
            : testCentroid.z;

      if (value < (bestSplit as number)) {
        leftWorkLists[stackptr][leftWorkCount++] = k;
      } else {
        rightWorkLists[stackptr][rightWorkCount++] = k;
      }
    }
  }
}
/**
 * Builds the BVH tree iteratively.
 * @param workList - Initial list of primitive indices.
 * @param aabb_array - Array containing AABB data for primitives.
 * @returns The modified AABB array containing BVH node data.
 */
export default function BVH_Build_Iterative(
  workList: Uint32Array,
  aabb_array: Float32Array
): Float32Array {
  currentList = workList;
  // Create a copy of the AABB array for internal use
  aabb_array_copy = new Float32Array(aabb_array);

  // Reset builder arrays
  buildnodes = [];
  leftWorkLists = [];
  rightWorkLists = [];
  parentList = [];

  // Initialize the stack pointer
  stackptr = 0;

  // Start with the root node (no parent)
  parentList.push(-1);
  BVH_Create_Node(currentList, -1, false); // Build root node

  // Iteratively build the BVH tree
  while (stackptr > -1) {
    // Process the left side
    currentList = leftWorkLists[stackptr];

    if (currentList !== undefined) {
      (leftWorkLists as any)[stackptr] = undefined; // Mark as processed
      stackptr++;

      parentList.push(buildnodes.length - 1);

      // Build the left child node
      BVH_Create_Node(currentList, buildnodes.length - 1, false);
    } else {
      // Process the right side
      currentList = rightWorkLists[stackptr];

      if (currentList !== undefined) {
        (rightWorkLists as any)[stackptr] = undefined; // Mark as processed
        stackptr++;

        // Build the right child node
        const parentId = parentList.pop();
        if (parentId !== undefined) {
          BVH_Create_Node(currentList, parentId, true);
        }
      } else {
        stackptr--;
      }
    }
  }

  // Copy the built nodes into the AABB array
  for (let n = 0; n < buildnodes.length; n++) {
    // Slot 0
    aabb_array[8 * n + 0] = buildnodes[n].idPrimitive; // r or x component
    aabb_array[8 * n + 1] = buildnodes[n].minCorner.x; // g or y component
    aabb_array[8 * n + 2] = buildnodes[n].minCorner.y; // b or z component
    aabb_array[8 * n + 3] = buildnodes[n].minCorner.z; // a or w component

    // Slot 1
    aabb_array[8 * n + 4] = buildnodes[n].idRightChild; // r or x component
    aabb_array[8 * n + 5] = buildnodes[n].maxCorner.x; // g or y component
    aabb_array[8 * n + 6] = buildnodes[n].maxCorner.y; // b or z component
    aabb_array[8 * n + 7] = buildnodes[n].maxCorner.z; // a or w component
  }

  return aabb_array;
}
