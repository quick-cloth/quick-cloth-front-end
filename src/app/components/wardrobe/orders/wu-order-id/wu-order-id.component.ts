import { AsyncPipe, DatePipe, NgClass } from '@angular/common';
import { Component, OnInit, signal } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { LoadingElementComponent } from '@components/shared/loading/loading-element/loading-element.component';
import { WardrobeOrder } from '@model/response/order/wardrobe-order';
import { NgIcon, provideIcons } from '@ng-icons/core';
import { lucideBox, lucideCalendar, lucideClock, lucideTicketCheck } from '@ng-icons/lucide';
import { InternalTypesService } from '@services/internal/internal-types.service';
import { OrderService } from '@services/core/order.service';
import { ButtonModule } from 'primeng/button';
import { TableModule } from 'primeng/table';
import { finalize, Observable } from 'rxjs';
import { InternalTypePipe } from '@pipes/internal-type.pipe';
import { CreateOrderRequest } from '@model/request/order/create-order';
import { MessageService } from 'primeng/api';

@Component({
  selector: 'BancoRopa-wu-order-id',
  standalone: true,
  imports: [
    AsyncPipe, TableModule, NgClass, ButtonModule, DatePipe, NgIcon, LoadingElementComponent,
    InternalTypePipe
  ],
  templateUrl: './wu-order-id.component.html',
  styleUrl: './wu-order-id.component.scss',
  providers: [provideIcons({lucideCalendar, lucideTicketCheck, lucideBox, lucideClock})]
})
export class WuOrderIdComponent implements OnInit{
  order$!: Observable<WardrobeOrder>
  loading = signal(false)
  confirm = signal(false)
  constructor(private route: ActivatedRoute, private orderS: OrderService,
    private internalTypeS: InternalTypesService, private messageS: MessageService
  ){}

  ngOnInit(): void {
    const orderUUID = this.route.snapshot.paramMap.get("uuid") || ''
    //TODO make request to know if exists or redirect to 404
    this.order$ = this.orderS.getWardrobeOrderByUUID(orderUUID)
  }

  protected getOrderStateDisplay(server: string){
    return this.internalTypeS.translateOrderStatus(server)
  }

  duplicateClickEvent(order: WardrobeOrder){
    if(this.confirm()){
      this.duplicateOrder(order)
    }else{
      this.confirm.set(true)
    }
  }
  duplicateOrder(order: WardrobeOrder){
    this.loading.set(true)
    const request: CreateOrderRequest = {
      wardropeUuid: order.wardrobeUuid,
      clothes: order.orderList.map(i=>{
        return {clotheUuid: i.clothe.uuid, quantity: i.orderValue}
      })
    }

    this.orderS.createOrder(request).pipe(finalize(()=> this.loading.set(false))).subscribe({
      next:()=>{
        this.messageS.add({
          severity: 'warn',
          summary: 'Se ha duplicado correctarmente'
        })
      }
    })
  }

  noConfirm(){
    this.confirm.set(false)
  }
}
