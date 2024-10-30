import { CalculateSaleComponent } from "./calculate-sale.component"

describe('CalculateSaleComponent', ()=>{
    beforeEach(()=>{
        cy.intercept('**/user/get_all/type_document', {fixture: 'types/document.json'})
        cy.intercept('**/ward_robe/inventory/**', {fixture: 'wardrobe/wardrobe-inventory.json'})
        cy.intercept('**/user/get/identification?identification=**', {statusCode: 404})
        cy.intercept('**/user/get/identification?identification=1', {fixture: 'user/normal-user.json'})
        cy.mount(CalculateSaleComponent)
    })
    it('Mounts', ()=>{})

    it('Button should be disabled by default', ()=>{
        cy.get('[data-cy="send"] > button').should('be.disabled')
    })

    it('A wrong document should trigger an error', ()=>{
        cy.get('[data-cy="document"]').type('123')
        cy.get('[data-cy="document-feedback"]').should('contain.text', 'No se ha encontrado')
    })

    it('A correct document should trigger a info of the user', ()=>{
        cy.get('[data-cy="document"]').type('1')
        cy.get('[data-cy="document-feedback"]').should('contain.text', 'Test user')
    })

    it('All controlls except clothe-type should be disabled by default', ()=>{
        cy.get('[data-cy="stage-type"] > div').should('have.class', 'p-disabled')
        cy.get('[data-cy="gender-type"] > div').should('have.class', 'p-disabled')
        cy.get('[data-cy="quantity"] > * >input').should('be.disabled')
        cy.get('[data-cy="price"] > * >input').should('be.disabled')
    })

    it('A correct form should enable the send button', ()=>{
        cy.get('[data-cy="document"]').type('1')
        cy.get('[data-cy="cloth-type"]').click().type('{downarrow}').type('{enter}')
        cy.get('[data-cy="stage-type"]').click().type('{downarrow}').type('{enter}')
        cy.get('[data-cy="gender-type"]').click().type('{downarrow}').type('{enter}')
        cy.get('[data-cy="quantity"] > * >input').type('2')
        cy.get('[data-cy="price"] > * >input').type('15000')
    })
})