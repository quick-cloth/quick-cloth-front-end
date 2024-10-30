import { WuBestSellerComponent } from "./wu-best-seller.component"

describe('WuBestSellerComponent', ()=>{
    beforeEach(()=>{
        cy.intercept('**/ward_robe/top**', {fixture: 'wardrobe/wardrobe-best-sellers.json'})
        cy.intercept('**/type_clothe/**', {fixture: 'types/cloth.json'})
        cy.intercept('**/type_gender/**', {fixture: 'types/gender.json'})
        cy.intercept('**/type_stage/**', {fixture: 'types/stage.json'})
        cy.mount(WuBestSellerComponent)
    })
    it('Mounts', ()=>{})

    it('Table should display correct info', ()=>{
        cy.get('tbody').find('tr').should('have.length', 3)
    })
})