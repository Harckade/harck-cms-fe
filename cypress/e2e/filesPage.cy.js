/// <reference types="cypress" />

describe('Landing page after signing in', () => {
    const { authenticate } = require("../support/auth");
    beforeEach(() => {
        authenticate()
    })
    it('Should contain latest news message', () => {
        cy.get('div[class="me-auto navbar-nav"] a[href="#/files"]').click()
        cy.wait(5000)
        cy.get('h4[class="text-center"]').should('exist').should('contain.text', 'File Manager')
    })
    it('Should contain navbar', () => {
        cy.get('div[class="me-auto navbar-nav"] a[href="#/files"]').click()
        cy.wait(5000)
        cy.get('div[aria-labelledby="Filter by"]').should('exist').should('contain.text', 'All types are selected')
        cy.get('input[id="search-bar"]').should('exist')
        cy.get('div').should('have.class', 'files-toolbar').should('exist')
        cy.get('button[id="add-new-folder"]').should('exist')
        cy.get('button[id="upload-file"]').should('exist')
        cy.get('button[id="delete-file"]').should('exist')
    })
    it('Create a folder', () => {
        cy.get('div[class="me-auto navbar-nav"] a[href="#/files"]').click()
        cy.wait(5000)
        cy.get('button[id="add-new-folder"]').click()
        cy.wait(500)
        cy.get('div[class="modal-title h4"]').should('have.text', 'Create new folder')
        cy.get('input[placeholder*="new folder name"]').type('CYPRESS FOLDER')
        cy.contains('button', 'Create').should('exist').click()
        cy.wait(8000)
        cy.contains('td', 'CYPRESS FOLDER')
    })
    it('Delete a folder', () => {
        cy.get('div[class="me-auto navbar-nav"] a[href="#/files"]').click()
        cy.wait(5000)
        cy.contains('td', 'CYPRESS FOLDER').parent().find('td[class="text-center align-middle"] input').click()
        cy.get('button[id="delete-file"]').should('exist').should('not.be.disabled').click()
        cy.wait(500)
        cy.get('button[class="btn btn-danger"]').should('contain.text', 'Delete').should('not.be.disabled').click()
        cy.wait(8000)
        cy.get('button[id="delete-file"]').should('exist').should('be.disabled')
        cy.wait(500)
    })
    it('Upload a file and then delete it', () => {
        cy.get('div[class="me-auto navbar-nav"] a[href="#/files"]').click()
        cy.wait(5000)
        cy.get('button[id="upload-file"]').click()
        cy.wait(500)
        cy.get('input[id="file-drop-upload"]').should('exist').selectFile({
            contents: Cypress.Buffer.from('file contents'),
            fileName: 'cypress-file.txt',
            lastModified: Date.now()
          }, { force: true })
        cy.contains('button', 'Upload').should('exist').click()
        cy.wait(8000)
        cy.contains('td', 'cypress-file.txt').should('exist')
        cy.contains('td', 'cypress-file.txt').parent().find('td[class="text-center align-middle"] input').click()
        cy.get('button[id="delete-file"]').should('exist').should('not.be.disabled').click()
        cy.wait(500)
        cy.get('button[class="btn btn-danger"]').should('contain.text', 'Delete').should('not.be.disabled').click()
        cy.wait(8000)
        cy.get('button[id="delete-file"]').should('exist').should('be.disabled')
    })
})