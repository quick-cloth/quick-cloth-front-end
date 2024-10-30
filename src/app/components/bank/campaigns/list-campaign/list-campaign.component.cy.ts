import { ListCampaignComponent } from "./list-campaign.component"

describe('ListCampaignComponent', ()=>{
    beforeEach(()=>{
        cy.intercept('**/clothe_bank/campaign/**', {fixture: 'campaigns.json'})
        cy.mount(ListCampaignComponent)
    })
    it('Mounts', ()=>{})

    it('Table should display the correct info', ()=>{
        cy.get('.p-element > :nth-child(2) > :nth-child(1)').should('exist')
    })
})