import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from '@environments/environment';
import { CreateDonorRequest } from '@model/request/bank/create-donor';
import { ClientInfo } from '@model/response/client/client-info';
import { ClientSale } from '@model/response/client/client-sale';
import { UserInfo } from '@model/response/user/user-info';
import { Observable, shareReplay } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class ClientService {

  private readonly PATH = "/user"

  constructor(private http: HttpClient) { }

  getClientInfo(uuid: string): Observable<ClientInfo>{
    const params = new HttpParams().set('uuid', uuid)
    return this.http.get<ClientInfo>(`${environment.apiUrl}${this.PATH}/get`, {params})
  }

  getClientSales(uuid: string, dates: Date[] | null): Observable<ClientSale[]>{
    let params = new HttpParams().set('uuid', uuid)
    if(dates != null){
      if(dates[0] != null){
        params = params.set('startDate', this.formatYear(dates[0]))
      }
      if(dates[1] != null){
        params = params.set('endDate', this.formatYear(dates[1]))
      }
    }
    return this.http.get<ClientSale[]>(`${environment.apiUrl}${this.PATH}/sales/get_all`, {params})
  }

  createClient(request: CreateDonorRequest){
    return this.http.post(`${environment.apiUrl}${this.PATH}/save/client`, request)
  }

  private formatYear(date: Date): string{
    return `${date.getFullYear()}-${(date.getMonth() + 1).toString().padStart(2, '0')}-${date.getDate().toString().padStart(2, '0')}`
  }
}
