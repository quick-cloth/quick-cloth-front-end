import { ListWuOrderComponent } from "./list-wu-order.component"

describe('ListWuOrderComponent', ()=>{
    beforeEach(()=>{
        cy.intercept('**/ward_robe/order/**', {fixture: 'order/wardrobe-orders.json'})
        cy.mount(ListWuOrderComponent)
    })

    it('Mounts', ()=>{})

    it('Table should display correect info', ()=>{
        cy.get('tbody').find('tr').should('have.length', 2)
    })

    it('Dropdowns on orders with ON_WAY state should contain an element to confirm them', ()=>{
        cy.get('tbody').find('tr').contains('span', 'En camino')
            .parents('tr').find('ng-icon').click()

        cy.get('.table-overlay').contains('div', 'Confirmar').should('exist')
    })
})