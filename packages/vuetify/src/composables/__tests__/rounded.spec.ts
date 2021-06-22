// Utilities
import { makeRoundedProps, useRounded } from '../rounded'
import { mount } from '@vue/test-utils'
import { describe, expect, it } from '@jest/globals'

// Types
import type { RoundedProps } from '../rounded'

describe('rounded.ts', () => {
  it('should create rounded props', () => {
    const wrapper = mount({
      props: makeRoundedProps(),
      template: '<div/>',
    }, {
      propsData: { rounded: true },
    })

    expect(wrapper.props().rounded).toBeDefined()
  })

  it.each([
    // When should return nothing
    [{}, []],
    [{ rounded: null }, []],
    [{ rounded: 1 }, []],
    // // Rounded only
    [{ rounded: true }, ['foo--rounded']],
    [{ rounded: '' }, ['foo--rounded']],
    // // Rounded with 0
    [{ rounded: '0' }, ['rounded-0']],
    [{ rounded: 0 }, ['rounded-0']],
    // // Rounded with a word
    [{ rounded: 'circle' }, ['rounded-circle']],
    [{ rounded: 'shaped' }, ['rounded-shaped']],
    [{ rounded: 'pill' }, ['rounded-pill']],
    // // Corner and axis rounded
    [{ rounded: 'tr-xl br-lg' }, ['rounded-tr-xl', 'rounded-br-lg']],
  ] as RoundedProps[])('should return correct rounded classes', (props: RoundedProps, expected: any) => {
    const { roundedClasses } = useRounded(props, 'foo')

    expect(roundedClasses.value).toStrictEqual(expected)
  })
})
