import VApp from '@components/VApp'
import { test } from '@util/testing'

test('VApp.js', ({ mount }) => {
  it('should match a snapshot', () => {
    const wrapper = mount(VApp)

    expect(wrapper.html()).toMatchSnapshot()
  })

  it('should have data-app attribute', () => {
    const wrapper = mount(VApp)
    const app = wrapper.find('.application')[0]

    expect(app.getAttribute('data-app')).toBe('true')
  })

  it('should allow a custom id', () => {
    const wrapper = mount(VApp, {
      propsData: {
        id: 'inspire'
      }
    })
    const app = wrapper.find('.application')[0]

    expect(app.getAttribute('id')).toBe('inspire')
    expect(wrapper.html()).toMatchSnapshot()
  })

  it('should watch dark prop', async () => {
    const wrapper = mount(VApp, {
      propsData: {
        dark: true
      }
    })

    expect(wrapper.vm.$vuetify.dark).toBe(true)
    wrapper.setProps({
      dark: false
    })
    expect(wrapper.vm.$vuetify.dark).toBe(false)
  })

  it('should watch theme', async () => {
    const wrapper = mount(VApp)

    expect(wrapper.vm.style).toMatchSnapshot()
    wrapper.vm.$vuetify.theme.primary = '#000'
    await wrapper.vm.$nextTick()
    expect(wrapper.vm.style).toMatchSnapshot()
  })
})
