import { AsyncPipe, CurrencyPipe, DatePipe } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { RouterLink } from '@angular/router';
import { LoadingElementComponent } from '@components/shared/loading/loading-element/loading-element.component';
import { WarDrobe } from '@model/response/wardrobe/wardrobe';
import { WardrobeSale } from '@model/response/wardrobe/wardrobe-sales';
import { NgIcon, provideIcons } from '@ng-icons/core';
import { lucideCircleDollarSign, lucidePackage } from '@ng-icons/lucide';
import { AuthService } from '@services/internal/auth.service';
import { WardrobeService } from '@services/core/wardrobe.service';
import { ButtonModule } from 'primeng/button';
import { CheckboxModule } from 'primeng/checkbox';
import { InputTextModule } from 'primeng/inputtext';
import { TableModule } from 'primeng/table';
import { Observable } from 'rxjs';

@Component({
  selector: 'BancoRopa-wardrobe-sales',
  standalone: true,
  imports: [
    NgIcon, CurrencyPipe, LoadingElementComponent, InputTextModule, ButtonModule,
    RouterLink, TableModule, CheckboxModule, AsyncPipe, DatePipe
  ],
  templateUrl: './wu-sales.component.html',
  styleUrl: './wu-sales.component.scss',
  providers: [provideIcons({ lucidePackage, lucideCircleDollarSign })]
})
export class WuSalesComponent implements OnInit {

  wardrobe$!: Observable<WarDrobe>
  wardrobeSales$!: Observable<WardrobeSale[]>
  

  constructor(private auth: AuthService, private wardrobeS: WardrobeService
    ) { }

  ngOnInit(): void {
    const uuid = this.auth.userDetails?.placeUuid as string
    this.wardrobe$ = this.wardrobeS.getWardrobeByUUID(uuid)
    this.wardrobeSales$ = this.wardrobeS.getWardrobeSales(uuid)
  }
 

  protected get month() {
    const monthName = new Date().toLocaleString('default', { month: 'long' });
    return monthName.charAt(0).toUpperCase() + monthName.slice(1);
  }
}
