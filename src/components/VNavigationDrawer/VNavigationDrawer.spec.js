import VApp from '~components/VApp'
import VNavigationDrawer from '~components/VNavigationDrawer'
import { test } from '~util/testing'
import { mount } from 'avoriaz'

const resizeWindow = (width = global.innerWidth, height = global.innerHeight) => {
  global.innerWidth = width
  global.innerHeight = height
  global.dispatchEvent(new Event('resize'))
  return new Promise(resolve => setTimeout(resolve, 200))
}

beforeEach(() => {
  return resizeWindow(1920, 1080)
})

test('VNavigationDrawer', () => {
  // v-app is needed to initialise $vuetify.application
  const app = mount(VApp)

  it('should become temporary when the window resizes', async () => {
    const wrapper = mount(VNavigationDrawer)

    expect(wrapper.vm.isActive).toBe(true)
    await resizeWindow(1200)
    expect(wrapper.vm.isActive).toBe(false)
    expect(wrapper.vm.overlay).toBeFalsy()
  })

  it('should not resize the content when temporary', async () => {
    const wrapper = mount(VNavigationDrawer, { propsData: {
      app: true,
      temporary: true,
      value: true
    }})

    await wrapper.vm.$nextTick()
    expect(wrapper.vm.$vuetify.application.left).toBe(0)
    expect(wrapper.vm.overlay).toBeTruthy()
  })

  it('should not resize the content when permanent and stateless', async () => {
    const wrapper = mount(VNavigationDrawer, { propsData: {
      app: true,
      permanent: true,
      stateless: true
    }})

    await wrapper.vm.$nextTick()
    expect(wrapper.vm.$vuetify.application.left).toBe(300)

    await resizeWindow(1200)
    expect(wrapper.vm.$vuetify.application.left).toBe(300)
    expect(wrapper.vm.overlay).toBeFalsy()
  })

  it('should not resize the content when permanent and resize watcher is disabled', async () => {
    const wrapper = mount(VNavigationDrawer, {
      propsData: {
        app: true,
        permanent: true,
        disableResizeWatcher: true
      }
    })

    await wrapper.vm.$nextTick()
    expect(wrapper.vm.$vuetify.application.left).toBe(300)

    await resizeWindow(1200)
    expect(wrapper.vm.$vuetify.application.left).toBe(300)
    expect(wrapper.vm.overlay).toBeFalsy()
  })

  it('should stay active when resizing a temporary drawer', async () => {
    const wrapper = mount(VNavigationDrawer, {
      propsData: {
        app: true,
        temporary: true,
        value: true
      }
    })

    await wrapper.vm.$nextTick()

    expect(wrapper.vm.isActive).toBe(true)
    expect(wrapper.vm.overlay).toBeTruthy()

    await resizeWindow(1200)

    expect(wrapper.vm.isActive).toBe(true)
    expect(wrapper.vm.overlay).toBeTruthy()
  })

  it('should open when changed to permanent', async () => {
    const wrapper = mount(VNavigationDrawer, {
      propsData: {
        value: null
      }
    })

    wrapper.setProps({ permanent: true })

    await wrapper.vm.$nextTick()

    expect(wrapper.vm.isActive).toBe(true)
  })

  it('should not close when value changes and permanent', async () => {
    const wrapper = mount(VNavigationDrawer, {
      propsData: {
        permanent: true,
        value: true
      }
    })

    wrapper.setProps({ value: false })

    await wrapper.vm.$nextTick()

    expect(wrapper.vm.isActive).toBe(true)
  })
})
