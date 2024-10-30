import { AsyncPipe, NgClass } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { LoadingElementComponent } from '@components/shared/loading/loading-element/loading-element.component';
import { BankOrder } from '@model/response/order/bank-order';
import { AuthService } from '@services/internal/auth.service';
import { InternalTypesService } from '@services/internal/internal-types.service';
import { OrderService } from '@services/core/order.service';
import { InputTextModule } from 'primeng/inputtext';
import { TableModule } from 'primeng/table';
import { Observable } from 'rxjs';
import { ButtonModule } from 'primeng/button';
import { RouterLink } from '@angular/router';

@Component({
  selector: 'BancoRopa-list-order',
  standalone: true,
  imports: [InputTextModule, TableModule, LoadingElementComponent, NgClass, AsyncPipe, ButtonModule, RouterLink],
  templateUrl: './list-order.component.html',
  styleUrl: './list-order.component.scss'
})
export class ListOrderComponent implements OnInit{
  orders$!: Observable<BankOrder[]> 
  constructor(private orderS: OrderService, private auth: AuthService, private internalTypeS: InternalTypesService){}

  ngOnInit(): void {
    this.orders$ = this.orderS.getOrders(this.auth.userDetails?.placeUuid as string)
  }

  protected translateOrderState(server: string){
    return this.internalTypeS.translateOrderStatus(server)
  }

  protected getOrderClass(server: string){
    return server.toLowerCase().replace(/_/g,'-')
  }

}
