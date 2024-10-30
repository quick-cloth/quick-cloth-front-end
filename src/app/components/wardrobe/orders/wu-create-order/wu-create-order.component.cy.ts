import { WuCreateOrderComponent } from "./wu-create-order.component"

describe('WuCreateOrderComponent', ()=>{
    beforeEach(()=>{
        cy.intercept('**/type_clothe/**', {fixture: 'types/cloth.json'})
        cy.intercept('**/type_gender/**', {fixture: 'types/gender.json'})
        cy.intercept('**/type_stage/**', {fixture: 'types/stage.json'})
        cy.mount(WuCreateOrderComponent)
    })
    it('Mounts', ()=>{})

    it('Create button should be disabled by default', ()=>{
        cy.get('[data-cy="send"] > button').should('be.disabled')
    })

    it('A correct form should enable button', ()=>{
        cy.get('[data-cy="cloth-type"]').click().type('{downarrow}').type('{enter}')
        cy.get('[data-cy="stage-type"]').click().type('{downarrow}').type('{enter}')
        cy.get('[data-cy="gender-type"]').click().type('{downarrow}').type('{enter}')
        cy.get('[data-cy="quantity"]').type('12')

        cy.get('[data-cy="send"] > button').should('be.enabled')
    })
})