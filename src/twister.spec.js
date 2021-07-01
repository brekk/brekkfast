import Twister from "./twister";

const SEED = {
  ONE: 100,
  TWO: 200,
};

const testWithSeed = seed => {
  describe(`Twister with seed: ${seed}`, () => {
    let TWIST;
    beforeAll(() => {
      TWIST = new Twister(seed);
    });

    test("integer", () => {
      const x = TWIST.integer();
      expect(x).toMatchSnapshot();
    });
    test("integer31", () => {
      const x = TWIST.integer31();
      expect(x).toMatchSnapshot();
    });
    test("inclusive", () => {
      const x = TWIST.inclusive();
      expect(x).toMatchSnapshot();
    });
    test("random", () => {
      const x = TWIST.random();
      expect(x).toMatchSnapshot();
    });
    test("exclusive", () => {
      const x = TWIST.exclusive();
      expect(x).toMatchSnapshot();
    });
    test("long", () => {
      const x = TWIST.long();
      expect(x).toMatchSnapshot();
    });
  });
};

testWithSeed(SEED.ONE);
testWithSeed(SEED.TWO);
