const raw = { yes: true };
const other = { ...raw, cool: 'very' };

const brekkfast = () =>
  `I am brekkfast, hear me roar ${JSON.stringify(other)}`;

export { brekkfast as default };
