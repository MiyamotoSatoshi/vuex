import VTimePicker from '~components/VTimePicker'
import { test } from '~util/testing'

test('VTimePicker.js', ({ mount }) => {
  it('should accept a value', () => {
    const wrapper = mount(VTimePicker, {
      propsData: {
        value: '09:00:00'
      }
    })

    expect(wrapper.vm.inputTime).toBe('09:00:00')
    expect(wrapper.html()).toMatchSnapshot()
  })

  it('should accept a date object for a value', () => {
    const now = new Date('2017-01-01 12:00 AM')
    const wrapper = mount(VTimePicker, {
      propsData: {
        value: now
      }
    })

    expect(wrapper.vm.inputTime).toEqual('12:00am')
    expect(wrapper.html()).toMatchSnapshot()
  })

  it('should change am/pm when updated from model', () => {
    const wrapper = mount(VTimePicker, {
      propsData: {
        value: '9:00am'
      }
    })

    wrapper.setProps({ value: '9:00pm' })

    expect(wrapper.data().period).toBe('pm')
    expect(wrapper.html()).toMatchSnapshot()
  })

  it('should not change period with 24hr prop', () => {
    const wrapper = mount(VTimePicker, {
      propsData: {
        format: '24hr',
        value: null
      }
    })

    const ampm = wrapper.instance().inputTime.match(/(am|pm)/)

    expect(ampm).toBe(null)
  })

  it('should set picker to pm when given Date after noon', () => {
    const wrapper = mount(VTimePicker, {
      propsData: {
        value: new Date('2017-01-01 12:00 PM')
      }
    })

    expect(wrapper.data().period).toEqual('pm')
  })

  it('should set picker to pm when given string with PM in it', () => {
    const wrapper = mount(VTimePicker, {
      propsData: {
        value: '1:00 PM'
      }
    })

    expect(wrapper.data().period).toEqual('pm')
  })

  it('should set picker to pm when given string with pm in it', () => {
    const wrapper = mount(VTimePicker, {
      propsData: {
        value: '1:00 pm'
      }
    })

    expect(wrapper.data().period).toEqual('pm')
  })

  it('should set picker to am when given Date before noon', () => {
    const wrapper = mount(VTimePicker, {
      propsData: {
        value: new Date('2017-01-01 1:00 AM')
      }
    })

    expect(wrapper.data().period).toEqual('am')
  })
})
