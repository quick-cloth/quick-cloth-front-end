import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from '@environments/environment';
import { CreateWardrobeSaleRequest } from '@model/request/sale/create-wardrobe-sale';
import { BestSeller } from '@model/response/sale/best-seller';
import { CheckSaleResponse } from '@model/response/sale/check-sale';
import { map, Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class SaleService {


  constructor(private http: HttpClient) {}

  checkSale(request: CreateWardrobeSaleRequest, isPayingWithPoints: boolean = false){
    const params =new HttpParams().set("payPoints", isPayingWithPoints)
    return this.http.post<CheckSaleResponse>(`${environment.apiUrl}/ward_robe/sale/check_sale/value`, request, {params})

  }

  getWardrobeBestSellers(uuid: string, dates: Date[] | null): Observable<BestSeller[]>{
    let params = new HttpParams().set('wardrobeUuid', uuid)
    if(dates != null){
      if(dates[0] != null){
        params = params.set('startDate', this.formatYear(dates[0]))
      }
      if(dates[1] != null){
        params = params.set('endDate', this.formatYear(dates[1]))
      }
    }
    return this.http.get<BestSeller[]>(`${environment.apiUrl}/ward_robe/top_selling_clothes`,{params})
  }

  //TODO REFACTOR LATER
  getClientUUID(document: string): Observable<string>{
    const params = new HttpParams().set("identification", document)
    return this.http.get<any>(`${environment.apiUrl}/user/get/identification`, {params})
      .pipe(map((e)=>e.uuid))
  }

  finishSale(saleRequest: CreateWardrobeSaleRequest, isPayingWithPoints: boolean = false) {
    const params =new HttpParams().set("payPoints", isPayingWithPoints)
    return this.http.post(`${environment.apiUrl}/ward_robe/sale/save`, saleRequest, {params})
  }

  private formatYear(date: Date): string{
    return `${date.getFullYear()}-${(date.getMonth() + 1).toString().padStart(2, '0')}-${date.getDate().toString().padStart(2, '0')}`
  }
}
