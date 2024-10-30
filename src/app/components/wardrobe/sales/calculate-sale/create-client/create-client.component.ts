import { AsyncPipe } from '@angular/common';
import { Component, OnInit, output, signal } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { CreateDonorRequest } from '@model/request/bank/create-donor';
import { InternalType } from '@model/types/constants-config';
import { ClientService } from '@services/core/client.service';
import { InternalTypesService } from '@services/internal/internal-types.service';
import { MessageService } from 'primeng/api';
import { ButtonModule } from 'primeng/button';
import { DropdownModule } from 'primeng/dropdown';
import { InputNumberModule } from 'primeng/inputnumber';
import { InputTextModule } from 'primeng/inputtext';
import { finalize, Observable } from 'rxjs';

@Component({
  selector: 'BancoRopa-create-client',
  standalone: true,
  imports: [ReactiveFormsModule, AsyncPipe, InputTextModule, InputNumberModule, ButtonModule, DropdownModule],
  templateUrl: './create-client.component.html',
  styleUrl: './create-client.component.scss'
})
export class CreateClientComponent implements OnInit{
  typeDocument$!: Observable<InternalType[]>
  createClientForm: FormGroup 
  loading = signal(false)
  outputDocument = output<number>()

  constructor(private formBuilder: FormBuilder, private internalTypeS: InternalTypesService,
    private clientS: ClientService, private messageS: MessageService
  ){
    this.createClientForm = this.formBuilder.group({
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
    this.typeDocument$ = this.internalTypeS.getDocumentTypes()
  }

  createClient(){
    this.loading.set(true)
    const request: CreateDonorRequest = this.createClientForm.value
    request.documentNumber += ""
    this.clientS.createClient(request)
    .pipe(finalize(()=> this.loading.set(false)))
      .subscribe({
        next:()=>{
          this.messageS.add({
            severity: 'success',
            summary: `Se ha creado el donante, documento: ${request.documentNumber}`
          })
          this.outputDocument.emit(+request.documentNumber)
        }
      })
  }
}
