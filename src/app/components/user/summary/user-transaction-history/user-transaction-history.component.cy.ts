import { UserTransactionHistoryComponent } from "./user-transaction-history.component"

describe('UserTransactionHistoryComponent', ()=>{
    beforeEach(()=>{
        cy.intercept('**/user/sales/**', {fixture: 'user/client-sale.json'})
        cy.mount(UserTransactionHistoryComponent)
    })
    it('Mounts', ()=>{})

    it('Should show correct info', ()=>{
        cy.get('.card').should('have.length', 2)
    })
})