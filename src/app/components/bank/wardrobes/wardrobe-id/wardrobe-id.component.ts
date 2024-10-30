import { AsyncPipe, CurrencyPipe } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { NgIconComponent, provideIcons } from '@ng-icons/core';
import { lucideCircleDollarSign, lucidePackage, lucidePackageOpen } from '@ng-icons/lucide';
import { TabViewModule } from 'primeng/tabview';
import { WardrobeInventoryComponent } from './wardrobe-inventory/wardrobe-inventory.component';
import { WardrobeSalesComponent } from './wardrobe-sales/wardrobe-sales.component';
import { WarDrobe } from '@model/response/wardrobe/wardrobe';
import { Observable } from 'rxjs';
import { WardrobeService } from '@services/core/wardrobe.service';
import { LoadingElementComponent } from '@components/shared/loading/loading-element/loading-element.component';

@Component({
  selector: 'BancoRopa-wardrobe-id',
  standalone: true,
  imports: [
    AsyncPipe, CurrencyPipe, NgIconComponent, TabViewModule, WardrobeInventoryComponent,
    WardrobeSalesComponent, LoadingElementComponent],
  templateUrl: './wardrobe-id.component.html',
  styleUrl: './wardrobe-id.component.scss',
  providers: [provideIcons({ lucidePackageOpen, lucidePackage, lucideCircleDollarSign })]
})
export class WardrobeIdComponent implements OnInit {

  wardrobe$!: Observable<WarDrobe>

  constructor(private route: ActivatedRoute, private router: Router, private wardrobeS: WardrobeService) { }

  ngOnInit(): void {
    const wardrobeUUID = this.route.snapshot.paramMap.get("uuid") || ''
    //TODO make request to know if exists or redirect to 404
    this.wardrobe$ = this.wardrobeS.getWardrobeByUUID(wardrobeUUID)
  }

  protected get month() {
    const monthName = new Date().toLocaleString('default', { month: 'long' });
    return monthName.charAt(0).toUpperCase() + monthName.slice(1);
  }
}
