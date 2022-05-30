// Composables
import { makeValidationProps, useValidation } from '../validation'

// Utilites
import { describe, expect, it } from '@jest/globals'
import { defineComponent, nextTick } from 'vue'
import { mount } from '@vue/test-utils'

// Types
import type { ValidationProps, ValidationRule } from '../validation'

describe('validation', () => {
  function mountFunction (props: Partial<ValidationProps> = {}) {
    return mount(defineComponent({
      props: makeValidationProps(),
      setup (props) {
        return useValidation(props, 'validation')
      },
      render: () => {}, // eslint-disable-line vue/require-render-return
    }), { props })
  }

  it.each([
    ['', [], []],
    ['', ['foo'], ['foo']],
    ['', [(v: any) => !!v || 'foo'], ['foo']],
    ['', [(v: any) => !!v || ''], ['']],
    ['', [(v: any) => Promise.resolve(!!v || 'fizz')], ['fizz']],
    ['', [(v: any) => new Promise(resolve => resolve(!!v || 'buzz'))], ['buzz']],
    ['foo', [(v: any) => v === 'foo' || 'bar'], []],
    ['foo', [(v: any) => v === 'bar' || 'fizz'], ['fizz']],
  ])('should validate rules and return array of errorMessages %#', async (
    modelValue: any,
    rules: ValidationRule[],
    expected: any
  ) => {
    const props = { rules, modelValue }
    const wrapper = mountFunction(props)

    expect(wrapper.vm.errorMessages).toEqual([])
    await wrapper.vm.validate()
    expect(wrapper.vm.errorMessages).toEqual(expected)
  })

  it.each([
    [null, 1],
    [1, 1],
    [2, 2],
    [3, 3],
    [4, 4],
    [5, 4],
  ])('only validate up to the maximum error count %s', async (
    maxErrors: number | string,
    expected: number,
  ) => {
    const wrapper = mountFunction({
      maxErrors,
      rules: ['foo', 'bar', 'fizz', 'buzz'],
    })

    await wrapper.vm.validate()

    expect(wrapper.vm.errorMessages).toHaveLength(expected)
  })

  it('should warn the user when using an improper rule fn', async () => {
    const rule = (v: any) => !!v || 1234
    const wrapper = mountFunction({
      rules: [rule as any],
    })

    await wrapper.vm.validate()

    expect(`${1234} is not a valid value. Rule functions must return boolean true or a string.`).toHaveBeenTipped()
  })

  it('should update isPristine when using the validate and reset methods', async () => {
    const wrapper = mountFunction({
      rules: [(v: any) => v === 'foo' || 'bar'],
      modelValue: '',
    })

    expect(wrapper.vm.isPristine).toBe(true)
    expect(wrapper.vm.isValid).toBeNull()

    await wrapper.vm.validate()

    expect(wrapper.vm.isPristine).toBe(false)
    expect(wrapper.vm.isValid).toBe(false)

    await wrapper.setProps({ modelValue: 'fizz' })

    await nextTick()
    await wrapper.vm.validate()

    expect(wrapper.vm.isPristine).toBe(false)
    expect(wrapper.vm.isValid).toBe(false)

    await wrapper.setProps({ modelValue: 'foo' })

    await nextTick()
    await wrapper.vm.validate()

    expect(wrapper.vm.isPristine).toBe(false)
    expect(wrapper.vm.isValid).toBe(true)

    wrapper.vm.reset()

    expect(wrapper.vm.isPristine).toBe(true)
    expect(wrapper.vm.isValid).toBeNull()
  })
})
