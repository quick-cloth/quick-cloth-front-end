import { ListOrderComponent } from "./list-order.component"

describe('ListOrderComponent', () => {
    beforeEach(() => {
        cy.intercept('**/clothe_bank/orders/**', { fixture: 'order/bank-orders.json' })
        cy.mount(ListOrderComponent)
    })
    it('Mounts', () => { })

    it('All received orders should have a button', () => {
        cy.get('tr')
            .filter(':has(.received)')
            .each(($tr) => {
                cy.wrap($tr)
                    .find('button')
                    .should('exist');
            })
    })

    it('All delivered orders should have a button', () => {
        cy.get('tr')
            .filter(':has(.delivered)')
            .each(($tr) => {
                cy.wrap($tr)
                    .find('button')
                    .should('exist');
            })
    })

    it('All on-way orders should not have a button to answer', ()=>{
        cy.get('tr')
            .filter(':has(.on-way)')
            .each(($tr) => {
                cy.wrap($tr)
                    .find('button')
                    .should('not.exist');
            })
    })

})