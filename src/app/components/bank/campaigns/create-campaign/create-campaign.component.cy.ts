import { CreateCampaignComponent } from "./create-campaign.component"

describe('CreateCampaignComponent', ()=>{
    beforeEach(()=>{
        cy.intercept('**/type_clothe/**', {fixture: 'types/cloth.json'})
        cy.intercept('**/type_gender/**', {fixture: 'types/gender.json'})
        cy.intercept('**/type_stage/**', {fixture: 'types/stage.json'})
        cy.intercept('**/type_campaign/**', {fixture: 'types/campaign.json'})
        cy.mount(CreateCampaignComponent)
    })

    it('Mounts', ()=>{})

    it('Create button should be disabled by default', ()=>{
        cy.get('.p-button-success').should('be.disabled')
    })

    it('Filling the form should enable the button', ()=>{
        cy.get('[data-cy="name"]').type('Generic name')
        cy.get('[data-cy="dates"]').click().within(()=>
            cy.get('[aria-label="1"]').click({multiple: true}).then(()=>{
                cy.get('[aria-label="20"]').click({multiple: true})
            })
        )
        cy.get('[data-cy="campaign-type"]').click().type('{enter}')
        cy.get('[data-cy="cloth-type"]').click().type('{enter}')
        cy.get('[data-cy="gender-type"]').click().type('{enter}')
        cy.get('[data-cy="stage-type"]').click().type('{enter}')
        cy.get('[data-cy="discount"]').type('5')
        cy.get('[data-cy="message"]').type('Generic message')
        cy.get('[data-cy="send"] > button').should('be.enabled')
    })
})