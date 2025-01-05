export class NodeId {
  get high() {
    return this._idArray[0];
  }

  get low() {
    return this._idArray[1];
  }

  private _idString = "";
  get idString() {
    if (!this._idString) this._idString = NodeId.ToHexString(this);
    return this._idString;
  }

  private constructor(private _idArray: BigUint64Array) {}

  static Compare(id: NodeId, id2: NodeId) {
    return id.low == id2.low && id.high == id2.high;
  }

  static Create(id?: string): NodeId {
    if (id) {
      return NodeId.FromString(id);
    } else {
      const buffer = new ArrayBuffer(16);
      const randomArray = new Uint8Array(buffer);
      crypto.getRandomValues(randomArray);

      const idArray = new BigUint64Array(buffer);

      return new NodeId(idArray);
    }
  }

  static FromString(id: string): NodeId {
    const high = BigInt("0x" + id.slice(0, 16));
    const low = BigInt("0x" + id.slice(16, 32));
    return new NodeId(new BigUint64Array([high, low]));
  }
  static ToHexString(id: NodeId): string {
    return (
      id.high.toString(16).padStart(16, "0") +
      id.low.toString(16).padStart(16, "0")
    );
  }
}
