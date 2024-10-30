import { ListWardrobeComponent } from "./list-wardrobe.component"

describe('ListWardrobeComponent', () => {
    beforeEach(() => {
        cy.intercept('**/ward_robe/get_all/**', { fixture: 'wardrobe/wardrobes.json' }).as('getWardrobes')
        cy.mount(ListWardrobeComponent)
    })
    it('Table should load elements ', () => {
        cy.get('.p-datatable-tbody > :nth-child(5) > :nth-child(1)').should('exist')
    })

    it('Writing something in the input should trigger a search', ()=>{
        cy.get('.p-inputtext').type('discord')
        cy.get('.p-datatable-tbody > :nth-child(5) > :nth-child(1)').should('not.exist')
    })

    it('An empty table should display a message', ()=>{
        cy.get('.p-inputtext').type('something extrange')
        cy.get('.text-center').should('exist')
    })

    it('Click an acction icon should trigger an overlay panel', ()=>{
        cy.get(':nth-child(1) > :nth-child(4) > ng-icon').click()
        cy.get('.p-overlaypanel-content').should('be.visible')
    })
})