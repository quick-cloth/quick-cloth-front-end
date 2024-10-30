import { AsyncPipe, NgClass } from '@angular/common';
import { Component, OnInit, signal } from '@angular/core';
import { FormArray, FormBuilder, FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { LoadingElementComponent } from '@components/shared/loading/loading-element/loading-element.component';
import { NavigationRoutes } from '@constants/navigation-routes';
import { ReplyOrderRequest } from '@model/request/order/reply-order';
import { WardrobeOrder } from '@model/response/order/wardrobe-order';
import { InternalTypePipe } from '@pipes/internal-type.pipe';
import { OrderService } from '@services/core/order.service';
import { MessageService } from 'primeng/api';
import { ButtonModule } from 'primeng/button';
import { CheckboxModule } from 'primeng/checkbox';
import { InputNumberModule } from 'primeng/inputnumber';
import { InputTextModule } from 'primeng/inputtext';
import { TableModule } from 'primeng/table';
import { finalize, Observable, tap, timer } from 'rxjs';

@Component({
  selector: 'BancoRopa-wu-confirm-order',
  standalone: true,
  imports: [
    InputTextModule, ReactiveFormsModule, TableModule, CheckboxModule, ButtonModule,
    AsyncPipe, NgClass, InternalTypePipe, InputNumberModule, LoadingElementComponent
  ],
  templateUrl: './wu-confirm-order.component.html',
  styleUrl: './wu-confirm-order.component.scss'
})
export class WuConfirmOrderComponent implements OnInit{
  searchBar = new FormControl('')
  order$!: Observable<WardrobeOrder>
  confirmForm: FormGroup
  loading = signal(false)

  constructor(private formBuilder: FormBuilder, private route: ActivatedRoute,
    private orderS: OrderService, private messageS: MessageService, private router: Router
  ){
    this.confirmForm = this.formBuilder.group({
      clothes: this.formBuilder.array([])
    })
  }

  ngOnInit(): void {
    const orderUUID = this.route.snapshot.paramMap.get("uuid") || ''
    //TODO make request to know if exists or redirect to 404
    this.order$ = this.orderS.getWardrobeOrderByUUID(orderUUID).pipe(tap(order => {
      const arr = this.confirmForm.get('clothes') as FormArray
      order.orderList.forEach((e)=>{
        arr.push(this.formBuilder.group({
          clotheUuid: [e.clothe.uuid, Validators.required],
          quantity: ['', [Validators.required, Validators.max(e.deliveryValue)]]
        }))
      })
    }))
  }

  confirmOrder(order: WardrobeOrder){
    this.loading.set(true)
    const request: ReplyOrderRequest = {
      wardropeUuid: order.wardrobeUuid,
      clothes: this.confirmForm.value.clothes
    }

    this.orderS.confirmOrder(order.uuid, request).pipe(finalize(() => this.loading.set(false))).subscribe({
      next: () => {
        this.messageS.add({
          severity: 'success',
          summary: 'Se ha respondido a la orden con éxito'
        })
        timer(1500).subscribe(() => this.router.navigate([NavigationRoutes.WARDROBE_EMPLOYEE_HOME, 'orders']))
      }
    })
  }
}
