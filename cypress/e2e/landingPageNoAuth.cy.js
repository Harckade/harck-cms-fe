/// <reference types="cypress" />
describe('Render landing page', () => {
  it('Should contain sign-in button', () => {
    cy.visit('/')
    cy.get('button[id="sign-in-button"]').should('exist').should('contain.text', "Sign in")
  })
})