import { CreateDonorComponent } from "./create-donor.component"

describe('CreateDonorComponent', ()=>{
    beforeEach(()=>{
        cy.intercept('**/user/get_all/type_document', {fixture: 'types/document.json'})
        cy.mount(CreateDonorComponent)
    })

    it('Mounts', ()=>{})

    it('Send button should be disabled by default', ()=>{
        cy.get('[data-cy="send"] > button').should('be.disabled')
    })

    it('Email field should be invalid on a wrong address', ()=>{
        cy.get('[data-cy="email"]').type('test').should('have.class', 'ng-invalid')
    })

    it('Email field should be valid on a correct address', ()=>{
        cy.get('[data-cy="email"]').type('test@email').should('not.have.class', 'ng-invalid')
    })

    it('Button should enable on valid form', ()=>{
        cy.get('[data-cy="document"]').type('123')
        cy.get('[data-cy="name"]').type('Test name')
        cy.get('[data-cy="last-name"]').type('Last test')
        cy.get('[data-cy="document-type"]').click().type('{enter}')
        cy.get('[data-cy="email"]').type('test@mail.com')
        cy.get('[data-cy="tel"]').type('123456')

        cy.get('[data-cy="send"] > button').should('be.enabled')
    })
})