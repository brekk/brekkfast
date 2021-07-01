module.exports = {
  presets: [`@babel/preset-env`],
  plugins: [`@babel/plugin-transform-destructuring`],
  env: {
    test: {
      plugins: ["@babel/plugin-transform-modules-commonjs"],
    },
  },
}
