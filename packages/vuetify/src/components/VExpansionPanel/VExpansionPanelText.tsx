// Components
import { VExpandTransition } from '@/components/transitions'
import { VExpansionPanelSymbol } from './VExpansionPanels'

// Composables
import { makeLazyProps, useLazy } from '@/composables/lazy'

// Utilities
import { inject } from 'vue'
import { genericComponent, useRender } from '@/util'

export const VExpansionPanelText = genericComponent()({
  name: 'VExpansionPanelText',

  props: {
    ...makeLazyProps(),
  },

  setup (props, { slots }) {
    const expansionPanel = inject(VExpansionPanelSymbol)

    if (!expansionPanel) throw new Error('[Vuetify] v-expansion-panel-text needs to be placed inside v-expansion-panel')

    const { hasContent, onAfterLeave } = useLazy(props, expansionPanel.isSelected)

    useRender(() => (
      <VExpandTransition onAfterLeave={ onAfterLeave }>
        <div
          class="v-expansion-panel-text"
          v-show={ expansionPanel.isSelected.value }
        >
          { slots.default && hasContent.value && (
            <div class="v-expansion-panel-text__wrapper">
              { slots.default?.() }
            </div>
          ) }
        </div>
      </VExpandTransition>
    ))

    return {}
  },
})

export type VExpansionPanelText = InstanceType<typeof VExpansionPanelText>
