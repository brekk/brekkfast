const N = 624
const N_MINUS_1 = 623
const M = 397
const M_MINUS_1 = 396
const DIFF = N - M
const MATRIX_A = 0x9908b0df
const UPPER_MASK = 0x80000000
const LOWER_MASK = 0x7fffffff

function twist(state) {
  let bits

  for (let i = 0; i < DIFF; i++) {
    bits = (state[i] & UPPER_MASK) | (state[i + 1] & LOWER_MASK)
    state[i] = state[i + M] ^ (bits >>> 1) ^ ((bits & 1) * MATRIX_A)
  }
  for (let i = DIFF; i < N_MINUS_1; i++) {
    bits = (state[i] & UPPER_MASK) | (state[i + 1] & LOWER_MASK)
    state[i] = state[i - DIFF] ^ (bits >>> 1) ^ ((bits & 1) * MATRIX_A)
  }

  bits = (state[N_MINUS_1] & UPPER_MASK) | (state[0] & LOWER_MASK)
  state[N_MINUS_1] = state[M_MINUS_1] ^ (bits >>> 1) ^ ((bits & 1) * MATRIX_A)

  return state
}

function initializeWithArray(seedArray) {
  const state = initializeWithNumber(19650218)
  const len = seedArray.length

  let i = 1
  let j = 0
  let k = N > len ? N : len

  for (; k; k--) {
    const s = state[i - 1] ^ (state[i - 1] >>> 30)
    state[i] =
      (state[i] ^
        (((((s & 0xffff0000) >>> 16) * 1664525) << 16) +
          (s & 0x0000ffff) * 1664525)) +
      seedArray[j] +
      j
    i++
    j++
    if (i >= N) {
      state[0] = state[N_MINUS_1]
      i = 1
    }
    if (j >= len) {
      j = 0
    }
  }
  for (k = N_MINUS_1; k; k--) {
    const s = state[i - 1] ^ (state[i - 1] >>> 30)

    state[i] =
      (state[i] ^
        (((((s & 0xffff0000) >>> 16) * 1566083941) << 16) +
          (s & 0x0000ffff) * 1566083941)) -
      i
    i++
    if (i >= N) {
      state[0] = state[N_MINUS_1]
      i = 1
    }
  }

  state[0] = UPPER_MASK

  return state
}

function initializeWithNumber(seed) {
  const state = new Array(N)

  // fill initial state
  state[0] = seed
  for (let i = 1; i < N; i++) {
    const s = state[i - 1] ^ (state[i - 1] >>> 30)
    state[i] =
      ((((s & 0xffff0000) >>> 16) * 1812433253) << 16) +
      (s & 0x0000ffff) * 1812433253 +
      i
  }

  return state
}

function initialize(seed = Date.now()) {
  const state = Array.isArray(seed)
    ? initializeWithArray(seed)
    : initializeWithNumber(seed)
  return twist(state)
}

function MersenneTwister(seed) {
  let state = initialize(seed)
  let next = 0
  const randomInt32 = () => {
    let x
    if (next >= N) {
      state = twist(state)
      next = 0
    }

    x = state[next++]

    x ^= x >>> 11
    x ^= (x << 7) & 0x9d2c5680
    x ^= (x << 15) & 0xefc60000
    x ^= x >>> 18

    return x >>> 0
  }
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
      const a = randomInt32() >>> 5
      const b = randomInt32() >>> 6
      return (a * 67108864.0 + b) * (1.0 / 9007199254740992.0)
    },
  }

  return api
}

export default MersenneTwister
