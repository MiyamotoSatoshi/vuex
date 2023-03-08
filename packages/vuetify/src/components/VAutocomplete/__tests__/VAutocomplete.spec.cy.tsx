/// <reference types="../../../../types/cypress" />

import { VForm } from '@/components'
import { ref } from 'vue'
import { VAutocomplete } from '../VAutocomplete'

describe('VAutocomplete', () => {
  it('should close only first chip', () => {
    const items = ['Item 1', 'Item 2', 'Item 3', 'Item 4']

    const selectedItems = ['Item 1', 'Item 2', 'Item 3']

    cy.mount(() => (
      <VAutocomplete
        items={ items }
        modelValue={ selectedItems }
        chips
        closableChips
        multiple
      />
    ))
      .get('.v-chip__close')
      .eq(0)
      .click()
      .get('input')
      .get('.v-chip')
      .should('have.length', 2)
  })

  it('should have selected chip with array of strings', () => {
    const items = ref(['California', 'Colorado', 'Florida'])

    const selectedItems = ref(['California', 'Colorado'])

    cy.mount(() => (
      <VAutocomplete
        v-model={ selectedItems.value }
        items={ items.value }
        chips
        multiple
        closableChips
      />
    ))

    cy.get('.mdi-menu-down').click()

    cy.get('.v-list-item--active').should('have.length', 2)
    cy.get('.v-list-item--active input').eq(0).click().then(() => {
      expect(selectedItems.value).to.deep.equal(['Colorado'])
    })

    cy.get('.v-list-item--active').should('have.length', 1)

    cy
      .get('.v-chip__close')
      .eq(0)
      .click()
      .get('.v-chip')
      .should('have.length', 0)
      .should(() => expect(selectedItems.value).to.be.empty)
  })

  it('should have selected chip with return-object', () => {
    const items = ref([
      {
        title: 'Item 1',
        value: 'item1',
      },
      {
        title: 'Item 2',
        value: 'item2',
      },
    ])

    const selectedItems = ref([
      {
        title: 'Item 1',
        value: 'item1',
      },
    ])

    cy.mount(() => (
      <VAutocomplete
        v-model={ selectedItems.value }
        items={ items.value }
        returnObject
        chips
        multiple
      />
    ))

    cy.get('.mdi-menu-down').click()

    cy.get('.v-list-item--active').should('have.length', 1)
    cy.get('.v-list-item--active input').click().then(() => {
      expect(selectedItems.value).to.be.empty
    })
    cy.get('.v-list-item--active').should('have.length', 0)
  })

  it('should not be clickable when in readonly', () => {
    const items = ['Item 1', 'Item 2', 'Item 3', 'Item 4']

    const selectedItems = 'Item 1'

    cy.mount(() => (
      <VAutocomplete
        items={ items }
        modelValue={ selectedItems }
        readonly
      />
    ))

    cy.get('.v-autocomplete')
      .click()
      .get('.v-list-item').should('have.length', 0)
      .get('.v-select--active-menu').should('have.length', 0)

    cy
      .get('.v-autocomplete input')
      .focus()
      .type('{downarrow}', { force: true })
      .get('.v-list-item').should('have.length', 0)
      .get('.v-select--active-menu').should('have.length', 0)
  })

  it('should not be clickable when in readonly form', () => {
    const items = ['Item 1', 'Item 2', 'Item 3', 'Item 4']

    const selectedItems = 'Item 1'

    cy.mount(() => (
      <VForm readonly>
        <VAutocomplete
          items={ items }
          modelValue={ selectedItems }
          readonly
        />
      </VForm>
    ))

    cy.get('.v-autocomplete')
      .click()
      .get('.v-list-item').should('have.length', 0)
      .get('.v-select--active-menu').should('have.length', 0)

    cy
      .get('.v-autocomplete input')
      .focus()
      .type('{downarrow}', { force: true })
      .get('.v-list-item').should('have.length', 0)
      .get('.v-select--active-menu').should('have.length', 0)
  })

  describe('hide-selected', () => {
    it('should hide selected item(s)', () => {
      const items = ['Item 1', 'Item 2', 'Item 3', 'Item 4']

      const selectedItems = ['Item 1', 'Item 2']

      cy.mount(() => (
        <VAutocomplete
          items={ items }
          modelValue={ selectedItems }
          hideSelected
          multiple
        />
      ))

      cy.get('.mdi-menu-down').click()

      cy.get('.v-overlay__content .v-list-item').should('have.length', 2)
      cy.get('.v-overlay__content .v-list-item .v-list-item-title').eq(0).should('have.text', 'Item 3')
      cy.get('.v-overlay__content .v-list-item .v-list-item-title').eq(1).should('have.text', 'Item 4')
    })
  })
})
