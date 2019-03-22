// Components
import VOverflowBtn from '../VOverflowBtn'

// Utilities
import {
  mount,
  Wrapper
} from '@vue/test-utils'
import { ExtractVue } from '../../../util/mixins'
import toHaveBeenWarnedInit from '../../../../test/util/to-have-been-warned'

describe('VOverflowBtn.js', () => {
  type Instance = ExtractVue<typeof VOverflowBtn>
  let mountFunction: (options?: object) => Wrapper<Instance>

  beforeEach(() => {
    document.body.setAttribute('data-app', 'true')

    mountFunction = (options = {}) => {
      return mount(VOverflowBtn, {
        ...options,
        mocks: {
          $vuetify: {
            lang: {
              t: (val: string) => val
            },
            theme: {
              dark: false
            }
          }
        }
      })
    }
  })

  toHaveBeenWarnedInit()
  const warning = 'items must contain both a text and callback property'

  it('segmented - should warn when item has no callback', async () => {
    const items = [
      { text: 'Hello' },
      { text: 'Hello' }
    ]

    const wrapper = mountFunction({
      propsData: {
        segmented: true,
        items
      }
    })

    await wrapper.vm.$nextTick()

    // The error only happens
    // when generating the button
    // which only happens when
    // we have a matching model
    wrapper.setProps({
      items: [items[1]],
      value: 'Hello'
    })

    await wrapper.vm.$nextTick()

    expect(warning).toHaveBeenTipped()
  })

  it('should use default autocomplete selections', async () => {
    const wrapper = mountFunction({
      propsData: {
        items: ['foo'],
        multiple: true,
        value: ['foo']
      }
    })

    expect(wrapper.html()).toMatchSnapshot()

    wrapper.setProps({
      items: [{ text: 'foo', value: 'foo', callback: () => { } }],
      multiple: false,
      segmented: true,
      value: 'foo'
    })

    await wrapper.vm.$nextTick()

    expect(wrapper.html()).toMatchSnapshot()

    expect(warning).toHaveBeenTipped()
  })

  it('should invoke item callback', () => {
    const callback = jest.fn()
    const wrapper = mountFunction({
      propsData: {
        items: [{
          text: 'foo',
          value: 'bar',
          callback
        }],
        segmented: true,
        value: 'bar'
      }
    })

    const btn = wrapper.find('.v-btn')

    btn.trigger('click')

    expect(callback).toHaveBeenCalled()
  })
})
