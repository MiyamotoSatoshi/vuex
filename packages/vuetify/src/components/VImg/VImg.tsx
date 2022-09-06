import './VImg.sass'

// Components
import { VResponsive } from '@/components/VResponsive'

// Directives
import intersect from '@/directives/intersect'

// Composables
import { makeTransitionProps, MaybeTransition } from '@/composables/transition'

// Utilities
import {
  computed,
  h,
  nextTick,
  onBeforeMount,
  ref,
  vShow,
  watch,
  withDirectives,
} from 'vue'
import {
  convertToUnit,
  defineComponent,
  SUPPORTS_INTERSECTION,
  useRender,
} from '@/util'

// Types
import type { PropType } from 'vue'

// not intended for public use, this is passed in by vuetify-loader
export interface srcObject {
  src?: string
  srcset?: string
  lazySrc?: string
  aspect: number
}

export const VImg = defineComponent({
  name: 'VImg',

  directives: { intersect },

  props: {
    aspectRatio: [String, Number],
    alt: String,
    cover: Boolean,
    eager: Boolean,
    gradient: String,
    lazySrc: String,
    options: {
      type: Object as PropType<IntersectionObserverInit>,
      // For more information on types, navigate to:
      // https://developer.mozilla.org/en-US/docs/Web/API/Intersection_Observer_API
      default: () => ({
        root: undefined,
        rootMargin: undefined,
        threshold: undefined,
      }),
    },
    sizes: String,
    src: {
      type: [String, Object] as PropType<string | srcObject>,
      default: '',
    },
    srcset: String,
    width: [String, Number],

    ...makeTransitionProps(),
  },

  emits: ['loadstart', 'load', 'error'],

  setup (props, { emit, slots }) {
    const currentSrc = ref('') // Set from srcset
    const image = ref<HTMLImageElement>()
    const state = ref<'idle' | 'loading' | 'loaded' | 'error'>(props.eager ? 'loading' : 'idle')
    const naturalWidth = ref<number>()
    const naturalHeight = ref<number>()

    const normalisedSrc = computed<srcObject>(() => {
      return props.src && typeof props.src === 'object'
        ? {
          src: props.src.src,
          srcset: props.srcset || props.src.srcset,
          lazySrc: props.lazySrc || props.src.lazySrc,
          aspect: Number(props.aspectRatio || props.src.aspect),
        } : {
          src: props.src,
          srcset: props.srcset,
          lazySrc: props.lazySrc,
          aspect: Number(props.aspectRatio || 0),
        }
    })
    const aspectRatio = computed(() => {
      return normalisedSrc.value.aspect || naturalWidth.value! / naturalHeight.value! || 0
    })

    watch(() => props.src, () => {
      init(state.value !== 'idle')
    })
    // TODO: getSrc when window width changes

    onBeforeMount(() => init())

    function init (isIntersecting?: boolean) {
      if (props.eager && isIntersecting) return
      if (
        SUPPORTS_INTERSECTION &&
        !isIntersecting &&
        !props.eager
      ) return

      state.value = 'loading'

      if (normalisedSrc.value.lazySrc) {
        const lazyImg = new Image()
        lazyImg.src = normalisedSrc.value.lazySrc
        pollForSize(lazyImg, null)
      }

      if (!normalisedSrc.value.src) return

      nextTick(() => {
        emit('loadstart', image.value?.currentSrc || normalisedSrc.value.src)

        if (image.value?.complete) {
          if (!image.value.naturalWidth) {
            onError()
          }

          if (state.value === 'error') return

          if (!aspectRatio.value) pollForSize(image.value, null)
          onLoad()
        } else {
          if (!aspectRatio.value) pollForSize(image.value!)
          getSrc()
        }
      })
    }

    function onLoad () {
      getSrc()
      state.value = 'loaded'
      emit('load', image.value?.currentSrc || normalisedSrc.value.src)
    }

    function onError () {
      state.value = 'error'
      emit('error', image.value?.currentSrc || normalisedSrc.value.src)
    }

    function getSrc () {
      const img = image.value
      if (img) currentSrc.value = img.currentSrc || img.src
    }

    function pollForSize (img: HTMLImageElement, timeout: number | null = 100) {
      const poll = () => {
        const { naturalHeight: imgHeight, naturalWidth: imgWidth } = img

        if (imgHeight || imgWidth) {
          naturalWidth.value = imgWidth
          naturalHeight.value = imgHeight
        } else if (!img.complete && state.value === 'loading' && timeout != null) {
          setTimeout(poll, timeout)
        } else if (img.currentSrc.endsWith('.svg') || img.currentSrc.startsWith('data:image/svg+xml')) {
          naturalWidth.value = 1
          naturalHeight.value = 1
        }
      }

      poll()
    }

    const containClasses = computed(() => ({
      'v-img__img--cover': props.cover,
      'v-img__img--contain': !props.cover,
    }))

    const __image = () => {
      if (!normalisedSrc.value.src || state.value === 'idle') return null

      const img = h('img', {
        class: ['v-img__img', containClasses.value],
        src: normalisedSrc.value.src,
        srcset: normalisedSrc.value.srcset,
        alt: '',
        sizes: props.sizes,
        ref: image,
        onLoad,
        onError,
      })

      const sources = slots.sources?.()

      return (
        <MaybeTransition transition={ props.transition } appear>
          {
            withDirectives(
              sources
                ? <picture class="v-img__picture">{ sources }{ img }</picture>
                : img,
              [[vShow, state.value === 'loaded']]
            )
          }
        </MaybeTransition>
      )
    }

    const __preloadImage = () => (
      <MaybeTransition transition={ props.transition }>
        { normalisedSrc.value.lazySrc && state.value !== 'loaded' && (
          <img
            class={['v-img__img', 'v-img__img--preload', containClasses.value]}
            src={ normalisedSrc.value.lazySrc }
            alt=""
          />
        )}
      </MaybeTransition>
    )

    const __placeholder = () => {
      if (!slots.placeholder) return null

      return (
        <MaybeTransition transition={ props.transition } appear>
          { (state.value === 'loading' || (state.value === 'error' && !slots.error)) &&
          <div class="v-img__placeholder">{ slots.placeholder() }</div>
          }
        </MaybeTransition>
      )
    }

    const __error = () => {
      if (!slots.error) return null

      return (
        <MaybeTransition transition={ props.transition } appear>
          { state.value === 'error' &&
            <div class="v-img__error">{ slots.error() }</div>
          }
        </MaybeTransition>
      )
    }

    const __gradient = () => {
      if (!props.gradient) return null

      return <div class="v-img__gradient" style={{ backgroundImage: `linear-gradient(${props.gradient})` }} />
    }

    const isBooted = ref(false)
    {
      const stop = watch(aspectRatio, val => {
        if (val) {
          // Doesn't work with nextTick, idk why
          requestAnimationFrame(() => {
            requestAnimationFrame(() => {
              isBooted.value = true
            })
          })
          stop()
        }
      })
    }

    useRender(() => (
      <VResponsive
        class={[
          'v-img',
          { 'v-img--booting': !isBooted.value },
        ]}
        style={{ width: convertToUnit(props.width === 'auto' ? naturalWidth.value : props.width) }}
        aspectRatio={ aspectRatio.value }
        aria-label={ props.alt }
        role={ props.alt ? 'img' : undefined }
        v-intersect={[{
          handler: init,
          options: props.options,
        }, null, ['once']]}
      >{{
        additional: () => (
          <>
            <__image />
            <__preloadImage />
            <__gradient />
            <__placeholder />
            <__error />
          </>
        ),
        default: slots.default,
      }}</VResponsive>
    ))

    return {
      currentSrc,
      image,
      state,
      naturalWidth,
      naturalHeight,
    }
  },
})

export type VImg = InstanceType<typeof VImg>
