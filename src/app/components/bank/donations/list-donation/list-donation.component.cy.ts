import { ListDonationComponent } from "./list-donation.component"

describe('ListDonationComponent', ()=>{
    beforeEach(()=>{
        cy.intercept('**/clothe_bank/donation/**', {fixture: 'donations.json'})
        cy.mount(ListDonationComponent)
    })

    it('Mounts', ()=>{})

    it('Table should display correct info', ()=>{
        cy.get('.p-element > :nth-child(3) > :nth-child(1)').should('be.visible')
    })
})