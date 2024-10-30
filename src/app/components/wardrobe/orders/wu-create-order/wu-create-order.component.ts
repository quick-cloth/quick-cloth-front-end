import { AsyncPipe } from '@angular/common';
import { Component, OnInit, signal } from '@angular/core';
import { FormArray, FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { NavigationRoutes } from '@constants/navigation-routes';
import { CreateOrderRequest } from '@model/request/order/create-order';
import { InternalType } from '@model/types/constants-config';
import { AuthService } from '@services/internal/auth.service';
import { ClothService } from '@services/core/cloth.service';
import { InternalTypesService } from '@services/internal/internal-types.service';
import { OrderService } from '@services/core/order.service';
import { MessageService } from 'primeng/api';
import { ButtonModule } from 'primeng/button';
import { DropdownModule } from 'primeng/dropdown';
import { InputNumberModule } from 'primeng/inputnumber';
import { catchError, debounceTime, distinctUntilChanged, filter, finalize, Observable, of, switchMap, timer } from 'rxjs';

@Component({
  selector: 'BancoRopa-wu-create-order',
  standalone: true,
  imports: [
    ReactiveFormsModule, DropdownModule, ButtonModule, AsyncPipe, InputNumberModule,
    ButtonModule
  ],
  templateUrl: './wu-create-order.component.html',
  styleUrl: './wu-create-order.component.scss'
})
export class WuCreateOrderComponent implements OnInit {
  createOrderForm: FormGroup
  loading = signal(false)

  clothType$!: Observable<InternalType[]>
  genderType$!: Observable<InternalType[]>
  stageType$!: Observable<InternalType[]>

  constructor(
    private formBuilder: FormBuilder, private orderS: OrderService,
    private auth: AuthService, private clothS: ClothService,
    private internalTypeS: InternalTypesService, private messageS: MessageService,
    private router: Router
  ) {

    this.createOrderForm = this.formBuilder.group({
      clothes: this.formBuilder.array([this.getClothForm()])
    })

  }

  ngOnInit(): void {
    this.clothType$ = this.internalTypeS.getClotheTypes()
    this.genderType$ = this.internalTypeS.getGenderTypes()
    this.stageType$ = this.internalTypeS.getStageType()
  }

  protected addClothForm() {
    this.getClothFormArray().push(this.getClothForm())
  }

  protected deleteClothForm(index: number) {
    this.getClothFormArray().removeAt(index)
  }

  protected getClothFormArray() {
    return this.createOrderForm.get('clothes') as FormArray
  }

  private getClothForm() {
    const typeForm = this.formBuilder.group({
      typeClotheUuid: ['', Validators.required],
      typeGenderUuid: ['', Validators.required],
      typeStageUuid: ['', Validators.required],
    })
    const clothForm = this.formBuilder.group({
      clotheUuid: ['', Validators.required],
      quantity: ['', Validators.required]
    })

    typeForm.valueChanges.pipe(
      debounceTime(200),
      distinctUntilChanged(),
      filter(() => typeForm.valid),
      switchMap((v: any) => {
        clothForm.disable()
        return this.clothS.getClothUUID({
          ...v,
          wardRopeUuid: this.auth.userDetails?.placeUuid as string
        }).pipe(
          catchError(() => of(null)) //SHOULDNT HAPPEN THO
        )
      }),
    ).subscribe({
      next: (uuid: string | null) => {
        clothForm.enable()
        clothForm.get('clotheUuid')?.setValue(uuid)
      }
    })
    return this.formBuilder.group({
      types: typeForm,
      cloth: clothForm
    })
  }

  createOrder() {
    this.loading.set(true)
    const request: CreateOrderRequest = {
      wardropeUuid: this.auth.userDetails?.placeUuid as string,
      clothes: this.createOrderForm.value.clothes.map((e:any) => e.cloth)
    }
    this.orderS.createOrder(request).pipe(finalize(()=>this.loading.set(false))).subscribe({
      next: ()=>{
        this.messageS.add({
          severity: 'success',
          summary: `Se ha creado exitosamente la orden`
        })
        timer(1500).subscribe(() => this.router.navigate([NavigationRoutes.WARDROBE_EMPLOYEE_HOME,"orders"]))
      }
    })
  }
}
