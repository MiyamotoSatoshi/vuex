/// <reference types="../../../../types/cypress" />

// Components
import { VBtn } from '@/components/VBtn'
import { VBtnGroup } from '..'

const colors = ['success', 'info', 'warning', 'error', 'invalid'] as const
const densities = ['default', 'comfortable', 'compact'] as const
const variants = ['contained', 'outlined', 'plain', 'text', 'contained-text'] as const

describe('VBtnGroup', () => {
  describe('color', () => {
    it('should render set length', () => {
      cy.mount(() => (
        <>
          { colors.map(color => (
            <VBtnGroup color={ color }>
              <VBtn>{ color } Button 1</VBtn>
              <VBtn>Button 2</VBtn>
              <VBtn>Button 3</VBtn>
            </VBtnGroup>
          )) }
        </>
      ))
        .get('.v-btn-group')
        .should('have.length', colors.length)
    })
  })

  describe('density', () => {
    it('supports density props', () => {
      cy.mount(() => (
        <>
          { densities.map(density => (
            <VBtnGroup color="primary" density={ density }>
              <VBtn>{ density } Button 1</VBtn>
              <VBtn>Button 2</VBtn>
              <VBtn>Button 3</VBtn>
            </VBtnGroup>
          )) }
        </>
      ))
        .get('.v-btn-group')
        .should('have.length', densities.length)
    })
  })

  describe('variant', () => {
    it('supports variant props', () => {
      cy.mount(() => (
        <>
          { variants.map(variant => (
            <VBtnGroup color="primary" variant={ variant }>
              <VBtn>{ variant } Button 1</VBtn>
              <VBtn>Button 2</VBtn>
              <VBtn>Button 3</VBtn>
            </VBtnGroup>
          )) }
        </>
      ))
        .get('.v-btn-group')
        .should('have.length', variants.length)
    })
  })
})
