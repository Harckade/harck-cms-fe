/// <reference types="cypress" />
describe('About page', () => {
    const { authenticate } = require("../support/auth");
    beforeEach(() => {
        authenticate()
    })
    it('Should contain About Harck-CMS title and logo', () => {
        cy.get('div[class="me-auto navbar-nav"] a[href="#/about"]').click()
        cy.wait(5000)
        cy.get('div[class="text-center"] h4').should('exist').should('contain.text', 'About Harck-CMS')
        cy.get('img[class="about-logo"]').should('exist')
    })
})
