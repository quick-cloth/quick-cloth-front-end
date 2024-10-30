import { UserSummaryComponent } from "./user-summary.component"

describe('UserSummaryComponent', ()=>{
    beforeEach(()=>{
        cy.intercept('**/user/get**', {fixture: 'user/client-info.json'})
        cy.intercept('**/user/sales/**', {body: []})
        cy.mount(UserSummaryComponent)
    })

    it('Mounts', ()=>{})

    it('Should display correct info', ()=>{
        cy.get('.title').should('contain.text', 'Test user')
        cy.get('h2').should('have.text', 5000)
    })
})