import { AsyncPipe, CurrencyPipe, NgClass } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { LoadingElementComponent } from '@components/shared/loading/loading-element/loading-element.component';
import { BestSeller } from '@model/response/sale/best-seller';
import { AuthService } from '@services/internal/auth.service';
import { SaleService } from '@services/core/sale.service';
import { TableModule } from 'primeng/table';
import { Observable } from 'rxjs';
import { DropdownModule } from 'primeng/dropdown';
import { FormsModule } from '@angular/forms';
import { InternalTypesService } from '@services/internal/internal-types.service';
import { InternalType } from '@model/types/constants-config';
import { MultiSelectModule } from 'primeng/multiselect';
import { CalendarModule } from 'primeng/calendar';

@Component({
  selector: 'BancoRopa-wu-best-seller',
  standalone: true,
  imports: [
    TableModule, AsyncPipe, LoadingElementComponent, NgClass, CurrencyPipe,
    DropdownModule, FormsModule, MultiSelectModule, CalendarModule
  ],
  templateUrl: './wu-best-seller.component.html',
  styleUrl: './wu-best-seller.component.scss'
})
export class WuBestSellerComponent implements OnInit{
  bestSellers$!: Observable<BestSeller[]>
  typeGender$!: Observable<InternalType[]>
  typeCloth$!: Observable<InternalType[]>
  typeStage$!: Observable<InternalType[]>
  maxDate = new Date()

  dates: Date[] = []


  constructor(private auth: AuthService, private saleService: SaleService, private internalTypeS: InternalTypesService){}

  ngOnInit(): void {
    this.bestSellers$ = this.saleService.getWardrobeBestSellers(this.wardrobeUuid, null)
    this.typeGender$ = this.internalTypeS.getGenderTypes()
    this.typeCloth$ = this.internalTypeS.getClotheTypes()
    this.typeStage$ = this.internalTypeS.getStageType()
  }
  get wardrobeUuid(){
    return this.auth.userDetails?.placeUuid as string
  }

  triggerSearch(event: any){
    this.bestSellers$ = this.saleService.getWardrobeBestSellers(this.wardrobeUuid, event)
  }
}
