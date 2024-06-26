import { QuadVerticies } from "../Geometry.types.js";
import { Vector3Like, Vector2Like } from "@amodx/math";
export class QuadVertexData<Data> {
  constructor(public vertices: Record<QuadVerticies, Data>) {}

  getAsArray() {
    return [
      this.vertices[1],
      this.vertices[2],
      this.vertices[3],
      this.vertices[4],
    ];
  }

  setVertex(vertex: QuadVerticies, value: Data) {
    this.vertices[vertex] = value;
  }

  getVertex(vertex: QuadVerticies) {
    return this.vertices[vertex];
  }

  setAll(value: Data) {
    this.vertices[1] = value;
    this.vertices[2] = value;
    this.vertices[3] = value;
    this.vertices[4] = value;
  }

  set(v1: Data, v2: Data, v3: Data, v4: Data) {
    this.vertices[1] = v1;
    this.vertices[2] = v2;
    this.vertices[3] = v3;
    this.vertices[4] = v4;
  }

  isEqualTo(v1: Data, v2: Data, v3: Data, v4: Data) {
    if (this.vertices[1] != v1) return false;
    if (this.vertices[2] != v2) return false;
    if (this.vertices[3] != v3) return false;
    if (this.vertices[4] != v4) return false;
    return true;
  }

  isAllEqualTo(value: Data) {
    if (this.vertices[1] != value) return false;
    if (this.vertices[2] != value) return false;
    if (this.vertices[3] != value) return false;
    if (this.vertices[4] != value) return false;
    return true;
  }

  forEach(run: (vertex: QuadVerticies, value: Data) => void) {
    run(1, this.vertices[1]);
    run(2, this.vertices[2]);
    run(3, this.vertices[3]);
    run(4, this.vertices[4]);
  }

  clone() {
    return new QuadVertexData<Data>({
      [QuadVerticies.TopRight]: structuredClone(
        this.vertices[QuadVerticies.TopRight]
      ),
      [QuadVerticies.TopLeft]: structuredClone(
        this.vertices[QuadVerticies.TopLeft]
      ),
      [QuadVerticies.BottomLeft]: structuredClone(
        this.vertices[QuadVerticies.BottomLeft]
      ),
      [QuadVerticies.BottomRight]: structuredClone(
        this.vertices[QuadVerticies.BottomRight]
      ),
    });
  }
}

export class QuadVector3VertexData extends QuadVertexData<Vector3Like> {
  constructor(
    public vertices: Record<QuadVerticies, Vector3Like> = {
      [QuadVerticies.TopRight]: Vector3Like.Create(),
      [QuadVerticies.TopLeft]: Vector3Like.Create(),
      [QuadVerticies.BottomLeft]: Vector3Like.Create(),
      [QuadVerticies.BottomRight]: Vector3Like.Create(),
    }
  ) {
    super(vertices);
  }

  setFromQuadData(vertexData: QuadVertexData<Vector3Like>) {
    Vector3Like.Copy(this.vertices[1], vertexData.vertices[1]);
    Vector3Like.Copy(this.vertices[2], vertexData.vertices[2]);
    Vector3Like.Copy(this.vertices[3], vertexData.vertices[3]);
    Vector3Like.Copy(this.vertices[4], vertexData.vertices[4]);
  }

  addToVertex(vertex: QuadVerticies, value: Vector3Like) {
    Vector3Like.AddInPlace(this.vertices[vertex], value);
  }

  subtractFromVertex(vertex: QuadVerticies, value: Vector3Like) {
    Vector3Like.SubtractInPlace(this.vertices[vertex], value);
  }

  addAll(value: Vector3Like) {
    this.addToVertex(QuadVerticies.TopRight, value);
    this.addToVertex(QuadVerticies.TopLeft, value);
    this.addToVertex(QuadVerticies.BottomLeft, value);
    this.addToVertex(QuadVerticies.BottomRight, value);
  }

  subtractAll(value: Vector3Like) {
    this.subtractFromVertex(QuadVerticies.TopRight, value);
    this.subtractFromVertex(QuadVerticies.TopLeft, value);
    this.subtractFromVertex(QuadVerticies.BottomLeft, value);
    this.subtractFromVertex(QuadVerticies.BottomRight, value);
  }

  isEqualTo(
    v1: Vector3Like,
    v2: Vector3Like,
    v3: Vector3Like,
    v4: Vector3Like
  ) {
    return (
      Vector3Like.Equals(this.vertices[QuadVerticies.TopRight], v1) &&
      Vector3Like.Equals(this.vertices[QuadVerticies.TopLeft], v2) &&
      Vector3Like.Equals(this.vertices[QuadVerticies.BottomLeft], v3) &&
      Vector3Like.Equals(this.vertices[QuadVerticies.BottomRight], v4)
    );
  }

  isAllEqualTo(v1: Vector3Like) {
    return (
      Vector3Like.Equals(this.vertices[QuadVerticies.TopRight], v1) &&
      Vector3Like.Equals(this.vertices[QuadVerticies.TopLeft], v1) &&
      Vector3Like.Equals(this.vertices[QuadVerticies.BottomLeft], v1) &&
      Vector3Like.Equals(this.vertices[QuadVerticies.BottomRight], v1)
    );
  }
  clone() {
    return new QuadVector3VertexData({
      [QuadVerticies.TopRight]: Vector3Like.Clone(
        this.vertices[QuadVerticies.TopRight]
      ),
      [QuadVerticies.TopLeft]: Vector3Like.Clone(
        this.vertices[QuadVerticies.TopLeft]
      ),
      [QuadVerticies.BottomLeft]: Vector3Like.Clone(
        this.vertices[QuadVerticies.BottomLeft]
      ),
      [QuadVerticies.BottomRight]: Vector3Like.Clone(
        this.vertices[QuadVerticies.BottomRight]
      ),
    });
  }
}

export class QuadVector2VertexData extends QuadVertexData<Vector2Like> {
  constructor(
    public vertices: Record<QuadVerticies, Vector2Like> = {
      [QuadVerticies.TopRight]: Vector2Like.Create(),
      [QuadVerticies.TopLeft]: Vector2Like.Create(),
      [QuadVerticies.BottomLeft]: Vector2Like.Create(),
      [QuadVerticies.BottomRight]: Vector2Like.Create(),
    }
  ) {
    super(vertices);
  }

  setFromQuadData(vertexData: QuadVertexData<Vector3Like>) {
    Vector2Like.Copy(this.vertices[1], vertexData.vertices[1]);
    Vector2Like.Copy(this.vertices[2], vertexData.vertices[2]);
    Vector2Like.Copy(this.vertices[3], vertexData.vertices[3]);
    Vector2Like.Copy(this.vertices[4], vertexData.vertices[4]);
  }

  addToVertex(vertex: QuadVerticies, value: Vector2Like) {
    Vector2Like.AddInPlace(this.vertices[vertex], value);
  }

  subtractFromVertex(vertex: QuadVerticies, value: Vector2Like) {
    Vector2Like.SubtractInPlace(this.vertices[vertex], value);
  }

  addAll(value: Vector2Like) {
    this.addToVertex(QuadVerticies.TopRight, value);
    this.addToVertex(QuadVerticies.TopLeft, value);
    this.addToVertex(QuadVerticies.BottomLeft, value);
    this.addToVertex(QuadVerticies.BottomRight, value);
  }

  subtractAll(value: Vector2Like) {
    this.subtractFromVertex(QuadVerticies.TopRight, value);
    this.subtractFromVertex(QuadVerticies.TopLeft, value);
    this.subtractFromVertex(QuadVerticies.BottomLeft, value);
    this.subtractFromVertex(QuadVerticies.BottomRight, value);
  }

  isEqualTo(
    v1: Vector2Like,
    v2: Vector2Like,
    v3: Vector2Like,
    v4: Vector2Like
  ) {
    return (
      Vector2Like.Equals(this.vertices[QuadVerticies.TopRight], v1) &&
      Vector2Like.Equals(this.vertices[QuadVerticies.TopLeft], v2) &&
      Vector2Like.Equals(this.vertices[QuadVerticies.BottomLeft], v3) &&
      Vector2Like.Equals(this.vertices[QuadVerticies.BottomRight], v4)
    );
  }
  isAllEqualTo(v1: Vector2Like) {
    return (
      Vector2Like.Equals(this.vertices[QuadVerticies.TopRight], v1) &&
      Vector2Like.Equals(this.vertices[QuadVerticies.TopLeft], v1) &&
      Vector2Like.Equals(this.vertices[QuadVerticies.BottomLeft], v1) &&
      Vector2Like.Equals(this.vertices[QuadVerticies.BottomRight], v1)
    );
  }
  clone() {
    return new QuadVector2VertexData({
      [QuadVerticies.TopRight]: Vector2Like.Clone(
        this.vertices[QuadVerticies.TopRight]
      ),
      [QuadVerticies.TopLeft]: Vector2Like.Clone(
        this.vertices[QuadVerticies.TopLeft]
      ),
      [QuadVerticies.BottomLeft]: Vector2Like.Clone(
        this.vertices[QuadVerticies.BottomLeft]
      ),
      [QuadVerticies.BottomRight]: Vector2Like.Clone(
        this.vertices[QuadVerticies.BottomRight]
      ),
    });
  }
}

export class QuadScalarVertexData extends QuadVertexData<number> {
  constructor(
    public vertices: Record<QuadVerticies, number> = {
      [QuadVerticies.TopRight]: 0,
      [QuadVerticies.TopLeft]: 0,
      [QuadVerticies.BottomLeft]: 0,
      [QuadVerticies.BottomRight]: 0,
    }
  ) {
    super(vertices);
  }

  setFromQuadData(vertexData: QuadVertexData<number>) {
    this.vertices[1] = vertexData.vertices[1];
    this.vertices[2] = vertexData.vertices[2];
    this.vertices[3] = vertexData.vertices[3];
    this.vertices[4] = vertexData.vertices[4];
  }

  subtractFromVertex(vertex: QuadVerticies, value: number) {
    this.vertices[vertex] -= value;
  }

  addAll(value: number) {
    this.vertices[1] += value;
    this.vertices[2] += value;
    this.vertices[3] += value;
    this.vertices[4] += value;
  }

  add(v1: number, v2: number, v3: number, v4: number) {
    this.vertices[1] += v1;
    this.vertices[2] += v2;
    this.vertices[3] += v3;
    this.vertices[4] += v4;
  }

  subtractAll(value: number) {
    this.vertices[1] -= value;
    this.vertices[2] -= value;
    this.vertices[3] -= value;
    this.vertices[4] -= value;
  }

  subtract(v1: number, v2: number, v3: number, v4: number) {
    this.vertices[1] += v1;
    this.vertices[2] += v2;
    this.vertices[3] += v3;
    this.vertices[4] += v4;
  }

  isGreaterThan(v1: number, v2: number, v3: number, v4: number) {
    if (this.vertices[1] < v1) return false;
    if (this.vertices[2] < v2) return false;
    if (this.vertices[3] < v3) return false;
    if (this.vertices[4] < v4) return false;
    return true;
  }

  isAllGreaterThan(value: number) {
    if (this.vertices[1] < value) return false;
    if (this.vertices[2] < value) return false;
    if (this.vertices[3] < value) return false;
    if (this.vertices[4] < value) return false;
    return true;
  }

  isLessThan(v1: number, v2: number, v3: number, v4: number) {
    if (this.vertices[1] > v1) return false;
    if (this.vertices[2] > v2) return false;
    if (this.vertices[3] > v3) return false;
    if (this.vertices[4] > v4) return false;
    return true;
  }

  isAllLessThan(value: number) {
    if (this.vertices[1] > value) return false;
    if (this.vertices[2] > value) return false;
    if (this.vertices[3] > value) return false;
    if (this.vertices[4] > value) return false;
    return true;
  }
  clone() {
    return new QuadScalarVertexData({
      [QuadVerticies.TopRight]: this.vertices[QuadVerticies.TopRight],
      [QuadVerticies.TopLeft]: this.vertices[QuadVerticies.TopLeft],
      [QuadVerticies.BottomLeft]: this.vertices[QuadVerticies.BottomLeft],
      [QuadVerticies.BottomRight]: this.vertices[QuadVerticies.BottomRight],
    });
  }
}
