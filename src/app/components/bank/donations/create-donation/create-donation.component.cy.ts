import { CreateDonationComponent } from "./create-donation.component"

describe('CreateDonationComponent', ()=>{
    beforeEach(()=>{
        cy.intercept('**/user/get_all/type_document', {fixture: 'types/document.json'})
        cy.intercept('**/user/get/identification?identification=**', {statusCode: 404})
        cy.intercept('**/user/get/identification?identification=1', {fixture: 'user/normal-user.json'})
        cy.intercept('**/type_clothe/**', {fixture: 'types/cloth.json'})
        cy.intercept('**/type_gender/**', {fixture: 'types/gender.json'})
        cy.intercept('**/type_stage/**', {fixture: 'types/stage.json'})
        cy.mount(CreateDonationComponent)
    })
    it('Mounts', ()=>{})

    it('Send button should be disabled by default', ()=>{
        cy.get('[data-cy="send"] > button').should('be.disabled')
    })

    it('On incorrect donor info error should be displayed', ()=>{
        cy.get('[data-cy="document"]').type('123')
        cy.get('[data-cy="donor-info"]').should('contain.text', 'No se ha encontrado')
    })

    it('On correct donor info should be displayed', ()=>{
        cy.get('[data-cy="document"]').type('1')
        cy.get('[data-cy="donor-info"]').should('contain.text', 'Test user')
    })

    it('On null donor info should show anonym info', ()=>{
        cy.get('[data-cy="donor-info"]').should('contain.text', 'anónima')
    })

    it('Button should enable if the form is correct', ()=>{
        cy.get('[data-cy="cloth-type"]').click().type('{enter}')
        cy.get('[data-cy="gender-type"]').click().type('{enter}')
        cy.get('[data-cy="stage-type"]').click().type('{enter}')
        cy.get('[data-cy="quantity"]').type('4')
        cy.get('[data-cy="send"] > button').should('be.enabled')
    })
})