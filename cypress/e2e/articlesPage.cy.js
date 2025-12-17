/// <reference types="cypress" />

describe('Articles page tests', () => {
  const { authenticate } = require("../support/auth");
  const createNewArticle = () => {
    cy.get('div[class="me-auto navbar-nav"] a[href="#/articles"]').click()
    cy.get('button[id="add-article"]', { timeout: 5000 }).should('be.visible').click()
    cy.get('div[class="modal-title h4"]', { timeout: 2000 }).should('have.text', 'Create new Article')
    cy.get('div[class="fade tab-pane active show"] input[placeholder*="Article title in"]').type('CYPRESS TEST Title')
    cy.get('div[class="fade tab-pane active show"] input[placeholder*="Article description"]').type('CYPRESS TEST Description')
    cy.get('div[class="fade tab-pane active show"] input[placeholder*="Article tags"]').type('CYPRESS TEST Tag1; CYPRESS TEST Tag2')
    cy.get('div[class="fade tab-pane active show"] input[placeholder*="Article author in"]').type('CYPRESS TEST Author')
    cy.get('div[class="fade tab-pane active show"] input[placeholder*="This image will apear alongside"]').type(`${Cypress.config().baseUrl}/favicon.ico`)
    cy.get('div[class="fade tab-pane active show"] img[class="img-thumbnail"]', { timeout: 2000 }).should('exist')
    cy.contains('button', 'Create').should('exist').click()
    cy.contains('td', 'CYPRESS TEST Title', { timeout: 10000 }).should('be.visible');
  }
  const deleteArticle = () => {
    cy.get('div[class="me-auto navbar-nav"] a[href="#/articles"]').click()
    cy.wait(5000)
    cy.contains('td', 'CYPRESS TEST Title').parent().find('td[class="text-center align-middle"] input').click()
    cy.get('button[id="delete-article"]').should('exist').should('not.be.disabled').click()
    cy.wait(500)
    cy.get('button[class="btn btn-danger"]').should('contain.text', 'Delete').should('not.be.disabled').click()
    cy.wait(6000)
    cy.get('button[class="transparent-btn btn btn-link btn-sm"]').should('exist').should('not.be.disabled').click()
    cy.get('div[class="fade tab-pane active show"] div[class="card-title h5"]').contains('CYPRESS TEST Title').should('exist')
    cy.get('div[class="fade tab-pane active show"] button[class="align-right btn btn-outline-success"]').should('exist').should('not.be.disabled').click()
    cy.contains('button', 'Permanently delete').should('exist').should('not.be.disabled').click()
    cy.wait(1000)
    cy.contains('button', 'Yes').should('exist').should('not.be.disabled').click()
    cy.wait(6000)
  }
  
  beforeEach(() => {
    authenticate()
  })
  it('check title, language filter, search bar and toolbar', () => {
    cy.get('div[class="me-auto navbar-nav"] a[href="#/articles"]').click()
    cy.wait(2000)
    cy.get('h4[class="text-center"]').should('exist').should('contain.text', 'Article Manager')
    cy.get('div[aria-labelledby="Filter by language"]').should('exist').should('contain.text', 'All languages are selected')
    cy.get('input[aria-describedby="search-by-text"]').should('exist')
    cy.get('div').should('have.class', 'files-toolbar').should('exist')
  })
  it('Create new article', () => {
    createNewArticle()
  })
  it('Delete article', () => {
    deleteArticle()
  })
  it('Edit article', () => {
    createNewArticle()
    cy.get('div[class="me-auto navbar-nav"] a[href="#/articles"]').click()
    cy.wait(5000)
    cy.contains('td', 'CYPRESS TEST Title').parent().find('td[class="text-center align-middle"] input').should('not.be.disabled').click()
    cy.get('button[id="edit-article"]').should('exist').should('not.be.disabled').click()
    cy.wait(20000)
    cy.get('div[class="fade tab-pane active show"] div[class="w-md-editor-content"]').should('exist').find("textarea").click().type('Some random text')
    cy.get('button[id="save-article"]').should('exist').click({force: true})
    cy.wait(300)
    cy.get('div[class="me-auto navbar-nav"] a[href="#/articles"]').click()
    cy.wait(500)
    cy.contains('td', 'CYPRESS TEST Title').parent().find('td[class="text-center align-middle"] input').should('not.be.disabled').click()
    cy.get('button[id="edit-article"]').should('exist').should('not.be.disabled').click()
    cy.wait(500)
    cy.contains('div', 'Some random text').should('exist')
  })
  it('Delete article - at end', () => {
    cy.get('div[class="me-auto navbar-nav"] a[href="#/articles"]').click()
    cy.wait(5000)
    deleteArticle()
  })
})