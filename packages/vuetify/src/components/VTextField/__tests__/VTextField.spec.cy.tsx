/// <reference types="../../../../types/cypress" />

import { VTextField } from '../VTextField'
import { generate } from '../../../../cypress/templates'
import { cloneVNode } from 'vue'

const variants = ['underlined', 'outlined', 'filled', 'contained', 'plain']

const stories = Object.fromEntries(Object.entries({
  'Default input': <VTextField label="label" />,
  Disabled: <VTextField label="label" disabled />,
  Affixes: <VTextField label="label" prefix="prefix" suffix="suffix" />,
  'Prepend/append': <VTextField label="label" prependIcon="mdi-vuetify" appendIcon="mdi-vuetify" />,
  'Prepend/append inner': <VTextField label="label" prependInnerIcon="mdi-vuetify" appendInnerIcon="mdi-vuetify" />,
}).map(([k, v]) => [k, (
  <div class="d-flex flex-column flex-grow-1">
    { variants.map(variant => (
      <div class="d-flex" style="gap: 0.4rem">
        { cloneVNode(v, { variant }) }
        { cloneVNode(v, { variant, modelValue: 'Value' }) }
      </div>
    )) }
  </div>
)]))

describe('VTextField', () => {
  it('should update validation when model changes', () => {
    const rules = [
      (value: string) => value.length > 5 || 'Error!',
    ]

    cy.mount(() => (
      <VTextField label="Label" rules={ rules } />
    ))

    cy.get('.v-text-field input').type('Hello')

    cy.get('.v-text-field').should('have.class', 'v-input--error')
    cy.get('.v-messages').should('exist').invoke('text').should('equal', 'Error!')
  })

  describe('Showcase', { viewportHeight: 2750, viewportWidth: 700 }, () => {
    generate({ stories })
  })
})
