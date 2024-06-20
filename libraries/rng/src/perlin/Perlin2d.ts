import { LCG } from "../seededRandom/LCG.js";

/**# Perlin Noise 2d
 * ---
 * Simplified 2D version of the previously implemented 3D Perlin noise.
 */
export class PerlinNoise2d {
  PERLIN_YWRAPB = 4;
  PERLIN_YWRAP = 1 << this.PERLIN_YWRAPB;
  PERLIN_SIZE = 4095;

  SINCOS_PRECISION = 0.5;
  SINCOS_LENGTH = Math.floor(360 / this.SINCOS_PRECISION);
  cosLUT = new Array(this.SINCOS_LENGTH);
  DEG_TO_RAD = Math.PI / 180.0;
  perlin_octaves = 4; // default to medium smooth
  perlin_amp_falloff = 0.5; // 50% reduction/octave
  perlin: number[] = [];
  perlin_PI = this.SINCOS_LENGTH;

  lcg: LCG;

  constructor() {
    this.perlin_PI >>= 1;
    for (let i = 0; i < this.SINCOS_LENGTH; i++) {
      this.cosLUT[i] = Math.cos(i * this.DEG_TO_RAD * this.SINCOS_PRECISION);
    }
  }

  noiseSeed(seed: number) {
    const lcg = new LCG(seed);
    this.lcg = lcg;
    lcg.setSeed(seed);
    this.perlin = new Array(this.PERLIN_SIZE + 1);
    for (let i = 0; i < this.PERLIN_SIZE + 1; i++) {
      this.perlin[i] = lcg.rand();
    }
    return this;
  }

  noise_fsc(i: number) {
    return 0.5 * (1.0 - this.cosLUT[Math.floor(i * this.perlin_PI) % this.SINCOS_LENGTH]);
  }

  get(x: number, y: number) {
    if (this.perlin == null) {
      this.noiseSeed(0); // Initialize with a default seed if not already initialized
    }

    let xi = Math.floor(x);
    let yi = Math.floor(y);
    let xf = x - xi;
    let yf = y - yi;

    let r = 0;
    let ampl = 0.5;

    let n1, n2;

    for (let o = 0; o < this.perlin_octaves; o++) {
      let of = xi + (yi << this.PERLIN_YWRAPB);

      let rxf = this.noise_fsc(xf);
      let ryf = this.noise_fsc(yf);

      n1 = this.perlin[of & this.PERLIN_SIZE];
      n1 += rxf * (this.perlin[(of + 1) & this.PERLIN_SIZE] - n1);
      n2 = this.perlin[(of + this.PERLIN_YWRAP) & this.PERLIN_SIZE];
      n2 += rxf * (this.perlin[(of + this.PERLIN_YWRAP + 1) & this.PERLIN_SIZE] - n2);
      n1 += ryf * (n2 - n1);

      r += n1 * ampl;
      ampl *= this.perlin_amp_falloff;
      xi <<= 1;
      xf *= 2;
      yi <<= 1;
      yf *= 2;

      if (xf >= 1.0) {
        xi++;
        xf--;
      }
      if (yf >= 1.0) {
        yi++;
        yf--;
      }
    }
    return r;
  }
}