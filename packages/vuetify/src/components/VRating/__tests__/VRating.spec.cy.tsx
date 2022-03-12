/// <reference types="../../../../types/cypress" />

import { Application } from '../../../../cypress/templates'
import { VRating } from '../VRating'

describe('VRating', () => {
  it('should response to user interaction', () => {
    cy.mount(() => (
      <Application>
        <VRating />
      </Application>
    ))

    cy.get('.v-rating__item .v-btn').eq(3).click()

    cy.emitted('.v-rating', 'update:modelValue').should('deep.equal', [[4]])
  })

  it('should respond to prop value changes', () => {
    cy.mount(({ rating }: any) => (
      <Application>
        <VRating modelValue={ rating } />
      </Application>
    ))

    cy.setProps({ rating: 4 })

    cy.get('.v-rating__item i.mdi-star').should('have.length', 4)
  })

  it('should clear value if using clearable prop', () => {
    cy.mount(({ clearable }: any) => (
      <Application>
        <VRating clearable={ clearable } />
      </Application>
    ))

    cy.get('.v-rating__item .v-btn').eq(1).click()

    cy.emitted('.v-rating', 'update:modelValue').should('deep.equal', [[2]])

    cy.get('.v-rating__item .v-btn').eq(1).click()

    cy.emitted('.v-rating', 'update:modelValue').should('deep.equal', [[2]])

    cy.setProps({ clearable: true })

    cy.get('.v-rating__item .v-btn').eq(1).click()

    cy.emitted('.v-rating', 'update:modelValue').should('deep.equal', [[2], [0]])
  })

  it('should not react to events when readonly', done => {
    cy.mount(() => (
      <Application>
        <VRating readonly />
      </Application>
    ))

    cy.get('.v-rating__item .v-btn').eq(1).click({ timeout: 1000 })

    // Use once() binding for just this fail
    cy.once('fail', err => {
      // Capturing the fail event swallows it and lets the test succeed

      // Now look for the expected messages
      expect(err.message).to.include('`cy.click()` failed because this element')
      expect(err.message).to.include('has CSS `pointer-events: none`')

      done()
    })
  })

  it('should change icon on hover', () => {
    cy.mount(() => (
      <Application>
        <VRating hover />
      </Application>
    ))

    cy.get('.v-rating__item .v-btn').eq(2).realHover()

    cy.get('.v-rating__item i.mdi-star').should('have.length', 3)
  })

  it('should show item-labels', () => {
    cy.mount(() => (
      <Application>
        <VRating item-labels={['1', null, null, null, '5']} />
      </Application>
    ))

    cy.get('.v-rating__wrapper > span').should('have.length', 5)
  })

  it('should support scoped item slot', () => {
    cy.mount(() => (
      <Application>
        <VRating>
          {{
            item: (props: any) => <div class="foo">{ props.value }</div>,
          }}
        </VRating>
      </Application>
    ))

    cy.get('.v-rating__item .foo').should('have.length', 5)
  })

  it('should support scoped item slot', () => {
    cy.mount(() => (
      <Application>
        <VRating>
          {{
            'item-label': (props: any) => <div class="foo">{ props.value }</div>,
          }}
        </VRating>
      </Application>
    ))

    cy.get('.v-rating__wrapper > .foo').should('have.length', 5)
  })

  it('should support half-increments', () => {
    cy.mount(() => (
      <Application>
        <VRating half-increments />
      </Application>
    ))

    cy.get('.v-rating__item input').should('have.length', 10)

    cy.get('.v-rating__item .v-rating__item--half').eq(3).click()

    cy.emitted('.v-rating', 'update:modelValue').should('deep.equal', [[3.5]])
  })
})
