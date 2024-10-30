import { WardrobeIdComponent } from "./wardrobe-id.component"

describe('WardrobeIdComponent', ()=>{
    beforeEach(()=>{
        cy.intercept('**', {statusCode: 200})
        cy.intercept('**/ward_robe/get**', {fixture: 'wardrobe/wardrobe.json'}).as('getWardrobe')
        cy.mount(WardrobeIdComponent)
    })

    it('Mounts', ()=>{

    })

    it('Should have correct title', ()=>{
        cy.get('.title').should('contain.text', 'Ropero de prueba')
    })

    it('Should display correct inventary size', ()=>{
        cy.get(':nth-child(1) > h2').should('have.text', 55)
    })

    it('Should display correct unid sold', ()=>{
        cy.get(':nth-child(2) > h2').should('have.text', 34)
    })

    it('Should format and display correct revenue', ()=>{
        cy.get(':nth-child(3) > h2').should('have.text', '$500,000.00')
    })
})