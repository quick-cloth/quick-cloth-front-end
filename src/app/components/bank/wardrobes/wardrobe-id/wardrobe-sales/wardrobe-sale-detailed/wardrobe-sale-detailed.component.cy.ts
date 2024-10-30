import { WardrobeSaleDetailedComponent } from "./wardrobe-sale-detailed.component"

describe('WardrobeSaleDetailedComponent', ()=>{
    beforeEach(()=>{
        cy.intercept('**/ward_robe/sale/**', {fixture: 'wardrobe/wardrobe-sale-list.json'})
        cy.mount(WardrobeSaleDetailedComponent)
    })
    it('Mounts', ()=>{})

    it('Title should be correct', ()=>{
        cy.get('.title').should('have.text', '#1')
    })

    it('Date should be correct and formatted', ()=>{
        cy.get('.frame-wrapper > :nth-child(2)').should('have.text', '05/05/2024')
    })

    it('Table should display correct data', ()=>{
        cy.get('.p-element > :nth-child(3) > :nth-child(1)').should('exist')
    })
})