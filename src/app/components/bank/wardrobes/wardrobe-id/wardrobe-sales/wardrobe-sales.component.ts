import { AsyncPipe, CurrencyPipe } from '@angular/common';
import { Component, input, OnInit, signal } from '@angular/core';
import { FormControl, ReactiveFormsModule } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { LoadingElementComponent } from '@components/shared/loading/loading-element/loading-element.component';
import { WardrobeSale } from '@model/response/wardrobe/wardrobe-sales';
import { WardrobeService } from '@services/core/wardrobe.service';
import { InputTextModule } from 'primeng/inputtext';
import { TableModule } from 'primeng/table';
import { debounceTime, distinctUntilChanged, finalize, merge, Observable, of, switchMap } from 'rxjs';

@Component({
  selector: 'BancoRopa-wardrobe-sales',
  standalone: true,
  imports: [
    CurrencyPipe, TableModule, LoadingElementComponent, InputTextModule, ReactiveFormsModule,
    AsyncPipe
  ],
  templateUrl: './wardrobe-sales.component.html',
  styleUrl: './wardrobe-sales.component.scss',
})
export class WardrobeSalesComponent implements OnInit {
  searchControl = new FormControl('')
  loading = signal(false)
  wardrobeSales$!: Observable<WardrobeSale[]>
  wardrobeUUID = input.required<string>()
  constructor(private wardrobeS: WardrobeService, private router: Router,
    private route: ActivatedRoute) { }

  ngOnInit(): void {
    this.wardrobeSales$ = merge(
      this.wardrobeS.getWardrobeSales(this.wardrobeUUID()),
      this.searchControl.valueChanges.pipe(
        debounceTime(200),
        distinctUntilChanged(),
        switchMap((search) => this.searchSales(search as string))
      )
    )
  }

  private searchSales(search: string): Observable<WardrobeSale[]> {
    this.loading.set(true)
    return this.wardrobeS.searchWardrobeSale(this.wardrobeUUID(), search)
      .pipe(
        finalize(()=> this.loading.set(false))
      )
  }

  detailedSale(uuid: string) {
    this.router.navigate(["sales", uuid], { relativeTo: this.route })
  }
}
