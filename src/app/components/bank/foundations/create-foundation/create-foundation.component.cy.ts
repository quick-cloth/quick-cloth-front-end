import { CreateFoundationComponent } from "./create-foundation.component"

describe('CreateFoundationComponent', ()=>{
    beforeEach(()=>{
        cy.intercept('**/foundation/type_meet_us/**', {fixture:'types/meet-us.json'})
        cy.intercept('**/location/department/**', {fixture: 'location/departments.json'})
        cy.intercept('**/location/city/**', {fixture: 'location/cities.json'})
        cy.mount(CreateFoundationComponent)
    })

    it('Mounts', ()=>{})

    it('Button should be disabled by default', ()=>{
        cy.get('[data-cy="send"] > button').should('be.disabled')
    })

    it('City dropdown should be disabled by default', ()=>{
        cy.get('[data-cy="city"] > div').should('have.class', 'p-disabled')
    })

    it('Selecting dpto should enable city dropdown', ()=>{
        cy.get('[data-cy="dpto"]').click().type('{downarrow}').type('{enter}')
        cy.get('[data-cy="city"] > div').should('not.have.class', 'p-disabled')
    })

    it('Valid form should enable send button', ()=>{
        cy.get('[data-cy="name"]').type('name')
        cy.get('[data-cy="email"]').type('test@mail.com')
        cy.get('[data-cy="legal-rep"]').type('namerep')
        cy.get('[data-cy="nit"]').type('123')
        cy.get('[data-cy="tel"]').type('123')
        cy.get('[data-cy="meet-type"]').click().type('{downarrow}').type('{enter}')
        cy.get('[data-cy="dpto"]').click().type('{downarrow}').type('{enter}')
        cy.get('[data-cy="city"]').click().type('{downarrow}').type('{enter}')
        cy.get('[data-cy="contact-name"]').type('name')
        cy.get('[data-cy="contact-tel"]').type('123')
        cy.get('[data-cy="contact-last-name"]').type('name')
        cy.get('[data-cy="contact-email"]').type('mail@correo.com')

        cy.get('[data-cy="send"] > button').should('be.enabled')
    })
})