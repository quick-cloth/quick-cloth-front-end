import { WardrobeInventoryComponent } from "./wardrobe-inventory.component"

describe('WardrobeInventoryComponent', ()=>{
    beforeEach(()=>{
        cy.intercept('**/ward_robe/inventory/**', {fixture: 'wardrobe/wardrobe-inventory.json'})
        cy.mount("<BancoRopa-wardrobe-inventory [wardrobeUUID]='1'/>",{
            imports: [WardrobeInventoryComponent]
        })
    })

    it('Mounts', ()=>{})

    it('Table should display the correct info', ()=>{
        cy.get('.p-element > :nth-child(3) > :nth-child(1)').should('be.visible')
    })

    it('Example on fixture info', ()=>{
        cy.get(':nth-child(3) > :nth-child(4)').should('have.text', 100)
    })

})