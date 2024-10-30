import { AsyncPipe, CurrencyPipe, DatePipe, NgClass } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { LoadingElementComponent } from '@components/shared/loading/loading-element/loading-element.component';
import { WardrobeSaleList } from '@model/response/wardrobe/wardrobe-sales';
import { WardrobeService } from '@services/core/wardrobe.service';
import { ProgressSpinnerModule } from 'primeng/progressspinner';
import { TableModule } from 'primeng/table';
import { Observable } from 'rxjs';

@Component({
  selector: 'BancoRopa-wardrobe-sale-detailed',
  standalone: true,
  imports: [NgClass, CurrencyPipe, DatePipe, TableModule, AsyncPipe, ProgressSpinnerModule, LoadingElementComponent],
  templateUrl: './wardrobe-sale-detailed.component.html',
  styleUrl: './wardrobe-sale-detailed.component.scss'
})
export class WardrobeSaleDetailedComponent implements OnInit {

  wardrobeSaleList$!: Observable<WardrobeSaleList>

  constructor(private wardrobeS: WardrobeService, private route: ActivatedRoute) { }

  ngOnInit(): void {
    const suuid = this.route.snapshot.paramMap.get("suuid") as string
    this.wardrobeSaleList$ = this.wardrobeS.getSaleInfo(suuid)
    //TODO check 404 when backend implements it
  }
}
