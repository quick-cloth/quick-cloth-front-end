import { Component, OnInit, signal } from '@angular/core';
import { FormArray, FormBuilder, FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { RouterLink } from '@angular/router';
import { CreateWardrobeSaleRequest } from '@model/request/sale/create-wardrobe-sale';
import { InternalType } from '@model/types/constants-config';
import { AuthService } from '@services/internal/auth.service';
import { SaleService } from '@services/core/sale.service';
import { WardrobeService } from '@services/core/wardrobe.service';
import { userExistsValidator } from '@validators/document.validator';
import { ButtonModule } from 'primeng/button';
import { CheckboxModule } from 'primeng/checkbox';
import { DialogModule } from 'primeng/dialog';
import { DropdownModule } from 'primeng/dropdown';
import { InputNumberModule } from 'primeng/inputnumber';
import { distinct, filter, finalize, from, map, Observable, shareReplay, switchMap, tap, toArray } from 'rxjs';
import { FinishSaleComponent } from './finish-sale/finish-sale.component';
import { CheckSaleResponse } from '@model/response/sale/check-sale';
import { UserInfo } from '@model/response/user/user-info';
import { CreateClientComponent } from './create-client/create-client.component';
import { WardrobeInventory } from '@model/response/wardrobe/wardrobe-inventory';
import { AsyncPipe, NgClass } from '@angular/common';

@Component({
  selector: 'BancoRopa-calculate-sale',
  standalone: true,
  imports: [ReactiveFormsModule, ButtonModule, DropdownModule, InputNumberModule,
    RouterLink, CheckboxModule, DialogModule, FinishSaleComponent, CreateClientComponent,
    AsyncPipe, NgClass
  ],
  templateUrl: './calculate-sale.component.html',
  styleUrl: './calculate-sale.component.scss',
})
export class CalculateSaleComponent implements OnInit {
  saleForm: FormGroup
  createClientDialog = false
  finishSaleDialog = false
  isPayingWithPoints = new FormControl(false)

  clientInfo: UserInfo | undefined

  avaliableClothes$!: Observable<WardrobeInventory[]>
  avaliableTypeClothes$!: Observable<InternalType[]>
  avaliableTypeGender = new Map<number, Observable<InternalType[]>>()
  avaliableTypeStage = new Map<number, Observable<InternalType[]>>()

  request!: CreateWardrobeSaleRequest
  checkResponse!: CheckSaleResponse

  loading = signal(false)


  constructor(private auth: AuthService, private wardrobeS: WardrobeService,
    private formBuilder: FormBuilder,
    private salesS: SaleService
  ) {
    this.saleForm = this.formBuilder.group({
      userUuid: new FormControl(null, {
        validators: [Validators.required],
        asyncValidators: [userExistsValidator(this.setClient.bind(this))],
        updateOn: 'change'
      }),
      saleList: new FormArray([this.createItemForm()])
    })
  }

  ngOnInit(): void {
    this.avaliableClothes$ = this.wardrobeS.getWardrobeInventory(this.auth.userDetails?.placeUuid!).pipe(shareReplay(1))

    //Filter duplicates from backend
    this.avaliableTypeClothes$ = this.avaliableClothes$.pipe(map(e =>
      e.map((i) => i.clothe.typeClothe)
    ), switchMap((e) => from(e).pipe(distinct(e => e.uuid))), toArray()
    )

  }

  setClient(user: UserInfo) {
    this.clientInfo = user
  }

  protected get saleListFormArray() {
    const arr = this.saleForm.get("saleList") as FormArray
    return arr.controls
  }

  protected addSaleItemSubForm() {
    const arr = this.saleForm.get("saleList") as FormArray
    arr.push(this.createItemForm())
  }

  protected deleteSaleItemSubForm(index: number) {
    const arr = this.saleForm.get("saleList") as FormArray
    arr.removeAt(index)
    this.avaliableTypeGender.delete(index)
    this.avaliableTypeStage.delete(index)
  }

  private createItemForm() {
    let index = 0
    if(this.saleForm === undefined){
      index = 0
    }else{
      index = this.saleListFormArray.length
    }
    const realForm = this.formBuilder.group({
      value: ['', Validators.required],
      clotheUuid: ['', Validators.required],
      quantity: ['', Validators.required]
    })
    realForm.disable()
    const typeForm = this.formBuilder.group({
      typeCloth: ['', Validators.required],
      typeGender: ['', Validators.required],
      typeStage: ['', Validators.required]
    })

    const typeStage$ = (typeForm.get('typeCloth') as FormControl).valueChanges.pipe(switchMap( 
      value => {
        typeForm.get('typeStage')?.reset(null, { emitValue: false })
        typeForm.get('typeGender')?.reset(null, { emitValue: false })
        return this.avaliableClothes$.pipe(map(e =>
          e.filter(i => i.clothe.typeClothe.uuid === value).map(i => i.clothe.typeStage)
        ), switchMap((e) => from(e).pipe(distinct(e => e.uuid))), toArray())
      })
    )
    this.avaliableTypeStage.set(index, typeStage$)
  

    const typeGender$ = (typeForm.get('typeStage') as FormControl).valueChanges.pipe(switchMap(value => {
      const typeClothUuid = typeForm.get('typeCloth')?.value
      typeForm.get('typeGender')?.reset(null, { emitValue: false })
      return this.avaliableClothes$.pipe(map(e =>
        e.filter(i => i.clothe.typeClothe.uuid === typeClothUuid && i.clothe.typeStage.uuid === value).map(i => i.clothe.typeGender)
      ), switchMap((e) => from(e).pipe(distinct(e => e.uuid))), toArray())
    }))

    this.avaliableTypeGender.set(index, typeGender$)


    typeForm.valueChanges.pipe(
      tap(() => realForm.disable()),
      filter(() => typeForm.valid),
      switchMap(value =>
        this.avaliableClothes$.pipe(map(e =>
          e.find(i => i.clothe.typeClothe.uuid === value.typeCloth &&
            i.clothe.typeGender.uuid === value.typeGender &&
            i.clothe.typeStage.uuid === value.typeStage
          )
        ))
      )
    ).subscribe({
      next: (c) => {
        realForm.enable()
        const uuid = c?.clothe.uuid as never
        realForm.get('clotheUuid')?.setValue(uuid)
      }
    })

    return this.formBuilder.group({
      local: typeForm,
      server: realForm
    })
  }


  checkSale() {
    this.loading.set(true)
    this.request = {
      wardRopeUuid: this.auth.userDetails?.placeUuid as string,
      userUuid: this.clientInfo?.uuid!,
      saleList: this.saleForm.get('saleList')?.value.map((e: any) => e.server)
    }

    this.salesS.checkSale(this.request, this.isPayingWithPoints.value as boolean).pipe(finalize(() => this.loading.set(false)))
      .subscribe({
        next: (res) => {
          this.checkResponse = res
          this.finishSaleDialog = true
        }
      })
  }

  showClientDialog() {
    this.createClientDialog = true
  }
  showFinishSaleDIalog() {
    this.finishSaleDialog = true
  }

  outputDocument(document: number){
    this.saleForm.get("userUuid")?.setValue(document)
    this.createClientDialog = false
  }
}
