import { Component, OnInit, output, signal } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { CreateDonorRequest } from '@model/request/bank/create-donor';
import { InternalType } from '@model/types/constants-config';
import { DonationService } from '@services/core/donation.service';
import { InternalTypesService } from '@services/internal/internal-types.service';
import { MessageService } from 'primeng/api';
import { ButtonModule } from 'primeng/button';
import { DropdownModule } from 'primeng/dropdown';
import { InputNumberModule } from 'primeng/inputnumber';
import { InputTextModule } from 'primeng/inputtext';
import { finalize } from 'rxjs';

@Component({
  selector: 'BancoRopa-create-donor',
  standalone: true,
  imports: [InputTextModule, InputNumberModule, ReactiveFormsModule, ButtonModule, DropdownModule],
  templateUrl: './create-donor.component.html',
  styleUrl: './create-donor.component.scss',
})
export class CreateDonorComponent implements OnInit {
  createDonorForm: FormGroup
  outputDocument = output<number>()
  documentType: InternalType[] = []
  loading = signal(false)
  constructor(private formBuilder: FormBuilder, private donationS: DonationService,
    private internalTypeS: InternalTypesService, private messageS: MessageService
  ){
    this.createDonorForm = this.formBuilder.group({
      name: ['', Validators.required],
      lastName: ['', Validators.required],
      //userName: ['', Validators.required],
      email: ['', [Validators.required, Validators.email]],
      phone: ['', Validators.required],
      documentNumber:['', Validators.required],
      typeDocumentUuid: ['', Validators.required],
    })
  }

  ngOnInit(): void {
    this.internalTypeS.getDocumentTypes().subscribe({
      next:(v)=>{
        this.documentType = v
      }
    })
  }

  createDonor(){
    this.loading.set(true)
    const request: CreateDonorRequest = this.createDonorForm.value
    request.documentNumber += ""
    this.donationS.createDonor(request)
    .pipe(finalize(()=> this.loading.set(false)))
      .subscribe({
        next:()=>{
          this.messageS.add({
            severity: 'success',
            summary: `Se ha creado el donante, documento: ${request.documentNumber}`
          })
          this.outputDocument.emit(this.createDonorForm.get("documentNumber")?.value)
        }
      })
  }
}
