export enum BinaryNumberTypes {
  Int8,
  Uint8,
  Uint8Clamped,
  Int16,
  Uint16,
  Float32,
  Int32,
  Uint32,
  Float64,
  BigInt,
  BigUint,
}

export enum ByteCounts {
  Int8 = 1,
  Uint8 = 1,
  Uint8Clamped = 1,
  Int16 = 2,
  Uint16 = 2,
  Float32 = 4,
  Int32 = 4,
  Uint32 = 4,
  Float64 = 8,
  BigInt = 8,
  BigUint = 8,
}

export const MappedByteCounts: Record<BinaryNumberTypes, ByteCounts> = {
  [BinaryNumberTypes.Int8]: ByteCounts.Int8,
  [BinaryNumberTypes.Uint8]: ByteCounts.Uint8,
  [BinaryNumberTypes.Uint8Clamped]: ByteCounts.Uint8Clamped,
  [BinaryNumberTypes.Int16]: ByteCounts.Int16,
  [BinaryNumberTypes.Uint16]: ByteCounts.Uint16,
  [BinaryNumberTypes.Float32]: ByteCounts.Float32,
  [BinaryNumberTypes.Int32]: ByteCounts.Int32,
  [BinaryNumberTypes.Uint32]: ByteCounts.Uint32,
  [BinaryNumberTypes.Float64]: ByteCounts.Float64,
  [BinaryNumberTypes.BigInt]: ByteCounts.BigInt,
  [BinaryNumberTypes.BigUint]: ByteCounts.BigUint,
};




