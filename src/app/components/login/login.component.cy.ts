import { JwtModule } from "@auth0/angular-jwt"
import { LoginComponent } from "./login.component"
import { importProvidersFrom } from "@angular/core"

describe('LoginComponent', ()=>{
    beforeEach(()=>{
        cy.mount(LoginComponent)
    })

    it('Login button should be deactivited by default', ()=> {
        cy.get('form > p-button > button').should("be.disabled")
    })

    it('Form should be initialized by default', ()=>{
        cy.get('#username').should('not.have.text')
        cy.get('.p-password > .p-inputtext').should('not.have.text')
    })

    it('Writing something in username and in password should enable the button', ()=>{
        cy.get('#username').type('user')
        cy.get('.p-password > .p-inputtext').type('password')
        cy.get('form > p-button > button').should("not.be.disabled")
    })
})