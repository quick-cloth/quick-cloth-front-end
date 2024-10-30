import { AsyncPipe, CurrencyPipe } from '@angular/common';
import { Component, OnInit, signal } from '@angular/core';
import { WarDrobe } from '@model/response/wardrobe/wardrobe';
import { NgIconComponent, provideIcons } from '@ng-icons/core';
import { lucideEllipsis, lucideEye, lucidePlus, lucideSearch, lucideSquarePen } from '@ng-icons/lucide';
import { WardrobeService } from '@services/core/wardrobe.service';
import { ButtonModule } from 'primeng/button';
import { InputTextModule } from 'primeng/inputtext';
import { TableModule } from 'primeng/table';
import { OverlayPanelModule } from 'primeng/overlaypanel';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { AuthService } from '@services/internal/auth.service';
import { debounceTime, distinctUntilChanged, finalize, merge, Observable, switchMap } from 'rxjs';
import { FormControl, ReactiveFormsModule } from '@angular/forms';
import { LoadingElementComponent } from '@components/shared/loading/loading-element/loading-element.component';

@Component({
  selector: 'BancoRopa-list',
  standalone: true,
  imports: [
    NgIconComponent, InputTextModule,ButtonModule,
    TableModule, OverlayPanelModule, RouterLink, CurrencyPipe,
    LoadingElementComponent, AsyncPipe, ReactiveFormsModule,
  ],
  templateUrl: './list-wardrobe.component.html',
  styleUrl: './list-wardrobe.component.scss',
  providers: [
    provideIcons({
      lucideSearch, lucidePlus, lucideEllipsis,
      lucideEye, lucideSquarePen
    })],
})
export class ListWardrobeComponent implements OnInit {
  searchBar: FormControl = new FormControl('')
  searching = signal(false)
  wardrobeList$!: Observable<WarDrobe[]>

  constructor(private route: ActivatedRoute, private wardrobeService: WardrobeService,
    private auth: AuthService, private router: Router){}

  ngOnInit(): void {
    this.wardrobeList$ = merge(
      this.searchBar.valueChanges.pipe(
        debounceTime(200),
        distinctUntilChanged(),
        switchMap(()=>{
          this.router.navigate([], {
            queryParams: { search: this.searchBar.value},
            queryParamsHandling: 'merge', // Keeps the existing query parameters
          });
          return this.triggerSearch(this.searchBar.value as string)
        })
      ),
      this.route.queryParams.pipe(switchMap(params=>{
        const search = params['search']
        if(search){
          this.searchBar.setValue(search)
        }
        return this.triggerSearch(search)
      }))
    )
  }

  protected triggerSearch(search: string){
    this.searching.set(true)
    return this.wardrobeService
      .searchWardrobe(this.auth.userDetails?.placeUuid as string, search)
      .pipe(finalize(()=> this.searching.set(false)))
  }
}
