import { WuThresholdComponent } from "./wu-threshold.component"

describe('WuThresholdComponent', ()=>{
    beforeEach(()=>{
        cy.intercept('**/ward_robe/inventory/**', {fixture: 'wardrobe/wardrobe-inventory.json'})
        cy.mount(WuThresholdComponent)
    })

    it('Mounts', ()=>{})

    it('Send button should be disabled by default', ()=>{
        cy.get('[data-cy="send"] > button').should('be.disabled')
    })

    it('Table should display correct info', ()=>{
        cy.get('tbody').find('tr').should('have.length', 3)
    })
})