import { AsyncPipe, NgClass } from '@angular/common';
import { Component, OnInit, signal } from '@angular/core';
import { FormArray, FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { LoadingElementComponent } from '@components/shared/loading/loading-element/loading-element.component';
import { WardrobeOrder } from '@model/response/order/wardrobe-order';
import { OrderService } from '@services/core/order.service';
import { ButtonModule } from 'primeng/button';
import { CheckboxModule } from 'primeng/checkbox';
import { InputNumberModule } from 'primeng/inputnumber';
import { TableModule } from 'primeng/table';
import { finalize, Observable, tap, timer } from 'rxjs';
import { ReplyOrderRequest } from '@model/request/order/reply-order';
import { MessageService } from 'primeng/api';
import { NavigationRoutes } from '@constants/navigation-routes';
import { InternalTypePipe } from '@pipes/internal-type.pipe';

@Component({
  selector: 'BancoRopa-reply-order',
  standalone: true,
  imports: [
    TableModule, AsyncPipe, CheckboxModule, LoadingElementComponent, NgClass, ButtonModule,
    InputNumberModule, ReactiveFormsModule, InternalTypePipe
  ],
  templateUrl: './reply-order.component.html',
  styleUrl: './reply-order.component.scss'
})
export class ReplyOrderComponent implements OnInit {
  order$!: Observable<WardrobeOrder>
  replyForm: FormGroup
  loading = signal(false)

  constructor(private orderS: OrderService, private route: ActivatedRoute,
    private formBuilder: FormBuilder, private messageS: MessageService, private router: Router
  ) {
    this.replyForm = this.formBuilder.group({
      clothes: this.formBuilder.array([])
    })
  }

  ngOnInit(): void {
    const uuid = this.route.snapshot.paramMap.get('uuid') as string
    this.order$ = this.orderS.getWardrobeOrderByUUID(uuid).pipe(tap(order => {
      const arr = this.replyForm.get('clothes') as FormArray
      order.orderList.forEach((e)=>{
        arr.push(this.formBuilder.group({
          clotheUuid: [e.clothe.uuid, Validators.required],
          quantity: ['', [Validators.required, Validators.max(e.orderValue)]]
        }))
      })
    }))
  }

  replyOrder(order: WardrobeOrder) {
    this.loading.set(true)
    const request: ReplyOrderRequest = {
      wardropeUuid: order.wardrobeUuid,
      clothes: this.replyForm.value.clothes
    }
    this.orderS.replyOrder(order.uuid, request).pipe(finalize(() => this.loading.set(false))).subscribe({
      next: () => {
        this.messageS.add({
          severity: 'success',
          summary: 'Se ha respondido a la orden con éxito'
        })
        timer(1500).subscribe(() => this.router.navigate([NavigationRoutes.BANK_EMPLOYEE_HOME, 'orders']))
      }
    })
  }
}
