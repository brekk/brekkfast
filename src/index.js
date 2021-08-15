const raw = { yes: true }
const other = { ...raw, cool: 'very' }

const BREKKFAST = () =>
  `I am brekkfast, hear me roar ${JSON.stringify(other)}`

export default BREKKFAST
