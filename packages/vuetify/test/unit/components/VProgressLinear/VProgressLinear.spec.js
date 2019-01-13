import { test } from '@/test'
import VProgressLinear from '@/components/VProgressLinear'

test('VProgressLinear.js', ({ mount, compileToFunctions }) => {
  it('should render component and match snapshot', () => {
    const wrapper = mount(VProgressLinear, {
      propsData: {
        value: 33
      }
    })

    expect(wrapper.html()).toMatchSnapshot()

    wrapper.setProps({ value: -1, bufferValue: -1 })
    const htmlMinus1 = wrapper.html()

    wrapper.setProps({ value: 0, bufferValue: 0 })
    const html0 = wrapper.html()

    wrapper.setProps({ value: 100, bufferValue: 100 })
    const html100 = wrapper.html()

    wrapper.setProps({ value: 101, bufferValue: 101 })
    const html101 = wrapper.html()

    expect(htmlMinus1).toBe(html0)
    expect(html100).toBe(html101)
    expect(html0).not.toBe(html100)

    wrapper.setProps({ value: '-1', bufferValue: '-1' })
    const htmlMinus1String = wrapper.html()

    wrapper.setProps({ value: '0', bufferValue: '0' })
    const html0String = wrapper.html()

    wrapper.setProps({ value: '100', bufferValue: '100' })
    const html100String = wrapper.html()

    wrapper.setProps({ value: '101', bufferValue: '101' })
    const html101String = wrapper.html()

    expect(htmlMinus1String).toBe(html0String)
    expect(html100String).toBe(html101String)
    expect(html0String).not.toBe(html100String)
  })

  it('should render inactive component and match snapshot', () => {
    const wrapper = mount(VProgressLinear, {
      propsData: {
        value: 33,
        active: false
      }
    })

    expect(wrapper.html()).toMatchSnapshot()
  })

  it('should render component with color and match snapshot', () => {
    const wrapper = mount(VProgressLinear, {
      propsData: {
        value: 33,
        color: 'orange'
      }
    })

    expect(wrapper.html()).toMatchSnapshot()
  })

  it('should render component with css color and match snapshot', () => {
    const wrapper = mount(VProgressLinear, {
      propsData: {
        value: 33,
        color: '#336699'
      }
    })

    expect(wrapper.html()).toMatchSnapshot()
  })

  it('should render component with color and background opacity and match snapshot', () => {
    const wrapper = mount(VProgressLinear, {
      propsData: {
        value: 33,
        color: 'orange',
        backgroundOpacity: 0.5
      }
    })

    expect(wrapper.html()).toMatchSnapshot()
  })

  it('should render component with color and background color and match snapshot', () => {
    const wrapper = mount(VProgressLinear, {
      propsData: {
        value: 33,
        color: 'orange',
        backgroundColor: 'blue'
      }
    })

    expect(wrapper.html()).toMatchSnapshot()
  })

  it('should render component with color and background color and opacity and match snapshot', () => {
    const wrapper = mount(VProgressLinear, {
      propsData: {
        value: 33,
        color: 'orange',
        backgroundColor: 'blue',
        backgroundOpacity: 0.5
      }
    })

    expect(wrapper.html()).toMatchSnapshot()
  })

  it('should render indeterminate progress and match snapshot', () => {
    const wrapper = mount(VProgressLinear, {
      propsData: {
        indeterminate: true
      }
    })

    expect(wrapper.html()).toMatchSnapshot()
  })

  it('should render indeterminate progress with query prop and match snapshot', () => {
    const wrapper = mount(VProgressLinear, {
      propsData: {
        indeterminate: true
      }
    })

    expect(wrapper.html()).toMatchSnapshot()
  })

  it('should render component with buffer value and match snapshot', async () => {
    const wrapper = mount(VProgressLinear, {
      propsData: {
        value: 33,
        bufferValue: 80
      }
    })

    expect(wrapper.html()).toMatchSnapshot()

    wrapper.setProps({
      bufferValue: 0
    })
    await wrapper.vm.$nextTick()
    expect(wrapper.html()).toMatchSnapshot()
  })

  it('should render component with buffer value and value > buffer value and match snapshot', () => {
    const wrapper = mount(VProgressLinear, {
      propsData: {
        value: 90,
        bufferValue: 80
      }
    })

    expect(wrapper.html()).toMatchSnapshot()
  })

  it('should render default slot content', () => {
    const wrapper = mount(VProgressLinear, {
      propsData: {
        value: 90,
        bufferValue: 80
      },
      slots: {
        default: [compileToFunctions('<div class="foobar">content</div>')]
      }
    })

    expect(wrapper.html()).toMatchSnapshot()
    expect(wrapper.find('.foobar').length).toBe(1)
  })
})
