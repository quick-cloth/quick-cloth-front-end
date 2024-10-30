import { WuSalesComponent } from "./wu-sales.component"

describe('WuSalesComponent', ()=>{
    beforeEach(()=>{
        cy.intercept('**/ward_robe/get**', {fixture:'wardrobe/wardrobe.json'})
        cy.intercept('**/ward_robe/sale/**', {fixture:'wardrobe/wardrobe-sales.json'})
        cy.mount(WuSalesComponent)
    })

    it('Mounts', ()=>{})

    it('Table should display correct data', ()=>{
        cy.get('tbody').find('tr').should('have.length', 3)
    })

    it('Cards should display the wardrobe summary', ()=>{
        cy.get('.info > :nth-child(1) > h2').should('have.text', 34)
    })
})