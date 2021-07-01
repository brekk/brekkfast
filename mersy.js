'use strict';

var envtrace = require('envtrace');

const N = 624;
const N_MINUS_1 = 623;
const M = 397;
const M_MINUS_1 = 396;
const DIFF = N - M;
const MATRIX_A = 0x9908b0df;
const UPPER_MASK = 0x80000000;
const LOWER_MASK = 0x7fffffff;

function twist(state) {
  let bits;

  for (let i = 0; i < DIFF; i++) {
    bits = (state[i] & UPPER_MASK) | (state[i + 1] & LOWER_MASK);
    state[i] = state[i + M] ^ (bits >>> 1) ^ ((bits & 1) * MATRIX_A);
  }
  for (let i = DIFF; i < N_MINUS_1; i++) {
    bits = (state[i] & UPPER_MASK) | (state[i + 1] & LOWER_MASK);
    state[i] = state[i - DIFF] ^ (bits >>> 1) ^ ((bits & 1) * MATRIX_A);
  }

  bits = (state[N_MINUS_1] & UPPER_MASK) | (state[0] & LOWER_MASK);
  state[N_MINUS_1] = state[M_MINUS_1] ^ (bits >>> 1) ^ ((bits & 1) * MATRIX_A);

  return state
}

function initializeWithArray(seedArray) {
  const state = initializeWithNumber(19650218);
  const len = seedArray.length;

  let i = 1;
  let j = 0;
  let k = N > len ? N : len;

  for (; k; k--) {
    const s = state[i - 1] ^ (state[i - 1] >>> 30);
    state[i] =
      (state[i] ^
        (((((s & 0xffff0000) >>> 16) * 1664525) << 16) +
          (s & 0x0000ffff) * 1664525)) +
      seedArray[j] +
      j;
    i++;
    j++;
    if (i >= N) {
      state[0] = state[N_MINUS_1];
      i = 1;
    }
    if (j >= len) {
      j = 0;
    }
  }
  for (k = N_MINUS_1; k; k--) {
    const s = state[i - 1] ^ (state[i - 1] >>> 30);

    state[i] =
      (state[i] ^
        (((((s & 0xffff0000) >>> 16) * 1566083941) << 16) +
          (s & 0x0000ffff) * 1566083941)) -
      i;
    i++;
    if (i >= N) {
      state[0] = state[N_MINUS_1];
      i = 1;
    }
  }

  state[0] = UPPER_MASK;

  return state
}

function initializeWithNumber(seed) {
  const state = new Array(N);

  // fill initial state
  state[0] = seed;
  for (let i = 1; i < N; i++) {
    const s = state[i - 1] ^ (state[i - 1] >>> 30);
    state[i] =
      ((((s & 0xffff0000) >>> 16) * 1812433253) << 16) +
      (s & 0x0000ffff) * 1812433253 +
      i;
  }

  return state
}

function initialize(seed = Date.now()) {
  const state = Array.isArray(seed)
    ? initializeWithArray(seed)
    : initializeWithNumber(seed);
  return twist(state)
}

function MersenneTwister(seed) {
  let state = initialize(seed);
  let next = 0;
  const randomInt32 = () => {
    let x;
    if (next >= N) {
      state = twist(state);
      next = 0;
    }

    x = state[next++];

    x ^= x >>> 11;
    x ^= (x << 7) & 0x9d2c5680;
    x ^= (x << 15) & 0xefc60000;
    x ^= x >>> 18;

    return x >>> 0
  };
  const api = {
    // [0,0xffffffff]
    randomNumber: () => randomInt32(),
    // [0,0x7fffffff]
    random31Bit: () => randomInt32() >>> 1,
    // [0,1]
    randomInclusive: () => randomInt32() * (1.0 / 4294967295.0),
    // [0,1)
    random: () => randomInt32() * (1.0 / 4294967296.0),
    // (0,1)
    randomExclusive: () => (randomInt32() + 0.5) * (1.0 / 4294967296.0),
    // [0,1), 53-bit resolution
    random53Bit: () => {
      const a = randomInt32() >>> 5;
      const b = randomInt32() >>> 6;
      return (a * 67108864.0 + b) * (1.0 / 9007199254740992.0)
    },
  };

  return api
}

const trace = envtrace.complextrace("mersy", [
  "twister",
  "constructor",
  "integer",
  "pick",
  "pickKey",
  "pickValue",
]);

const MAX_INT = 9007199254740992;
const CONSTANTS = {
  MAX_INT,
  MIN_INT: MAX_INT * -1,
};

const ERRORS = {
  TOO_BIG: "Number exceeds acceptable JavaScript integer size!",
  TOO_SMALL: "Number is below acceptable JavaScript integer size!",
  MIN_UNDER_MAX: "Minimum must be smaller than maximum!",
};

function throwOnInvalidInteger(x) {
  const minTest = testValidInteger(x);
  if (minTest) {
    throw new RangeError(ERRORS[minTest])
  }
}

function testValidInteger(x) {
  if (x > CONSTANTS.MAX_INT) {
    return "TOO_BIG"
  }
  if (x < CONSTANTS.MIN_INT) {
    return "TOO_SMALL"
  }
  return false
}

// import Twister from "./twister"

function Mersy(seed = null) {
  if (!(this instanceof Mersy)) {
    // eslint-disable-next-line no-unused-vars
    return new Mersy(seed)
  }
  this.seed = 0;
  if (typeof seed === "string") {
    let seedling = 0;
    let hash = 0;
    seed.split("").forEach((c, i) => {
      hash = seed.charCodeAt(i) + (hash << 6) + (hash << 16) - hash;
      trace.constructor("hash", { hash, seedling });
      seedling += hash;
    });
    this.seed += seedling;
  }
  trace.constructor("seed", this.seed);
  const twister = new MersenneTwister(this.seed);
  function random() {
    return twister.random()
  }

  function integer({ min, max }) {
    trace.integer("input", { min, max });
    const test = [min, max];
    test.map(throwOnInvalidInteger);
    if (min > max) {
      throw new RangeError(ERRORS.MIN_UNDER_MAX)
    }
    const result = Math.floor(random() * (max - min + 1) + min);
    trace.integer("output", result);
    return result
  }
  function pick(list) {
    trace.pick("input", list);
    const max = list.length - 1;
    const index = integer({ min: 0, max });
    const picked = list[index];
    trace.pick("output", picked);
    trace.pick("LIST OUTPUT", list);
    return picked
  }

  function pickKey(obj) {
    const keys = Object.keys(obj);
    return pick(keys)
  }
  function pickValue(obj) {
    const key = pickKey(obj);
    return obj[key]
  }
  this.random = random;
  this.integer = integer;
  this.pick = pick;
  this.pickKey = pickKey;
  this.pickValue = pickValue;
  return this
}

module.exports = Mersy;
