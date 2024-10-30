import { Component, inject, OnInit, signal } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { CalendarModule } from 'primeng/calendar';
import { InputTextModule } from 'primeng/inputtext';
import { InputNumberModule } from 'primeng/inputnumber';
import { DropdownModule } from 'primeng/dropdown';
import { ActivatedRoute, Router, RouterModule } from '@angular/router';
import { MessageService } from 'primeng/api';
import { FoundationService } from '@services/core/foundation.service';
import { finalize, map, Observable, timer } from 'rxjs';
import { NavigationRoutes } from '@constants/navigation-routes';
import { CreateFoundationRequest } from '@model/request/foundation/create-foundation';
import { AuthService } from '@services/internal/auth.service';
import { InternalType } from '@model/types/constants-config';
import { InternalTypesService } from '@services/internal/internal-types.service';
import { LocationService } from '@services/utils/location.service';
import { AsyncPipe } from '@angular/common';
import { UpdateFoundationRequest } from '@model/request/foundation/update-foundation';

@Component({
  selector: 'BancoRopa-create',
  standalone: true,
  imports: [ReactiveFormsModule, CalendarModule, InputTextModule,
    InputNumberModule, DropdownModule, RouterModule, AsyncPipe],
  templateUrl: './create-foundation.component.html',
  styleUrl: './create-foundation.component.scss',
})
export class CreateFoundationComponent implements OnInit {
  createFoundationForm: FormGroup

  typeMeet$!: Observable<InternalType[]>
  allDepartments$!: Observable<InternalType[]>
  allCities$!: Observable<InternalType[]>

  modifyFoundation: string | null = null

  loading = signal(false)

  constructor(private formBuilder: FormBuilder, private internalTypeS: InternalTypesService,
    private messageS: MessageService, private foundationS: FoundationService,
    private router: Router, private auth: AuthService, private locationS: LocationService
  ) {
    this.createFoundationForm = this.formBuilder.group({
      uuid: [''], //Ignore on template form, this is only for modify form
      name: ['', Validators.required],
      nit: ['', Validators.required],
      phone: ['', Validators.required],
      legalRepresentative: ['', Validators.required],
      email: ['', [Validators.required, Validators.email]],
      typeMeetUsUuid: ['', Validators.required],
      contactUser: this.formBuilder.group({
        uuid: [''], //Same as above
        name: ['', Validators.required],
        last_name: ['', Validators.required],
        phone: ['', Validators.required],
        email: ['', [Validators.required, Validators.email]]
      }),
      cityUuid: [{ value: '', disabled: true }, Validators.required]
    })

    const route = inject(ActivatedRoute)
    const modify = route.snapshot.queryParamMap.get('modify')
    if (modify) {
      this.modifyFoundation = modify
      this.createFoundationForm.disable()
    }
  }

  ngOnInit(): void {
    this.allDepartments$ = this.locationS.getDepartments()
    this.typeMeet$ = this.internalTypeS.getFoundationMeetType()

    if (this.modifyFoundation) {
      this.foundationS.getFoundationByUUID(this.modifyFoundation)
        .pipe(
          map(f=>{
            const y: any = f
            y.typeMeetUsUuid = f.typeMeetUs.uuid
            y.cityUuid = f.city.uuid
            return y
          })
        )
        .subscribe({
          next: (v) => {
            this.createFoundationForm.patchValue(v)
            this.createFoundationForm.enable()
          }
        })
    }
  }

  protected checkForm() {
    if (this.modifyFoundation) {
      this.modifyFoundationSend()
    } else {
      this.createFoundation()
    }
  }

  private createFoundation() {
    this.loading.set(true)
    const request: CreateFoundationRequest = this.createFoundationForm.value
    request.clotheBankUuid = this.auth.userDetails?.placeUuid as string
    this.foundationS.createFoundation(request)
      .pipe(finalize(() => this.loading.set(false)))
      .subscribe({
        next: () => {
          this.messageS.add({
            severity: 'warning',
            summary: 'Se ha modificado satisfactoriamente'
          })
          timer(1500).subscribe(() => this.router.navigate([NavigationRoutes.BANK_EMPLOYEE_HOME, 'foundations']))
        }
      }
      )
  }

  private modifyFoundationSend() {
    this.loading.set(true)
    const request: UpdateFoundationRequest = this.createFoundationForm.value
    request.clotheBankUuid = this.auth.userDetails?.placeUuid as string
    this.foundationS.updateFoundation(request)
      .pipe(finalize(() => this.loading.set(false)))
      .subscribe({
        next: () => {
          this.messageS.add({
            severity: 'warn',
            summary: 'Se ha modificado satisfactoriamente',
            detail: `Fundación: ${this.modifyFoundation} editada`
          })
          timer(1500).subscribe(() => this.router.navigate([NavigationRoutes.BANK_EMPLOYEE_HOME, 'foundations']))
        }
      }
      )
  }

  getCities(event: any) {
    const dpto: string = event.value
    this.allCities$ = this.locationS.getCities(dpto);
    this.createFoundationForm.get("cityUuid")?.enable()
  }
}
