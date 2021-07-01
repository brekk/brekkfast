import Twister from "./original-twister"

const SEED = {
  ONE: 100,
  TWO: 200,
}

function testWithSeed(seed) {
  describe(`Twister with seed: ${seed}`, () => {
    let TWIST
    beforeAll(() => {
      TWIST = new Twister(seed)
    })

    test("integer", () => {
      const x = TWIST.random_int()
      expect(x).toMatchSnapshot()
    })
    test("integer31", () => {
      const x = TWIST.random_int31()
      expect(x).toMatchSnapshot()
    })
    test("inclusive", () => {
      const x = TWIST.random_incl()
      expect(x).toMatchSnapshot()
    })
    test("random", () => {
      const x = TWIST.random()
      expect(x).toMatchSnapshot()
    })
    test("exclusive", () => {
      const x = TWIST.random_excl()
      expect(x).toMatchSnapshot()
    })
    test("long", () => {
      const x = TWIST.random_long()
      expect(x).toMatchSnapshot()
    })
  })
}

testWithSeed(SEED.ONE)
testWithSeed(SEED.TWO)
