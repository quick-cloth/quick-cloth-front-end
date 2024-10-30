import { WuConfirmOrderComponent } from "./wu-confirm-order.component"

describe('WuConfirmOrderComponent', ()=>{
    beforeEach(()=>{
        cy.intercept('**/ward_robe/order/**', {fixture: 'order/confirm-order.json'})
        cy.mount(WuConfirmOrderComponent)
    })

    it('Mounts', ()=>{})

    it('Table should display correct info', ()=>{
        cy.get('tbody').find('tr').should('have.length', 1)
    })

    it('Button should be disabled by default', ()=>{
        cy.get('button').should('be.disabled')
    })

    it('Filling the table enabled the send button', ()=>{
        cy.get('tbody').get('tr').find('p-inputNumber').each(($elem)=>{
            cy.wrap($elem).type('1')
        })
    })

})