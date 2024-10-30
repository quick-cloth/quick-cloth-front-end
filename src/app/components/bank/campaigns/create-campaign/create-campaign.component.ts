import { HttpErrorResponse } from '@angular/common/http';
import { Component, OnInit, signal } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { NavigationRoutes } from '@constants/navigation-routes';
import { CreateCampaignRequest } from '@model/request/campaign/create-campaign';
import { InternalType } from '@model/types/constants-config';
import { AuthService } from '@services/internal/auth.service';
import { CampaignService } from '@services/core/campaign.service';
import { InternalTypesService } from '@services/internal/internal-types.service';
import { dateArrayLengthValidator } from '@validators/date-range.validator';
import { MessageService } from 'primeng/api';
import { ButtonModule } from 'primeng/button';
import { CalendarModule } from 'primeng/calendar';
import { DropdownModule } from 'primeng/dropdown';
import { InputNumberModule } from 'primeng/inputnumber';
import { InputTextModule } from 'primeng/inputtext';
import { InputTextareaModule } from 'primeng/inputtextarea';
import { finalize, forkJoin, timer } from 'rxjs';

@Component({
  selector: 'BancoRopa-create',
  standalone: true,
  imports: [ReactiveFormsModule, ButtonModule, InputTextModule,
    InputTextareaModule, CalendarModule, RouterLink,
    DropdownModule, InputNumberModule
  ],
  templateUrl: './create-campaign.component.html',
  styleUrl: './create-campaign.component.scss',
})
export class CreateCampaignComponent implements OnInit {
  createCampaignForm: FormGroup
  typeCampaign!: InternalType[] //API doesnt difference between comms channel and campaign type
  typeClothe!: InternalType[]
  typeGender!: InternalType[]
  typeStage!: InternalType[]

  loading = signal(false)

  constructor(private campaignS: CampaignService, private formBuilder: FormBuilder,
    private router: Router, private messageS: MessageService, private auth: AuthService,
    private internalTypeS: InternalTypesService
  ) {
    this.createCampaignForm = this.formBuilder.group({
      name: ['', Validators.required],
      message_campaign: ['', Validators.required],
      dates: ['', [Validators.required, dateArrayLengthValidator]],
      typeCampaignUuid: ['', Validators.required],
      typeClotheUuid: ['', Validators.required],
      typeGenderUuid: ['', ],
      typeStageUuid: ['', ],
      discount: ['', Validators.required]
    })
  }

  ngOnInit(): void {
    this.getAllInternalTypes()
  }

  createCampaign() {
    //FORM doesnt contaign bank uuid, inject it with the auth service
    //Dates are mixed
    const request: CreateCampaignRequest = this.createCampaignForm.value
    request.clotheBankUuid = this.auth.userDetails?.placeUuid as string
    const dates = this.createCampaignForm.get("dates")?.value
    request.creation_date = dates[0]
    request.end_date = dates[1]

    this.loading.set(true)
    
    this.campaignS.createCampaign(request).pipe(finalize(()=> this.loading.set(false))).subscribe({
      next: () => {
        this.messageS.add({
          severity: 'success',
          summary: 'Se ha creado la campaña'
        })
        timer(1500).subscribe(() => this.router.navigate([NavigationRoutes.BANK_EMPLOYEE_HOME,"campaigns"]))
      },
      error: (err: HttpErrorResponse) => {
        this.messageS.add({
          severity: 'error',
          summary: `Error creando la campaña: ${err.status}`
        })
      }
    })
  }

  private getAllInternalTypes() {
    forkJoin([
      this.internalTypeS.getCampaignType(),
      this.internalTypeS.getClotheTypes(),
      this.internalTypeS.getGenderTypes(),
      this.internalTypeS.getStageType()
    ]).subscribe({
      next: ([typeCampaign, typeClothe, typeGender, typeStage]) => {
        this.typeCampaign = typeCampaign
        this.typeClothe = typeClothe
        this.typeGender = typeGender
        this.typeStage = typeStage
      },
      error:(err: HttpErrorResponse)=>{
        this.messageS.add({
          severity: 'error',
          summary: `Error al obtener información de tipos ${err.status}`
        })
      }
    })
  }
}
