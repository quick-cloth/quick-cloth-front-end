import { AsyncPipe, DatePipe } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { LoadingElementComponent } from '@components/shared/loading/loading-element/loading-element.component';
import { ClientCampaign } from '@model/response/campaign/client-campaign';
import { InternalTypePipe } from '@pipes/internal-type.pipe';
import { CampaignService } from '@services/core/campaign.service';
import { AuthService } from '@services/internal/auth.service';
import { TabMenuModule } from 'primeng/tabmenu';
import { Observable } from 'rxjs';

@Component({
  selector: 'BancoRopa-campaigns',
  standalone: true,
  imports: [TabMenuModule, AsyncPipe, DatePipe, InternalTypePipe, LoadingElementComponent],
  templateUrl: './campaigns.component.html',
  styleUrl: './campaigns.component.scss'
})
export class CampaignsComponent implements OnInit {
  userUUID!: string
  campaigns$!: Observable<ClientCampaign[]>

  menuItems = [
    {
      label: 'Para ti', command: () => {
        this.campaigns$ = this.campaignS.getForUser(this.userUUID)
      }
    },
    {
      label: 'Todas', command: () => {
        this.campaigns$ = this.campaignS.getActiveCampaigns()
      }
    }
  ]
  constructor(private auth: AuthService, private campaignS: CampaignService){}

  ngOnInit(): void {
    this.userUUID = this.auth.userDetails?.uuid as string
    this.campaigns$ = this.campaignS.getForUser(this.userUUID)
  }
}
