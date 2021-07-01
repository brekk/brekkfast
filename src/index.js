// import Twister from "./twister"
import { curry } from "ramda"
import Twister from "./fast-twister"
import { trace } from "./utils"
import { ERRORS, throwOnInvalidInteger } from "./errors"

function Unusual(seed = null) {
  if (!(this instanceof Unusual)) {
    // eslint-disable-next-line no-unused-vars
    return new Unusual(seed)
  }
  this.seed = 0
  if (typeof seed === "string") {
    let seedling = 0
    let hash = 0
    seed.split("").forEach((c, i) => {
      hash = seed.charCodeAt(i) + (hash << 6) + (hash << 16) - hash
      trace.constructor("hash", { hash, seedling })
      seedling += hash
    })
    this.seed += seedling
  }
  trace.constructor("seed", this.seed)
  const twister = new Twister(this.seed)
  const random = twister.random

  function integer({ min, max }) {
    trace.integer("input", { min, max })
    const test = [min, max]
    test.map(throwOnInvalidInteger)
    if (min > max) {
      throw new RangeError(ERRORS.MIN_UNDER_MAX)
    }
    const result = Math.floor(random() * (max - min + 1) + min)
    trace.integer("output", result)
    return result
  }
  function pick(list) {
    trace.pick("input", list)
    const max = list.length - 1
    const index = integer({ min: 0, max })
    const picked = list[index]
    trace.pick("output", picked)
    trace.pick("LIST OUTPUT", list)
    return picked
  }

  function pickKey(obj) {
    const keys = Object.keys(obj)
    return pick(keys)
  }
  function pickValue(obj) {
    const key = pickKey(obj)
    return obj[key]
  }
  function floor(x) {
    return Math.floor(random() * x)
  }
  function floorMin(min, x) {
    return floor(x) + min
  }
  function shuffle(list) {
    const copy = [].concat(list)
    let start = copy.length
    while (start-- > 0) {
      const index = floor(start + 1)
      const a = copy[index]
      const b = copy[start]
      copy[index] = b
      copy[start] = a
    }
    return copy
  }
  this.random = random
  this.integer = integer
  this.pick = pick
  this.pickKey = pickKey
  this.pickValue = pickValue
  this.floor = floor
  this.floorMin = curry(floorMin)
  this.shuffle = shuffle
  return this
}

module.exports = Unusual
