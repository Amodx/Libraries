/**
 * 2x2 Matrix
 *
 * Layout: 
 * 
 * |  |  |
 * |:-:|:-:|
 * | a | b |
 * | c | d |
 *
 * Stored as (column-major):
 * `[a, c, b, d]`
 */
export type Mat2Array = [number, number, number, number];
/**
 * 3x3 Matrix 
 *
 * Layout: 
 * 
 * |  |  |  |
 * |:-:|:-:|:-:|
 * | a | b | c |
 * | d | e | f |
 * | g | h | i |
 *
 * Stored as (column-major):
 * `[a, d, g,  b, e, h,  c, f, i]`
 */
export type Mat3Array = [
  number,
  number,
  number,
  number,
  number,
  number,
  number,
  number,
  number,
];
/**
 * 4x4 Matrix 
 *
 * Layout:
 * 
 * |      |      |      |     |
 * |:-----:|:-----:|:-----:|:-----:|
 * |   a   |   b   |   c   |   d   |
 * |   e   |   f   |   g   |   h   |
 * |   i   |   j   |   k   |   l   |
 * |   m   |   n   |   o   |   p   |
 *
 * Stored as (column-major):
 * `[a, e, i, m,  b, f, j, n,  c, g, k, o,  d, h, l, p]`
 */
export type Mat4Array = [
  number,
  number,
  number,
  number,
  number,
  number,
  number,
  number,
  number,
  number,
  number,
  number,
  number,
  number,
  number,
  number,
];
