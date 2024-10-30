import { signal } from "@angular/core"
import { FinishSaleComponent } from "./finish-sale.component"

describe('FinishSaleComponent', () => {
    let check: any
    before(()=>{
        cy.fixture('sale/check-sale.json').then((v) => {
            check = v
        })
    })
    beforeEach(() => {
        
        cy.mount(FinishSaleComponent, {
            componentProperties: {
                isPayingWithPoints: signal(false) as any, //Workaround for cypress bug
                saleRequest: signal({}) as any,
                saleCheck: signal(check) as any
            }
        })
    })

    it('Mounts', () => {})

    it('Accordion should show coreect info', ()=>{
        cy.get('p-accordion').find('p-accordiontab').should('have.length', 2)
    })

    it('Should show a the applied campaigns', ()=>{
        cy.get('p-accordion').find('h1').should('contain.text', 'navidad')
    })
})