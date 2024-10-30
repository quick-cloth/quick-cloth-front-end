import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from '@environments/environment';
import { CreateCampaignRequest } from '@model/request/campaign/create-campaign';
import { Campaign } from '@model/response/campaign/campaign';
import { ClientCampaign } from '@model/response/campaign/client-campaign';
import { Observable, of } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class CampaignService {
  private readonly PATH = '/clothe_bank/campaign';

  constructor(private http: HttpClient) {}

  searchCampaingsByDates(uuid: string, dates: Date[]): Observable<Campaign[]> {
    let params = new HttpParams().set('clotheBankUuid', uuid);
    if (dates.length !== 0) {
      params = params
        .set('startDate', this.formatYear(dates[0]))
        .set('endDate', this.formatYear(dates[1]));
    }
    return this.http.get<Campaign[]>(
      `${environment.apiUrl}${this.PATH}/get_all`,
      { params }
    );
  }

  createCampaign(data: CreateCampaignRequest) {
    return this.http.post(`${environment.apiUrl}${this.PATH}/save`, data);
  }

  deleteCampaign(campaignId: string): Observable<void> {
    return this.http.delete<void>(
      `${environment.apiUrl}/campaigns/${campaignId}`
    );
  }

  getForUser(userUUID: string) {
    const params = new HttpParams().set('userUuid', userUUID);
    return this.http.get<ClientCampaign[]>(
      `${environment.apiUrl}/campaigns/get_for_user`,
      { params }
    );
  }

  getActiveCampaigns() {
    return this.http.get<ClientCampaign[]>(
      `${environment.apiUrl}/campaigns/get_active`
    );
  }

  private formatYear(date: Date): string {
    return `${date.getFullYear()}-${(date.getMonth() + 1)
      .toString()
      .padStart(2, '0')}-${date.getDate().toString().padStart(2, '0')}`;
  }
}
