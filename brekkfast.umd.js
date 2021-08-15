;(function (global, factory) {
  typeof exports === 'object' && typeof module !== 'undefined'
    ? (module.exports = factory())
    : typeof define === 'function' && define.amd
    ? define(factory)
    : ((global =
        typeof globalThis !== 'undefined'
          ? globalThis
          : global || self),
      (global.brekkfast = factory()))
})(this, function () {
  'use strict'

  const raw = { yes: true }
  const other = { ...raw, cool: 'very' }

  const brekkfast = () =>
    `I am brekkfast, hear me roar ${JSON.stringify(other)}`

  return brekkfast
})
