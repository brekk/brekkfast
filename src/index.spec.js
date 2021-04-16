import brekkfast from './index'

test('brekkfast', () => {
  expect(brekkfast()).toMatchSnapshot()
})
