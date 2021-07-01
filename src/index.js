// import Twister from "./twister"
import Twister from "./fast-twister"
import { trace } from "./utils"
import { ERRORS, throwOnInvalidInteger } from "./errors"

function Mersy(seed = null) {
  if (!(this instanceof Mersy)) {
    // eslint-disable-next-line no-unused-vars
    return new Mersy(seed)
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
  function random() {
    return twister.random()
  }

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
  this.random = random
  this.integer = integer
  this.pick = pick
  this.pickKey = pickKey
  this.pickValue = pickValue
  return this
}

module.exports = Mersy
