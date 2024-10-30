import { AsyncPipe, DatePipe } from '@angular/common';
import { Component, OnInit, signal } from '@angular/core';
import { FormControl, ReactiveFormsModule } from '@angular/forms';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { LoadingElementComponent } from '@components/shared/loading/loading-element/loading-element.component';
import { Donation } from '@model/response/donation/donation';
import { AuthService } from '@services/internal/auth.service';
import { DonationService } from '@services/core/donation.service';
import { ButtonModule } from 'primeng/button';
import { InputTextModule } from 'primeng/inputtext';
import { TableModule } from 'primeng/table';
import { debounceTime, distinctUntilChanged, finalize, merge, Observable, switchMap } from 'rxjs';

@Component({
  selector: 'BancoRopa-list-donation',
  standalone: true,
  imports: [
    RouterLink, ButtonModule, InputTextModule, LoadingElementComponent,
    TableModule, DatePipe, AsyncPipe, ReactiveFormsModule
  ],
  templateUrl: './list-donation.component.html',
  styleUrl: './list-donation.component.scss',
})
export class ListDonationComponent implements OnInit {
  donations$!: Observable<Donation[]>

  searchBar = new FormControl('')

  searching = signal(false)
  constructor(private auth: AuthService, private donationS: DonationService,
    private route: ActivatedRoute, private router: Router){}

  ngOnInit(): void {
    this.donations$ = merge(
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
    return this.donationS
      .searchDonation(this.auth.userDetails?.placeUuid as string, search)
      .pipe(finalize(()=> this.searching.set(false)))
  }
}
