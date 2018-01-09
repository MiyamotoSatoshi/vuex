import VAvatar from '@components/VAvatar'
import { test } from '@util/testing'

test('VAvatar.vue', ({ mount, functionalContext }) => {
  it('should have an avatar class', () => {
    const wrapper = mount(VAvatar, functionalContext())

    expect(wrapper.hasClass('avatar')).toBe(true)
    expect(wrapper.html()).toMatchSnapshot()
  })

  it('should have an proper class with tile prop', () => {
    const wrapper = mount(VAvatar, functionalContext({
      props: {
        tile: true
      }
    }))

    expect(wrapper.hasClass('avatar--tile')).toBe(true)
  })

  it('should accept custom or no class declarations', () => {
    const wrapper = mount(VAvatar, functionalContext())
    const wrapperTwo = mount(VAvatar, functionalContext({
      class: 'active'
    }))
    const wrapperThree = mount(VAvatar, functionalContext({
      class: ['active']
    }))
    const wrapperFour = mount(VAvatar, functionalContext({
      class: { 'active': true }
    }))

    expect(wrapper.hasClass('active')).toBe(false)
    expect(wrapperTwo.hasClass('active')).toBe(true)
    expect(wrapperThree.hasClass('active')).toBe(true)
    expect(wrapperFour.hasClass('active')).toBe(true)
  })
})
