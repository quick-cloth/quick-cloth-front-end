import { AsyncPipe, CurrencyPipe, DatePipe } from '@angular/common';
import { Component } from '@angular/core';
import { FormControl } from '@angular/forms';
import { RouterLink } from '@angular/router';
import { LoadingElementComponent } from '@components/shared/loading/loading-element/loading-element.component';
import { Campaign } from '@model/response/campaign/campaign';
import { NgIconComponent, provideIcons } from '@ng-icons/core';
import {
  lucideEllipsis,
  lucideEye,
  lucideSquarePen,
  lucideTrash2,
} from '@ng-icons/lucide';
import { AuthService } from '@services/internal/auth.service';
import { CampaignService } from '@services/core/campaign.service';
import { ButtonModule } from 'primeng/button';
import { CalendarModule } from 'primeng/calendar';
import { TableModule } from 'primeng/table';
import { ProgressSpinnerModule } from 'primeng/progressspinner';
import { Observable } from 'rxjs';

@Component({
  selector: 'BancoRopa-list',
  standalone: true,
  imports: [
    CalendarModule,
    TableModule,
    ButtonModule,
    ProgressSpinnerModule,
    NgIconComponent,
    RouterLink,
    LoadingElementComponent,
    DatePipe,
    CurrencyPipe,
    AsyncPipe,
  ],
  templateUrl: './list-campaign.component.html',
  styleUrl: './list-campaign.component.scss',
  providers: [
    provideIcons({
      lucideEllipsis,
      lucideEye,
      lucideSquarePen,
      lucideTrash2,
    }),
  ],
})
export class ListCampaignComponent {
  searchBar = new FormControl('');
  dates: Date[] = [];
  campaignList$!: Observable<Campaign[]>;
  isDeleting: boolean = false;

  constructor(private auth: AuthService, private campaignS: CampaignService) {
    this.fetchDates();
  }

  searchDates(date: Date) {
    if (this.dates[0] == undefined) {
      this.dates[0] = date;
    } else {
      this.dates[1] = date;
      this.fetchDates();
    }
  }

  fetchDates() {
    this.campaignList$ = this.campaignS.searchCampaingsByDates(
      this.auth.userDetails?.placeUuid as string,
      this.dates
    );
    this.clearDates();
  }

  deleteCampaign(campaignId: string): void {
    this.isDeleting = true;

    this.campaignS.deleteCampaign(campaignId).subscribe(() => {
      this.isDeleting = false;

      // Refresh the campaign list or handle the UI update
      this.campaignList$ = this.campaignS.searchCampaingsByDates(
        this.auth.userDetails?.placeUuid as string,
        this.dates
      );
    });
  }

  protected clearDatesCallback() {
    this.clearDates();
    this.fetchDates();
  }

  private clearDates() {
    this.dates = [];
  }
}
