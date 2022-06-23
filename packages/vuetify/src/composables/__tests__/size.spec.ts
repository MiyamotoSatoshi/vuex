import { useSize } from '../size'

describe('size', () => {
  it.each([
    [{ size: 'x-small' }, 'test--size-x-small'],
    [{ size: 'small' }, 'test--size-small'],
    [{ size: 'default' }, 'test--size-default'],
    [{ size: 'large' }, 'test--size-large'],
    [{ size: 'x-large' }, 'test--size-x-large'],
    [{ size: '100px' }, undefined],
    [{ size: 100 }, undefined],
    [{ size: undefined }, undefined],
  ] as const)('should return the correct class given value %p', (input, expected) => {
    const { sizeClasses } = useSize(input, 'test')

    expect(sizeClasses.value).toStrictEqual(expected)
  })

  it.each([
    [{ size: 'x-small' }, undefined],
    [{ size: 'small' }, undefined],
    [{ size: 'default' }, undefined],
    [{ size: 'large' }, undefined],
    [{ size: 'x-large' }, undefined],
    [{ size: '100px' }, { width: '100px', height: '100px' }],
    [{ size: 50 }, { width: '50px', height: '50px' }],
    [{ size: undefined }, undefined],
  ] as const)('should return the correct styles given value %p', (input, expected) => {
    const { sizeStyles } = useSize(input, 'test')

    expect(sizeStyles.value).toStrictEqual(expected)
  })
})
