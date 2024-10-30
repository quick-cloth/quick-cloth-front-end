import { AsyncPipe, DatePipe, NgClass } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { FormControl, ReactiveFormsModule } from '@angular/forms';
import { RouterLink } from '@angular/router';
import { LoadingElementComponent } from '@components/shared/loading/loading-element/loading-element.component';
import { WardrobeOrder } from '@model/response/order/wardrobe-order';
import { InternalType } from '@model/types/constants-config';
import { NgIcon, provideIcons } from '@ng-icons/core';
import { lucideCopyCheck, lucideEllipsis, lucideEye, lucideReply } from '@ng-icons/lucide';
import { AuthService } from '@services/internal/auth.service';
import { InternalTypesService } from '@services/internal/internal-types.service';
import { OrderService } from '@services/core/order.service';
import { ButtonModule } from 'primeng/button';
import { DropdownModule } from 'primeng/dropdown';
import { InputTextModule } from 'primeng/inputtext';
import { OverlayPanelModule } from 'primeng/overlaypanel';
import { TableModule } from 'primeng/table';
import { Observable } from 'rxjs';

@Component({
  selector: 'BancoRopa-list-wu-order',
  standalone: true,
  imports: [
    AsyncPipe, NgClass, DropdownModule, TableModule, ButtonModule,
    InputTextModule, ReactiveFormsModule, LoadingElementComponent,
    DatePipe, OverlayPanelModule, NgIcon, RouterLink
  ],
  templateUrl: './list-wu-order.component.html',
  styleUrl: './list-wu-order.component.scss',
  providers:[provideIcons({lucideEllipsis, lucideEye, lucideCopyCheck, lucideReply})]
})
export class ListWuOrderComponent implements OnInit{
  searchBar = new FormControl('')
  orderTypes$!: Observable<InternalType[]>
  wardrobeOrders$!: Observable<WardrobeOrder[]>

  constructor(private internalTypeS: InternalTypesService, private orderS: OrderService,
    private auth: AuthService
  ){}

  ngOnInit(): void {
    this.orderTypes$ = this.internalTypeS.getOrderType()
    this.wardrobeOrders$ = this.orderS.getWardrobeOrders(this.auth.userDetails?.placeUuid as string)
  }

  protected getOrderClass(order: string){
    return order.toLowerCase().replace(/_/g,'-')
  }

  protected getOrderDisplayName(order: string){
    return this.internalTypeS.translateOrderStatus(order)
  }

  

}
