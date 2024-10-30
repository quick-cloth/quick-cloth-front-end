import { ReplyOrderComponent } from "./reply-order.component"

describe('ReplyOrderComponent', ()=>{
    beforeEach(()=>{
        cy.intercept('**/ward_robe/order/**', {fixture: 'order/reply-order.json'})
        cy.mount(ReplyOrderComponent)
    })

    it('Mounts', ()=>{})

    it('Title should reflect the order uuid', ()=>{
        cy.get('.title').should('contain.text', '#1')
    })

    it('Table should show the correct info', ()=>{
        cy.get('tbody').find('tr').should('have.length', 2)
    })

    it('Button should be disabled by default', ()=>{
        cy.get('button').should('be.disabled')
    })

    it('All rows with correct info should enable the button', ()=>{
        cy.get('tbody').find('tr').find('p-inputNumber').each(($input)=>{
            cy.wrap($input).type('1')
        })
    })
})