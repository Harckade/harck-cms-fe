/// <reference types="cypress" />
describe('Landing page after signing in', () => {
  const { authenticate } = require("../support/auth");
  beforeEach(() => {
    authenticate()
  })
  it('Should contain latest news message', () => {
    cy.get('h1[class="text-center header-title"]').should('exist').should('contain.text', 'Latests news 🔥')
  })
  it('Should contain profile email', () => {
    cy.get('div[class="nav-item dropdown"]').eq(0).should('exist').click()
    cy.get('span[class="text-center dropdown-item-text"]').should('contain.text', Cypress.env("USERNAME"))
  })
})