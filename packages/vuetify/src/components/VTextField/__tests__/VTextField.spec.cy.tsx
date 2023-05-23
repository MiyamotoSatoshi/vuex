/// <reference types="../../../../types/cypress" />

import { VTextField } from '../VTextField'

// Utilities
import { cloneVNode } from 'vue'
import { generate } from '../../../../cypress/templates'

const variants = ['underlined', 'outlined', 'filled', 'solo', 'plain'] as const

const stories = Object.fromEntries(Object.entries({
  'Default input': <VTextField label="label" />,
  Disabled: <VTextField label="label" disabled />,
  Affixes: <VTextField label="label" prefix="prefix" suffix="suffix" />,
  'Prepend/append': <VTextField label="label" prependIcon="mdi-vuetify" appendIcon="mdi-vuetify" />,
  'Prepend/append inner': <VTextField label="label" prependInnerIcon="mdi-vuetify" appendInnerIcon="mdi-vuetify" />,
  Placeholder: <VTextField label="label" placeholder="placeholder" persistentPlaceholder />,
}).map(([k, v]) => [k, (
  <div class="d-flex flex-column flex-grow-1">
    { variants.map(variant => (
      <div class="d-flex" style="gap: 0.4rem">
        { cloneVNode(v, { variant }) }
        { cloneVNode(v, { variant, modelValue: 'Value' }) }
      </div>
    ))}
  </div>
)]))

describe('VTextField', () => {
  it('validates input on mount', () => {
    const rule = cy.spy(v => v?.length > 4 || 'Error!').as('rule')

    cy.mount(() => (
      <VTextField rules={[rule]}></VTextField>
    ))

    cy.get('.v-text-field').should('not.have.class', 'v-input--error')
    cy.get('@rule').should('have.been.calledOnceWith', undefined)
    cy.get('.v-text-field input').type('Hello')
    cy.get('@rule').should('to.be.callCount', 6)
    cy.get('.v-text-field').should('not.have.class', 'v-input--error')
  })

  it('does not validate on mount when using validate-on lazy', () => {
    const rule = cy.spy(v => v?.length > 5 || 'Error!').as('rule')

    cy.mount(() => (
      <VTextField label="Label" validate-on="lazy" rules={[rule]} />
    ))

    cy.get('.v-text-field').should('not.have.class', 'v-input--error')
    cy.get('@rule').should('not.have.been.called')
    cy.get('.v-text-field input').type('Hello')
    cy.get('@rule').should('to.be.callCount', 5)
    cy.get('.v-text-field').should('have.class', 'v-input--error')
    cy.get('.v-messages').should('exist').invoke('text').should('equal', 'Error!')
  })

  it('handles multiple options in validate-on prop', () => {
    const rule = cy.spy(v => v?.length > 5 || 'Error!').as('rule')

    cy.mount(() => (
      <VTextField label="Label" validate-on="blur lazy" rules={[rule]} />
    ))

    cy.get('.v-text-field').should('not.have.class', 'v-input--error')
    cy.get('@rule').should('not.have.been.called')

    cy.get('.v-text-field input').type('Hello')

    cy.get('.v-text-field').should('not.have.class', 'v-input--error')
    cy.get('@rule').should('not.have.been.called')

    cy.get('.v-text-field input').blur()

    cy.get('@rule').should('have.been.calledOnce')
    cy.get('.v-text-field').should('have.class', 'v-input--error')
    cy.get('.v-messages').should('exist').invoke('text').should('equal', 'Error!')
  })

  // https://github.com/vuetifyjs/vuetify/issues/15231
  it('renders details if using hide-details="auto" and counter prop', () => {
    cy.mount(() => (
      <VTextField hide-details="auto" counter></VTextField>
    ))
      .get('.v-input__details').should('be.visible')
  })

  describe('Showcase', () => {
    generate({ stories })
  })
})
