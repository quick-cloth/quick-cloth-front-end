import { Component, OnInit, signal } from '@angular/core';
import { FormArray, FormBuilder, FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { DonationService } from '@services/core/donation.service';
import { MessageService } from 'primeng/api';
import { ButtonModule } from 'primeng/button';
import { DropdownModule } from 'primeng/dropdown';
import { InputNumberModule } from 'primeng/inputnumber';
import { DialogModule } from 'primeng/dialog';
import { CreateDonorComponent } from './create-donor/create-donor.component';
import { InternalTypesService } from '@services/internal/internal-types.service';
import { finalize, Observable, timer } from 'rxjs';
import { InternalType } from '@model/types/constants-config';
import { HttpErrorResponse } from '@angular/common/http';
import { NavigationRoutes } from '@constants/navigation-routes';
import { AsyncPipe, NgClass } from '@angular/common';
import { CreateDonationRequest } from '@model/request/donation/create-donation';
import { AuthService } from '@services/internal/auth.service';
import { UserInfo } from '@model/response/user/user-info';
import { userExistsValidator } from '@validators/document.validator';

@Component({
  selector: 'BancoRopa-create',
  standalone: true,
  imports: [
    ReactiveFormsModule, DropdownModule, ButtonModule, NgClass,
    InputNumberModule, RouterLink, DialogModule, CreateDonorComponent,
    AsyncPipe
  ],
  templateUrl: './create-donation.component.html',
  styleUrl: './create-donation.component.scss',
})
export class CreateDonationComponent implements OnInit {
  donationForm: FormGroup
  donorInfo: UserInfo | undefined
  donorSubFormVisible = false

  typeClothe$!: Observable<InternalType[]>
  typeGender$!: Observable<InternalType[]>
  typeStage$!: Observable<InternalType[]>

  loading = signal(false)

  constructor(
    private messageS: MessageService, private formBuilder: FormBuilder,
    private internalTypeS: InternalTypesService,
    private donationS: DonationService, private router: Router, private auth: AuthService
  ) {
    this.donationForm = this.formBuilder.group({
      userUuid: new FormControl(null, {
        asyncValidators: [userExistsValidator(this.setDonorUUID.bind(this))],
        updateOn: 'change'
      }),
      clothesDonation: new FormArray([this.getClotheForm()])
    })
  }

  ngOnInit(): void {
    this.getTypes()
  }
  setDonorUUID(uuid: UserInfo){
    this.donorInfo = uuid
  }

  showDonorDialog() {
    this.donorSubFormVisible = true
  }

  donorDialogClosed(value: number) {
    this.donationForm.get("userUuid")?.setValue(value)
    this.donorSubFormVisible = false
  }

  protected get clothesFormArray() {
    const arr = this.donationForm.get("clothesDonation") as FormArray
    return arr.controls
  }

  protected addClotheSubForm() {
    const arr = this.donationForm.get("clothesDonation") as FormArray
    arr.push(this.getClotheForm())
  }

  protected deleteClotheSubForm(index: number) {
    const arr = this.donationForm.get("clothesDonation") as FormArray
    arr.removeAt(index)
  }

  createDonation() {
    this.loading.set(true)
    const donation: CreateDonationRequest = this.donationForm.value
    donation.clotheBankUuid = this.auth.userDetails?.placeUuid as string
    if(this.donorInfo){
      donation.userUuid = this.donorInfo.uuid
    }
    this.donationS.createDonation(donation).pipe(finalize(() => this.loading.set(false)))
      .subscribe({
        next: () => {
          this.messageS.add({
            severity: 'success',
            summary: 'Se ha creado la donación con éxito'
          })
          timer(1000).subscribe(() => this.router.navigate([NavigationRoutes.BANK_EMPLOYEE_HOME, "donations"]))
        },
        error: (err: HttpErrorResponse) => {
          this.messageS.add({
            severity: 'error',
            summary: `Error creando donación ${err.status}`
          })
        }
      })
  }
  private getClotheForm(): FormGroup {
    return this.formBuilder.group({
      typeClotheUuid: ['', Validators.required],
      typeStageUuid: ['', Validators.required],
      typeGenderUuid: ['', Validators.required],
      quantity: ['', Validators.required]
    })
  }
  private getTypes() {
    this.typeClothe$ = this.internalTypeS.getClotheTypes()
    this.typeGender$ = this.internalTypeS.getGenderTypes()
    this.typeStage$ = this.internalTypeS.getStageType()
  }
}
