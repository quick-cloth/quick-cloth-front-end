import { WuListInventoryComponent } from "./wu-list-inventory.component"

describe('WuListInventoryComponent', ()=>{
    beforeEach(()=>{
        cy.intercept('**/ward_robe/inventory/**', {fixture: 'wardrobe/wardrobe-inventory.json'})
        cy.mount(WuListInventoryComponent)
    })

    it('Mounts', ()=>{})

    it('Table should display correct info', ()=>{
        cy.get('tbody').find('tr').should('have.length', 3)
    })

    it('Card should calculate and display all stock', ()=>{
        cy.get('.card > h2').should('have.text', 170)
    })

    it('Input text should trigger table filter', ()=>{
        cy.get('.p-inputtext').type('camisa')
        cy.get('tbody').find('tr').should('have.length', 1)
    })

    it('Component should display a warning on low supply', ()=>{
        cy.get('.p-message-wrapper').should('have.length', 1)
    })
})