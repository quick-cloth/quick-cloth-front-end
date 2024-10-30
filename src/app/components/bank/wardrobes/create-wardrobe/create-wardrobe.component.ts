import { Component, inject, OnInit, signal } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { ButtonModule } from 'primeng/button';
import { InputTextModule } from 'primeng/inputtext';
import { DropdownModule } from 'primeng/dropdown';
import { finalize, Observable, timer } from 'rxjs';
import { AsyncPipe } from '@angular/common';
import { ActivatedRoute, Router, RouterModule } from '@angular/router';
import { WardrobeService } from '@services/core/wardrobe.service';
import { MessageService } from 'primeng/api';
import { LocationService } from '@services/utils/location.service';
import { InternalType } from '@model/types/constants-config';
import { CreateWardrobeRequest } from '@model/request/wardrobe/create-wardrobe';
import { AuthService } from '@services/internal/auth.service';
import { NavigationRoutes } from '@constants/navigation-routes';
import { UpdateWardrobeRequest } from '@model/request/wardrobe/update-foundation';

@Component({
  selector: 'BancoRopa-create',
  standalone: true,
  imports: [AsyncPipe, ReactiveFormsModule,
    ButtonModule, InputTextModule, DropdownModule, RouterModule],
  templateUrl: './create-wardrobe.component.html',
  styleUrl: './create-wardrobe.component.scss',
})
export class CreateWardrobeComponent implements OnInit {
  createWardrobeForm: FormGroup

  modifyWardrobe: string | null = null

  allDepartments$!: Observable<InternalType[]>
  allCities$!: Observable<InternalType[]>

  loading = signal(false)

  constructor(private formBuilder: FormBuilder,
    private locationS: LocationService, private wardrobeS: WardrobeService,
    private messageService: MessageService, private router: Router, private auth: AuthService) {
    this.createWardrobeForm = this.formBuilder.group({
      uuid: [''], //Ignore on template, this is only used by the modify method
      cityUuid: new FormControl({ value: '', disabled: true }, Validators.required),
      address: ['', Validators.required],
      name: ['', Validators.required],
    })

    const route = inject(ActivatedRoute)
    const modify = route.snapshot.queryParamMap.get('modify')
    if (modify) {
      this.modifyWardrobe = modify
      this.createWardrobeForm.disable()
    }
  }
  ngOnInit(): void {
    this.allDepartments$ = this.locationS.getDepartments()

    if (this.modifyWardrobe) {
      this.wardrobeS.getWardrobeByUUID(this.modifyWardrobe).subscribe({
        next: (w) => {
          this.createWardrobeForm.patchValue(w)
          this.createWardrobeForm.get('cityUuid')?.setValue(w.city.uuid)
          this.createWardrobeForm.enable()
        }
      })
    }
  }

  getCities(event: any) {
    const dpto: string = event.value
    this.allCities$ = this.locationS.getCities(dpto);
    this.createWardrobeForm.get("cityUuid")?.enable()
  }

  checkForm() {
    if (this.modifyWardrobe) {
      this.modifyWardrobeSend()
    } else {
      this.createWardrobe()
    }
  }

  private createWardrobe() {
    this.loading.set(true)
    const request: CreateWardrobeRequest = this.createWardrobeForm.value
    request.clotheBankUuid = this.auth.userDetails?.placeUuid as string
    this.wardrobeS.createWardrobe(request).pipe(finalize(() => this.loading.set(false))).subscribe({
      next: () => {
        this.messageService.add({
          severity: "success",
          summary: "Se ha creado correctamente el ropero"
        })
        timer(1500).subscribe(() => this.router.navigate([NavigationRoutes.BANK_EMPLOYEE_HOME, 'wardrobes']))
      }
    })
  }

  private modifyWardrobeSend() {
    this.loading.set(true)
    const request: UpdateWardrobeRequest = this.createWardrobeForm.value
    request.clotheBankUuid = this.auth.userDetails?.placeUuid as string
    this.wardrobeS.updateWardrobe(request).pipe(finalize(()=>this.loading.set(false))).subscribe({
      next: () => {
        this.messageService.add({
          severity: 'warn',
          summary: `Ropero ${this.modifyWardrobe} modificado con éxito`
        })
        timer(1500).subscribe(() => this.router.navigate([NavigationRoutes.BANK_EMPLOYEE_HOME, 'wardrobes']))
      }
    })
  }
}
