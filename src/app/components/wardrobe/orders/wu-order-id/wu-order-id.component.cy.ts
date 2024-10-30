import { WuOrderIdComponent } from "./wu-order-id.component"

describe('WuOrderIdComponent', ()=>{
    beforeEach(()=>{
        cy.intercept('**/ward_robe/order/**', {fixture: 'order/confirm-order.json'})
        cy.mount(WuOrderIdComponent)
    })

    it('Mounts', ()=>{})

    it('Cards should display correct info', ()=>{
        cy.get('.cards > :nth-child(1) > h2').should('have.text', '05/05/2024')
        cy.get(':nth-child(2) > h2').should('have.text', '30')
        cy.get(':nth-child(3) > h2').should('have.text', '25')
        cy.get(':nth-child(4) > h2').should('have.text', 'En camino')
    })

    it('Table should display correct info', ()=>{
        cy.get('tbody').find('tr').should('have.length', 1)
    })
})