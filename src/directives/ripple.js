function style (el, value) {
  [
    'transform',
    'webkitTransform'
  ].forEach(i => {
    el.style[i] = value
  })
}

const ripple = {
  show: (e, el, { value = {} }) => {
    var container = document.createElement('span')
    var animation = document.createElement('span')

    container.appendChild(animation)
    container.className = 'ripple__container'

    if (value.class) {
      container.className += ` ${value.class}`
    }

    const size = el.clientWidth > el.clientHeight ? el.clientWidth : el.clientHeight
    animation.className = 'ripple__animation'
    animation.style.width = `${size * (value.center ? 1 : 2)}px`
    animation.style.height = animation.style.width

    el.appendChild(container)
    const computed = window.getComputedStyle(el)
    if (computed.position !== 'absolute') el.style.position = 'relative'

    const offset = el.getBoundingClientRect()
    const x = value.center ? '50%' : `${e.clientX - offset.left}px`
    const y = value.center ? '50%' : `${e.clientY - offset.top}px`

    animation.classList.add('ripple__animation--enter')
    animation.classList.add('ripple__animation--visible')
    style(animation, `translate(-50%, -50%) translate(${x}, ${y}) scale3d(0.01,0.01,0.01)`)
    animation.dataset.activated = Date.now()

    setTimeout(() => {
      animation.classList.remove('ripple__animation--enter')
      style(animation, `translate(-50%, -50%) translate(${x}, ${y})  scale3d(0.99,0.99,0.99)`)
    }, 0)
  },

  hide: (el) => {
    const ripples = el.getElementsByClassName('ripple__animation')

    if (ripples.length === 0) return
    const animation = ripples[ripples.length - 1]
    const diff = Date.now() - Number(animation.dataset.activated)
    let delay = 400 - diff

    delay = delay < 0 ? 0 : delay

    setTimeout(() => {
      animation.classList.remove('ripple__animation--visible')

      setTimeout(() => {
        // Need to figure out a new way to do this
        try {
          if (ripples.length < 1) el.style.position = null
          animation.parentNode && el.removeChild(animation.parentNode)
        } catch (e) {}
      }, 300)
    }, delay)
  }
}

function directive (el, binding, v) {
  if (binding.value === false) return

  if ('ontouchstart' in window) {
    el.addEventListener('touchend', () => ripple.hide(el), false)
    el.addEventListener('touchcancel', () => ripple.hide(el), false)
  }

  el.addEventListener('mousedown', e => ripple.show(e, el, binding), false)
  el.addEventListener('mouseup', () => ripple.hide(el), false)
  el.addEventListener('mouseleave', () => ripple.hide(el), false)
}

function unbind (el, binding) {
  el.removeEventListener('touchstart', e => ripple.show(e, el, binding), false)
  el.removeEventListener('mousedown', e => ripple.show(e, el, binding), false)
  el.removeEventListener('touchend', () => ripple.hide(el), false)
  el.removeEventListener('touchcancel', () => ripple.hide(el), false)
  el.removeEventListener('mouseup', () => ripple.hide(el), false)
  el.removeEventListener('mouseleave', () => ripple.hide(el), false)
}

export default {
  bind: directive,
  unbind: unbind
}
