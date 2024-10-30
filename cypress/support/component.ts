// ***********************************************************
// This example support/component.ts is processed and
// loaded automatically before your test files.
//
// This is a great place to put global configuration and
// behavior that modifies Cypress.
//
// You can change the location of this file or turn off
// automatically serving support files with the
// 'supportFile' configuration option.
//
// You can read more here:
// https://on.cypress.io/configuration
// ***********************************************************

// Import commands.js using ES2015 syntax:
import { provideNoopAnimations } from '@angular/platform-browser/animations'
import './commands'

// Alternatively you can use CommonJS syntax:
// require('./commands')

import { mount, MountConfig } from 'cypress/angular'
import { HttpTestingController, provideHttpClientTesting } from '@angular/common/http/testing'
import { HttpClient, provideHttpClient } from '@angular/common/http'
import { MessageService } from 'primeng/api'
import { importProvidersFrom, Type } from '@angular/core'
import { JwtHelperService, JwtModule } from '@auth0/angular-jwt'
import { TestBed } from '@angular/core/testing'
import { AuthService } from '@services/internal/auth.service'
import { provideRouter } from '@angular/router'

// Augment the Cypress namespace to include type definitions for
// your custom command.
// Alternatively, can be defined in cypress/support/component.d.ts
// with a <reference path="./component" /> at the top of your spec.
declare global {
  namespace Cypress {
    interface Chainable {
      mount: typeof mount
    }
  }
}

const generalProviders = [provideNoopAnimations(), MessageService, {provide: AuthService, useValue: {}}, provideHttpClient(), provideRouter([])]

const customMount = <T>(component: string | Type<T>, config?: MountConfig<T>)=>{
  if(!config){
    config = {providers: generalProviders}
  }else{
    config.providers = [...(config?.providers || []), ...generalProviders]
  }

  return mount<T>(component, config)
}

Cypress.Commands.add('mount', customMount)

