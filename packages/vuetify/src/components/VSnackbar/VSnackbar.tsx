// Styles
import './VSnackbar.sass'

// Components
import { VDefaultsProvider } from '@/components/VDefaultsProvider'
import { VOverlay } from '@/components/VOverlay'

// Composables
import { genOverlays, makeVariantProps, useVariant } from '@/composables/variant'
import { makeLocationProps, useLocation } from '@/composables/location'
import { makePositionProps, usePosition } from '@/composables/position'
import { makeRoundedProps, useRounded } from '@/composables/rounded'
import { makeTransitionProps } from '@/composables/transition'
import { useProxiedModel } from '@/composables/proxiedModel'
import { useScopeId } from '@/composables/scopeId'
import { forwardRefs } from '@/composables/forwardRefs'

// Utilities
import { onMounted, ref, watch } from 'vue'
import { genericComponent, useRender } from '@/util'

// Types
import type { MakeSlots } from '@/util'

export const VSnackbar = genericComponent<new () => {
  $slots: MakeSlots<{
    activator: [{ isActive: boolean, props: Record<string, any> }]
    default: []
    actions: []
  }>
  $props: VOverlay['$props']
}>()({
  name: 'VSnackbar',

  props: {
    contentClass: {
      type: String,
      default: '',
    },
    multiLine: Boolean,
    timeout: {
      type: [Number, String],
      default: 5000,
    },
    vertical: Boolean,

    modelValue: Boolean,

    ...makeLocationProps({ location: 'bottom' } as const),
    ...makePositionProps(),
    ...makeRoundedProps(),
    ...makeVariantProps(),
    ...makeTransitionProps({ transition: 'v-snackbar-transition' }),
  },

  emits: {
    'update:modelValue': (v: boolean) => true,
  },

  setup (props, { slots }) {
    const isActive = useProxiedModel(props, 'modelValue')
    const { locationStyles } = useLocation(props)
    const { positionClasses } = usePosition(props)
    const { scopeId } = useScopeId()

    const { colorClasses, colorStyles, variantClasses } = useVariant(props)
    const { roundedClasses } = useRounded(props)

    const overlay = ref<VOverlay>()

    watch(isActive, startTimeout)
    watch(() => props.timeout, startTimeout)

    onMounted(() => {
      if (isActive.value) startTimeout()
    })

    let activeTimeout = -1
    function startTimeout () {
      window.clearTimeout(activeTimeout)
      const timeout = Number(props.timeout)

      if (!isActive.value || timeout === -1) return

      activeTimeout = window.setTimeout(() => {
        isActive.value = false
      }, timeout)
    }

    function onPointerenter () {
      window.clearTimeout(activeTimeout)
    }

    useRender(() => (
      <VOverlay
        v-model={ isActive.value }
        ref={ overlay }
        class={[
          'v-snackbar',
          {
            'v-snackbar--active': isActive.value,
            'v-snackbar--multi-line': props.multiLine && !props.vertical,
            'v-snackbar--vertical': props.vertical,
          },
          positionClasses.value,
        ]}
        contentProps={{
          style: locationStyles.value,
        }}
        contentClass={ props.contentClass }
        persistent
        noClickAnimation
        scrim={ false }
        scrollStrategy="none"
        transition={ props.transition }
        { ...scopeId }
        v-slots={{ activator: slots.activator }}
      >
        <div
          class={[
            'v-snackbar__wrapper',
            colorClasses.value,
            roundedClasses.value,
            variantClasses.value,
          ]}
          style={[colorStyles.value]}
          onPointerenter={ onPointerenter }
          onPointerleave={ startTimeout }
        >
          { genOverlays(false, 'v-snackbar') }

          { slots.default && (
            <div
              class="v-snackbar__content"
              role="status"
              aria-live="polite"
            >
              { slots.default() }
            </div>
          ) }

          { slots.actions && (
            <VDefaultsProvider
              defaults={{
                VBtn: {
                  variant: 'text',
                  ripple: false,
                },
              }}
            >
              <div class="v-snackbar__actions">
                { slots.actions() }
              </div>
            </VDefaultsProvider>
          ) }
        </div>
      </VOverlay>
    ))

    return forwardRefs({}, overlay)
  },
})

export type VSnackbar = InstanceType<typeof VSnackbar>
