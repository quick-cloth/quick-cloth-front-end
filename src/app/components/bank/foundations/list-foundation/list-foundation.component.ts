import { AsyncPipe } from '@angular/common';
import { Component, OnInit, signal } from '@angular/core';
import { FormControl, ReactiveFormsModule } from '@angular/forms';
import { ActivatedRoute, Router, RouterModule } from '@angular/router';
import { LoadingElementComponent } from '@components/shared/loading/loading-element/loading-element.component';
import { Foundation } from '@model/response/foundation';
import { NgIcon, provideIcons } from '@ng-icons/core';
import { lucideSearch, lucidePlus, lucideEllipsis, lucideEye, lucideSquarePen, lucideTrash2 } from '@ng-icons/lucide';
import { AuthService } from '@services/internal/auth.service';
import { FoundationService } from '@services/core/foundation.service';
import { ButtonModule } from 'primeng/button';
import { InputTextModule } from 'primeng/inputtext';
import { OverlayPanelModule } from 'primeng/overlaypanel';
import { TableModule } from 'primeng/table';
import { debounceTime, distinctUntilChanged, finalize, merge, Observable, switchMap } from 'rxjs';

@Component({
  selector: 'BancoRopa-list',
  standalone: true,
  imports: [
    ButtonModule, RouterModule, TableModule, InputTextModule, OverlayPanelModule,
    LoadingElementComponent, AsyncPipe, ReactiveFormsModule, NgIcon
  ],
  templateUrl: './list-foundation.component.html',
  styleUrl: './list-foundation.component.scss',
  providers: [
    provideIcons({
      lucideSearch, lucidePlus, lucideEllipsis,
      lucideEye, lucideSquarePen, lucideTrash2
    })
  ]
})
export class ListFoundationComponent implements OnInit{
  searchBar = new FormControl('')
  foundationList$!: Observable<Foundation[]>
  searching = signal(false)

  constructor(private foundationService: FoundationService, private auth: AuthService,
    private route: ActivatedRoute, private router: Router){}

  ngOnInit(): void {
    this.foundationList$ = merge(
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

  private triggerSearch(search: string){
    this.searching.set(true)
    return this.foundationService
      .searchFoundation(this.auth.userDetails?.placeUuid as string, search)
      .pipe(finalize(()=> this.searching.set(false)))
  }
}
