/// <reference types="cypress" />
describe('Journal page', () => {
    const { authenticate } = require("../support/auth");
    beforeEach(() => {
        authenticate()
    })
    it('Should contain calendar and a search bar', () => {
        cy.get('div[class="me-auto navbar-nav"] a[href="#/journal"]').click()
        cy.wait(5000)
        cy.get('h4[class="text-center"]').should('exist').should('contain.text', 'Journal')
        cy.get('div[class*="react-datepicker__input-container"] input').should('exist').click()
        cy.get('div[class="react-datepicker__current-month"]').should('exist')
        cy.get('input[aria-describedby="search-by-text"]').should('exist')
    })
})
