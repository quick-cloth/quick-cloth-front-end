import { AsyncPipe, NgClass } from '@angular/common';
import { Component, OnInit, signal } from '@angular/core';
import { FormArray, FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { LoadingElementComponent } from '@components/shared/loading/loading-element/loading-element.component';
import { NavigationRoutes } from '@constants/navigation-routes';
import { CreateThresholdRequest } from '@model/request/wardrobe/create-threshold';
import { WardrobeInventory } from '@model/response/wardrobe/wardrobe-inventory';
import { InternalTypePipe } from '@pipes/internal-type.pipe';
import { WardrobeService } from '@services/core/wardrobe.service';
import { AuthService } from '@services/internal/auth.service';
import { MessageService } from 'primeng/api';
import { ButtonModule } from 'primeng/button';
import { InputNumberModule } from 'primeng/inputnumber';
import { TableModule } from 'primeng/table';
import { finalize, Observable, tap, timer } from 'rxjs';

@Component({
  selector: 'BancoRopa-wu-threshold',
  standalone: true,
  imports: [
    ButtonModule, InputNumberModule, AsyncPipe, ReactiveFormsModule,
    RouterLink, TableModule, LoadingElementComponent, InternalTypePipe,
    NgClass
  ],
  templateUrl: './wu-threshold.component.html',
  styleUrl: './wu-threshold.component.scss'
})
export class WuThresholdComponent implements OnInit {
  avaliableClothes$!: Observable<WardrobeInventory[]>
  thresholdForm: FormGroup
  loading = signal(false)

  constructor(private formBuilder: FormBuilder, private wardrobeS: WardrobeService,
    private auth: AuthService, private messageS: MessageService, private router: Router
  ){
    this.thresholdForm = this.formBuilder.group({
      thresholds: this.formBuilder.array([])
    })
  }

  ngOnInit(): void {
    this.avaliableClothes$ = this.wardrobeS.getWardrobeInventory(this.auth.userDetails?.placeUuid as string)
      .pipe(tap(items => {
        const arr = this.thresholdForm.get('thresholds') as FormArray
        items.forEach( e => {
          arr.push(this.formBuilder.group({
            clotheUuid: [e.clothe.uuid, Validators.required],
            inventoryUuid: [e.uuid, Validators.required],
            minimumStock: [e.minimumStock, Validators.required],
            actualThreshold: [e.minimumStock, Validators.required]
          }))
        })
      }))
  }

  sendThresholds(){
    this.loading.set(true)
    const request: CreateThresholdRequest[] = this.thresholdForm.value.thresholds
      .filter((e: any) => e.minimumStock !== e.actualThreshold)
      .map(({actualThreshold, ...rest}: any) => rest)
    
    if(request.length === 0){
      timer(1500).subscribe(() => this.router.navigate([NavigationRoutes.WARDROBE_EMPLOYEE_HOME, 'inventory']))
      return
    }

    this.wardrobeS.createThresHolds(request).pipe(finalize(()=> this.loading.set(false)))
      .subscribe({
        next:()=>{
          this.messageS.add({
            severity: 'success',
            summary: 'Se han creado los umbrales correctamente'
          })
          timer(1500).subscribe(() => this.router.navigate([NavigationRoutes.WARDROBE_EMPLOYEE_HOME, 'inventory']))
        }
      })
  }

  

}
