export class NodeId {
  high: bigint;
  low: bigint;

  private _idString = "";
  get idString() {
    if (!this._idString) this._idString = NodeId.ToHexString(this);
    return this._idString;
  }
  set idString(id: string) {
    this._idString = id;
  }

  private constructor(low: bigint, high: bigint) {
    this.low = low;
    this.high = high;
  }

  static Compare(id: NodeId, id2: NodeId) {
    return id.low == id2.low && id.high == id2.high;
  }

  static Create(id?: string): NodeId {
    if (id) {
      const { high, low } = NodeId.FromString(id);
      return new NodeId(low, high);
    } else {
      const array = new Uint8Array(16);
      crypto.getRandomValues(array);

      const high =
        (BigInt(array[0]) << 56n) |
        (BigInt(array[1]) << 48n) |
        (BigInt(array[2]) << 40n) |
        (BigInt(array[3]) << 32n) |
        (BigInt(array[4]) << 24n) |
        (BigInt(array[5]) << 16n) |
        (BigInt(array[6]) << 8n) |
        BigInt(array[7]);

      const low =
        (BigInt(array[8]) << 56n) |
        (BigInt(array[9]) << 48n) |
        (BigInt(array[10]) << 40n) |
        (BigInt(array[11]) << 32n) |
        (BigInt(array[12]) << 24n) |
        (BigInt(array[13]) << 16n) |
        (BigInt(array[14]) << 8n) |
        BigInt(array[15]);

      return new NodeId(low, high);
    }
  }

  static FromString(id: string): { high: bigint; low: bigint } {
    const high = BigInt("0x" + id.slice(0, 16));
    const low = BigInt("0x" + id.slice(16, 32));
    return { high, low };
  }
  static ToHexString(id: NodeId): string {
    return (
      id.high.toString(16).padStart(16, "0") +
      id.low.toString(16).padStart(16, "0")
    );
  }
}
