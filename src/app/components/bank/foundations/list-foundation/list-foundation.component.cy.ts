import { ListFoundationComponent } from "./list-foundation.component"

describe('ListFoundationComponent', ()=>{
    beforeEach(()=>{
        cy.intercept('**/foundation/**', {fixture: 'foundations.json'})
        cy.mount(ListFoundationComponent)
    })

    it("Mounts", ()=>{})

    it('Table should show the correct info', ()=>{
        cy.get('.p-datatable-tbody > :nth-child(2) > :nth-child(1)').should('be.visible')
    })

    it('InputText should trigger the table model to change', ()=>{
        cy.get('.p-inputtext').type('2')
        cy.get('.p-datatable-tbody > :nth-child(2) > :nth-child(1)').should('not.exist')
    })
})