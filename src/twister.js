// this code based on https://github.com/boo1ean/mersenne-twister
/*
   A C-program for MT19937, with initialization improved 2002/1/26.
   Coded by Takuji Nishimura and Makoto Matsumoto.
   Before using, initialize the state by using init_seed(seed)
   or init_by_array(init_key, key_length).
   Copyright (C) 1997 - 2002, Makoto Matsumoto and Takuji Nishimura,
   All rights reserved.
   Redistribution and use in source and binary forms, with or without
   modification, are permitted provided that the following conditions
   are met:
     1. Redistributions of source code must retain the above copyright
        notice, this list of conditions and the following disclaimer.
     2. Redistributions in binary form must reproduce the above copyright
        notice, this list of conditions and the following disclaimer in the
        documentation and/or other materials provided with the distribution.
     3. The names of its contributors may not be used to endorse or promote
        products derived from this software without specific prior written
        permission.
   THIS SOFTWARE IS PROVIDED BY THE COPYRIGHT HOLDERS AND CONTRIBUTORS
   "AS IS" AND ANY EXPRESS OR IMPLIED WARRANTIES, INCLUDING, BUT NOT
   LIMITED TO, THE IMPLIED WARRANTIES OF MERCHANTABILITY AND FITNESS FOR
   A PARTICULAR PURPOSE ARE DISCLAIMED.  IN NO EVENT SHALL THE COPYRIGHT OWNER OR
   CONTRIBUTORS BE LIABLE FOR ANY DIRECT, INDIRECT, INCIDENTAL, SPECIAL,
   EXEMPLARY, OR CONSEQUENTIAL DAMAGES (INCLUDING, BUT NOT LIMITED TO,
   PROCUREMENT OF SUBSTITUTE GOODS OR SERVICES; LOSS OF USE, DATA, OR
   PROFITS; OR BUSINESS INTERRUPTION) HOWEVER CAUSED AND ON ANY THEORY OF
   LIABILITY, WHETHER IN CONTRACT, STRICT LIABILITY, OR TORT (INCLUDING
   NEGLIGENCE OR OTHERWISE) ARISING IN ANY WAY OUT OF THE USE OF THIS
   SOFTWARE, EVEN IF ADVISED OF THE POSSIBILITY OF SUCH DAMAGE.
   Any feedback is very welcome.
   http://www.math.sci.hiroshima-u.ac.jp/~m-mat/MT/emt.html
   email: m-mat @ math.sci.hiroshima-u.ac.jp (remove space)
*/

/* CONSTANTS */

// period parameters
const N = 624
const M = 397
// constant vector a
const MASKS = {
  MATRIX_A: 0x9908b0df,
  // most significant w-r bits
  UPPER: 0x80000000,
  // least significant r bits
  LOWER: 0x7fffffff,
  LEFT: 0xffff0000,
  RIGHT: 0x0000ffff,
  A: 0x9d2c5680,
  B: 0xefc60000,
}

const PRIME = {
  ONE: 1812433253,
  TWO: 1664525,
  THREE: 1566083941,
  FOUR: 4294967295.0,
}
const SEEDS = {
  ONE: 19650218,
  TWO: 5489,
}
const NUMBERS = {
  ONE: 67108864.0,
  TWO: 9007199254740992.0,
}

function Twister(seed = new Date().getTime()) {
  this.mt = new Array(N)
  this.mti = N + 1

  if (seed.constructor === Array) {
    this.initByArray(seed, seed.length)
  } else {
    this.initSeed(seed)
  }
}

Twister.prototype.initSeed = function initSeed(seed) {
  this.mt[0] = seed >>> 0
  for (this.mti = 1; this.mti < N; this.mti++) {
    const s = this.mt[this.mti - 1] ^ (this.mt[this.mti - 1] >>> 30)
    this.mt[this.mti] =
      ((((s & MASKS.LEFT) >>> 16) * PRIME.ONE) << 16) +
      (s & MASKS.RIGHT) * PRIME.ONE +
      this.mti
    this.mt[this.mti] >>>= 0
  }
}

Twister.prototype.initByArray = function initByArray(initKey, keyLength) {
  let i, j, k
  this.initSeed(SEEDS.ONE)
  i = 1
  j = 0
  k = N > keyLength ? N : keyLength
  for (; k; k--) {
    const s = this.mt[i - 1] ^ (this.mt[i - 1] >>> 30)
    this.mt[i] =
      (this.mt[i] ^
        (((((s & MASKS.LEFT) >>> 16) * PRIME.TWO) << 16) +
          (s & MASKS.RIGHT) * PRIME.TWO)) +
      initKey[j] +
      j
    this.mt[i] >>>= 0
    i++
    j++
    if (i >= N) {
      this.mt[0] = this.mt[N - 1]
      i = 1
    }
    if (j >= keyLength) j = 0
  }
  for (k = N - 1; k; k--) {
    const s = this.mt[i - 1] ^ (this.mt[i - 1] >>> 30)
    this.mt[i] =
      (this.mt[i] ^
        (((((s & MASKS.LEFT) >>> 16) * PRIME.THREE) << 16) +
          (s & MASKS.RIGHT) * PRIME.THREE)) -
      i
    this.mt[i] >>>= 0
    i++
    if (i >= N) {
      this.mt[0] = this.mt[N - 1]
      i = 1
    }
  }

  this.mt[0] = MASKS.UPPER
}

Twister.prototype.integer = function integer() {
  let y
  // eslint-disable-next-line no-array-constructor
  const mag01 = new Array(0x0, MASKS.MATRIX_A)

  if (this.mti >= N) {
    let kk

    if (this.mti === N + 1) this.initSeed(SEEDS.TWO)

    for (kk = 0; kk < N - M; kk++) {
      y = (this.mt[kk] & MASKS.UPPER) | (this.mt[kk + 1] & MASKS.LOWER)
      this.mt[kk] = this.mt[kk + M] ^ (y >>> 1) ^ mag01[y & 0x1]
    }
    for (; kk < N - 1; kk++) {
      y = (this.mt[kk] & MASKS.UPPER) | (this.mt[kk + 1] & MASKS.LOWER)
      this.mt[kk] = this.mt[kk + (M - N)] ^ (y >>> 1) ^ mag01[y & 0x1]
    }
    y = (this.mt[N - 1] & MASKS.UPPER) | (this.mt[0] & MASKS.LOWER)
    this.mt[N - 1] = this.mt[M - 1] ^ (y >>> 1) ^ mag01[y & 0x1]

    this.mti = 0
  }

  y = this.mt[this.mti++]

  y ^= y >>> 11
  y ^= (y << 7) & MASKS.A
  y ^= (y << 15) & MASKS.B
  y ^= y >>> 18

  return y >>> 0
}

Twister.prototype.integer31 = function integer31() {
  return this.integer() >>> 1
}

Twister.prototype.inclusive = function inclusive() {
  return this.integer() * (1.0 / PRIME.FOUR)
}

Twister.prototype.random = function random() {
  return this.integer() * (1.0 / (PRIME.FOUR + 1))
}

Twister.prototype.exclusive = function exclusive() {
  return (this.integer() + 0.5) * (1.0 / (PRIME.FOUR + 1))
}

Twister.prototype.long = function long() {
  const a = this.integer() >>> 5
  const b = this.integer() >>> 6
  return (a * NUMBERS.ONE + b) * (1.0 / NUMBERS.TWO)
}

export default Twister
