import { CurrencyPipe } from '@angular/common';
import { HttpErrorResponse } from '@angular/common/http';
import { Component, input, signal } from '@angular/core';
import { Router } from '@angular/router';
import { NavigationRoutes } from '@constants/navigation-routes';
import { CreateWardrobeSaleRequest } from '@model/request/sale/create-wardrobe-sale';
import { CheckSaleResponse } from '@model/response/sale/check-sale';
import { SaleService } from '@services/core/sale.service';
import { AccordionModule } from 'primeng/accordion';
import { MessageService } from 'primeng/api';
import { ButtonModule } from 'primeng/button';
import { ToastModule } from 'primeng/toast';
import { finalize, timer } from 'rxjs';

@Component({
  selector: 'BancoRopa-finish-sale',
  standalone: true,
  imports: [ButtonModule, AccordionModule, CurrencyPipe],
  templateUrl: './finish-sale.component.html',
  styleUrl: './finish-sale.component.scss',
})
export class FinishSaleComponent {
  isPayingWithPoints = input.required<boolean>()
  saleRequest = input.required<CreateWardrobeSaleRequest>()
  saleCheck = input.required<CheckSaleResponse>()
  loading = signal(false)

  constructor(private salesS: SaleService, private messageS: MessageService, private router: Router) { }


  finishSale() {
    this.loading.set(true)
    this.salesS.finishSale(this.saleRequest(), this.isPayingWithPoints()).pipe(finalize(() => this.loading.set(false))).subscribe({
      next: () => {
        this.messageS.add({
          severity: 'success',
          summary: 'Se ha realizado la compra exitosamente'
        })
        timer(1500).subscribe(() => this.router.navigate([NavigationRoutes.WARDROBE_EMPLOYEE_HOME, "sales"]))
      }
    })
  }
}
