import { LCG } from "../seededRandom/LCG.js";

/**# Perlin Noise 3d
* ---
* TypeScript version of the library found here:
* https://github.com/alterebro/perlin-noise-3d
* 
* ### Orginal Comments 
* 
* Based on http://mrl.nyu.edu/~perlin/noise/
* 
* Adapting from runemadsen/rune.noise.js
* 
* Which was adapted from P5.js
* 
* Which was adapted from PApplet.java
* 
* which was adapted from toxi
* 
* which was adapted from the german demo group farbrausch as used in their demo "art": http://www.farb-rausch.de/fr010src.zip

 */
export class PerlinNoise3d {
  PERLIN_YWRAPB = 4;
  PERLIN_YWRAP = 1 << this.PERLIN_YWRAPB;
  PERLIN_ZWRAPB = 8;
  PERLIN_ZWRAP = 1 << this.PERLIN_ZWRAPB;
  PERLIN_SIZE = 4095;

  SINCOS_PRECISION = 0.5;
  SINCOS_LENGTH = Math.floor(360 / this.SINCOS_PRECISION);
  // sinLUT = new Array(this.SINCOS_LENGTH);
  cosLUT = new Array(this.SINCOS_LENGTH);
  DEG_TO_RAD = Math.PI / 180.0;
  perlin_octaves = 4; // default to medium smooth
  perlin_amp_falloff = 0.5; // 50% reduction/octave
  perlin: null | any[] = null;
  perlin_PI = this.SINCOS_LENGTH;

  lcg: LCG;
  constructor() {
    this.perlin_PI >>= 1;
    for (let i = 0; i < this.SINCOS_LENGTH; i++) {
      //   this.sinLUT[i] = Math.sin(i * this.DEG_TO_RAD * this.SINCOS_PRECISION);
      this.cosLUT[i] = Math.cos(i * this.DEG_TO_RAD * this.SINCOS_PRECISION);
    }
  }

  noiseSeed(seed: number) {
    // Linear Congruential Generator
    // Variant of a Lehman Generator
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
    // using cosine lookup table
    return (
      0.5 *
      (1.0 - this.cosLUT[Math.floor(i * this.perlin_PI) % this.SINCOS_LENGTH])
    );
  }

  get(x: number, y: number, z: number) {
    y = y || 0;
    z = z || 0;

    if (this.perlin == null) {
      this.perlin = new Array(this.PERLIN_SIZE + 1);
      for (let i = 0; i < this.PERLIN_SIZE + 1; i++) {
        this.perlin[i] = Math.random();
      }
    }

    if (x < 0) {
      x = -x;
    }
    if (y < 0) {
      y = -y;
    }
    if (z < 0) {
      z = -z;
    }

    let xi = Math.floor(x),
      yi = Math.floor(y),
      zi = Math.floor(z);
    let xf = x - xi;
    let yf = y - yi;
    let zf = z - zi;
    let rxf, ryf;

    let r = 0;
    let ampl = 0.5;

    let n1, n2, n3;

    for (let o = 0; o < this.perlin_octaves; o++) {
      let of = xi + (yi << this.PERLIN_YWRAPB) + (zi << this.PERLIN_ZWRAPB);

      rxf = this.noise_fsc(xf);
      ryf = this.noise_fsc(yf);

      n1 = this.perlin[of & this.PERLIN_SIZE];
      n1 += rxf * (this.perlin[(of + 1) & this.PERLIN_SIZE] - n1);
      n2 = this.perlin[(of + this.PERLIN_YWRAP) & this.PERLIN_SIZE];
      n2 +=
        rxf *
        (this.perlin[(of + this.PERLIN_YWRAP + 1) & this.PERLIN_SIZE] - n2);
      n1 += ryf * (n2 - n1);

      of += this.PERLIN_ZWRAP;
      n2 = this.perlin[of & this.PERLIN_SIZE];
      n2 += rxf * (this.perlin[(of + 1) & this.PERLIN_SIZE] - n2);
      n3 = this.perlin[(of + this.PERLIN_YWRAP) & this.PERLIN_SIZE];
      n3 +=
        rxf *
        (this.perlin[(of + this.PERLIN_YWRAP + 1) & this.PERLIN_SIZE] - n3);
      n2 += ryf * (n3 - n2);

      n1 += this.noise_fsc(zf) * (n2 - n1);

      r += n1 * ampl;
      ampl *= this.perlin_amp_falloff;
      xi <<= 1;
      xf *= 2;
      yi <<= 1;
      yf *= 2;
      zi <<= 1;
      zf *= 2;

      if (xf >= 1.0) {
        xi++;
        xf--;
      }
      if (yf >= 1.0) {
        yi++;
        yf--;
      }
      if (zf >= 1.0) {
        zi++;
        zf--;
      }
    }
    return r;
  }
}
