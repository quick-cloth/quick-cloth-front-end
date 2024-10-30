import { provideHttpClient } from "@angular/common/http"
import { importProvidersFrom } from "@angular/core"
import { JwtModule } from "@auth0/angular-jwt"
import { CreateWardrobeComponent } from "./create-wardrobe.component"
import { MessageService } from "primeng/api"
import { provideRouter } from "@angular/router"

describe('CreateWardobreComponent', ()=>{

    beforeEach(()=>{
        cy.intercept('**/location/department/**', {fixture: 'location/departments.json'})
        cy.intercept('**/location/city/**', {fixture: 'location/cities.json'})
        
        cy.mount(CreateWardrobeComponent, {
            providers: [provideHttpClient(), importProvidersFrom(JwtModule.forRoot({})), MessageService, provideRouter([])]
        })

    })
    it('Mounts', ()=>{})

    it('Send button should be disabled by default', ()=>{
        cy.get('[data-cy="send"] > button').should('be.disabled')
    })

    it('Button should enable on valid form', ()=>{
        cy.get('[data-cy="name"]').type('Generic name')
        cy.get('[data-cy="dpto"]').click().type('{downarrow}').type('{enter}')
        cy.get('[data-cy="city"]').click().type('{downarrow}').type('{enter}')

        cy.get('[data-cy="address"]').type("Generic address")

        cy.get('[data-cy="send"] > button').should('be.enabled')
    })
})