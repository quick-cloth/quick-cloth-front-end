import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from '@environments/environment';
import { CreateDonorRequest } from '@model/request/bank/create-donor';
import { CreateDonationRequest } from '@model/request/donation/create-donation';
import { Donation } from '@model/response/donation/donation';
import { map, Observable, of } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class DonationService {
  private readonly PATH = '/clothe_bank/donation';

  constructor(private http: HttpClient) {}

  createDonation(data: CreateDonationRequest) {
    return this.http.post(`${environment.apiUrl}${this.PATH}/save`, data);
  }

  getDonations(uuid: string): Observable<Donation[]> {
    const params = new HttpParams().set('clotheBankUuid', uuid);
    return this.http
      .get<Donation[]>(
        `${environment.apiUrl}${this.PATH}/get_all/clothe_bank`,
        { params }
      )
      .pipe(
        map((donations) =>
          donations.sort(
            (a, b) =>
              new Date(b.donationDate).getTime() -
              new Date(a.donationDate).getTime()
          )
        )
      );
  }

  searchDonation(uuid: string, search: string = ''): Observable<Donation[]> {
    return this.getDonations(uuid).pipe(
      map((e) => e.filter((i) => i.uuid.includes(search)))
    );
  }

  createDonor(request: CreateDonorRequest) {
    return this.http.post(`${environment.apiUrl}/user/save/donor`, request);
  }

  getDonorUUID(document: number): Observable<string> {
    //I shouldn't have to be doing this...
    const params = new HttpParams().set('identification', document);
    return this.http
      .get<any>(`${environment.apiUrl}/user/get/identification`, { params })
      .pipe(map((v) => v.uuid));
  }
}
