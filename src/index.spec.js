import Mersy from "./index"

const SEEDS = {
  ONE: "one",
  TWO: 2222,
}
const alphabet = "abcdefghijklmnopqrstuvwxyz".split("")
const alphaObj = []
  .concat(alphabet)
  .map((c, i) => [c, i])
  .reduce((agg, [c, i]) => Object.assign({}, agg, { [c]: i }))

function testWithSeed(seed) {
  describe("Mersy", () => {
    let M1
    let M2
    beforeAll(() => {
      M1 = new Mersy(seed)
      M2 = new Mersy(seed)
    })
    test("integer", () => {
      const range = { min: -500, max: 500 }
      const x = M1.integer(range)
      const y = M2.integer(range)
      expect(x).toEqual(y)
      expect(x).toMatchSnapshot()
      const z = M1.integer(range)
      expect(x).not.toEqual(z)
    })
    test("pick", () => {
      const x = M1.pick(alphabet)
      const y = M2.pick(alphabet)
      expect(x).not.toEqual(y)
      expect(x).toMatchSnapshot()
      expect(y).toMatchSnapshot()
    })
    test("pickKey", () => {
      const x = M1.pickKey(alphaObj)
      const y = M2.pickKey(alphaObj)
      expect(x).not.toEqual(y)
      expect(x).toMatchSnapshot()
      expect(y).toMatchSnapshot()
    })
    test("pickValue", () => {
      const x = M1.pickValue(alphaObj)
      const y = M2.pickValue(alphaObj)
      expect(x).not.toEqual(y)
      expect(x).toMatchSnapshot()
      expect(y).toMatchSnapshot()
    })
  })
}

testWithSeed(SEEDS.ONE)
testWithSeed(SEEDS.TWO)
