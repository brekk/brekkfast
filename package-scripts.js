const NAME = process.env.NAME
const replace = x => `sed s/brekkfast/${NAME}/g ${x}`

module.exports = {
  scripts: {
    eject: !NAME
      ? `echo "run nps eject with a NAME environment variable!"`
      : {
          script: 'nps eject.remove eject.replace eject.addSource',
          remove: {
            script: `nps eject.remove.source eject.remove.brekkfast eject.remove.test`,
            source: `rm -rf .git`,
            brekkfast: {
              script: `nps ${[
                `eject.remove.brekkfast.mjs`,
                `eject.remove.brekkfast.cjs`,
                `eject.remove.brekkfast.umd`
              ].join(' ')}`,
              mjs: `rm brekkfast.mjs`,
              cjs: `rm brekkfast.js`,
              umd: `rm brekkfast.umd.js`
            },
            test: {
              script: `nps eject.remove.test.snap eject.remove.test.index`,
              snap: `rm src/__snapshots__/index.spec.js.snap`,
              index: `rm src/index.spec.js`
            }
          },
          replace: {
            script: `nps eject.replace.pkg eject.replace.index eject.replace.test`,
            pkg: replace('package.json'),
            index: replace('src/index.js'),
            test: replace('src/index.spec.js')
          },
          addSource: `git init`
        },
    lint: `eslint . --fix`,
    rollup: `rollup -c rollup.config.js`,
    build: `nps rollup`,
    bundle: `nps build`,
    test: {
      script: 'jest',
      description: 'test stuff',
      snapshot: 'nps "test -u"',
      coverage: 'nps "test --coverage"'
    },
    care: 'nps lint test bundle',
    precommit: 'nps test bundle'
  }
}
