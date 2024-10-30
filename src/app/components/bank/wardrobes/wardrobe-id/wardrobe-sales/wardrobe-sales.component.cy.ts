import { WardrobeSalesComponent } from "./wardrobe-sales.component"

describe('WardrobeSalesComponent', ()=>{
    beforeEach(()=>{
        cy.intercept('**/ward_robe/sale/**', {fixture: 'wardrobe/wardrobe-sales.json'})
        cy.mount("<BancoRopa-wardrobe-sales [wardrobeUUID]='1'/>", {
            imports: [WardrobeSalesComponent]
        })
    })

    it('Mounts', ()=>{})

    it('Table should load content', ()=>{
        cy.get(':nth-child(3) > :nth-child(2)').should('be.visible')
    })

    it('Typing something should make the date of the table to change ', ()=>{
        cy.get('.p-inputtext').type("2")
        cy.get(':nth-child(3) > :nth-child(2)').should('not.exist')
    })

})