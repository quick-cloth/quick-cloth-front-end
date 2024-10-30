import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from '@environments/environment';
import { CreateThresholdRequest } from '@model/request/wardrobe/create-threshold';
import { CreateWardrobeRequest } from '@model/request/wardrobe/create-wardrobe';
import { UpdateWardrobeRequest } from '@model/request/wardrobe/update-foundation';
import { WarDrobe } from '@model/response/wardrobe/wardrobe';
import { WardrobeInventory } from '@model/response/wardrobe/wardrobe-inventory';
import {
  WardrobeSale,
  WardrobeSaleList,
} from '@model/response/wardrobe/wardrobe-sales';
import { map, Observable } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class WardrobeService {
  private readonly PATH = '/ward_robe';

  constructor(private http: HttpClient) {}

  getWardrobes(bankUUID: string): Observable<WarDrobe[]> {
    const params = new HttpParams().set('clotheBankUuid', bankUUID);
    return this.http.get<WarDrobe[]>(
      `${environment.apiUrl}${this.PATH}/get_all/clothe_bank`,
      { params }
    );
  }

  searchWardrobe(bankUUID: string, search: string = '') {
    //TODO check if somehow the backend is going to make this...
    return this.getWardrobes(bankUUID).pipe(
      map((e) =>
        e.filter((i) =>
          i.name.toLowerCase().includes(search.toLocaleLowerCase())
        )
      )
    );
  }

  createWardrobe(data: CreateWardrobeRequest) {
    return this.http.post(`${environment.apiUrl}${this.PATH}/save`, data);
  }

  updateWardrobe(request: UpdateWardrobeRequest) {
    return this.http.put(`${environment.apiUrl}${this.PATH}/update`, request);
  }

  getWardrobeByUUID(uuid: string): Observable<WarDrobe> {
    const params = new HttpParams().set('uuid', uuid);
    return this.http.get<WarDrobe>(`${environment.apiUrl}${this.PATH}/get`, {
      params,
    });
  }

  getWardrobeSales(uuid: string): Observable<WardrobeSale[]> {
    const params = new HttpParams().set('wardRopeUuid', uuid);
    return this.http
      .get<WardrobeSale[]>(`${environment.apiUrl}${this.PATH}/sale/get_all`, {
        params,
      })
      .pipe(
        map((sales) =>
          sales.sort(
            (a, b) => new Date(b.date).getTime() - new Date(a.date).getTime()
          )
        )
      );
  }

  searchWardrobeSale(uuid: string, search: string = '') {
    return this.getWardrobeSales(uuid).pipe(
      map((e) => e.filter((i) => i.uuid.includes(search)))
    );
  }

  getSaleInfo(suuid: string): Observable<WardrobeSaleList> {
    const params = new HttpParams().set('saleuuid', suuid);
    return this.http.get<WardrobeSaleList>(
      `${environment.apiUrl}${this.PATH}/sale/get`,
      { params }
    );
  }

  getWardrobeInventory(uuid: string): Observable<WardrobeInventory[]> {
    const params = new HttpParams().set('wardRopeUuid', uuid);
    return this.http.get<WardrobeInventory[]>(
      `${environment.apiUrl}${this.PATH}/inventory/get_all`,
      { params }
    );
  }

  searchInventory(uuid: string, search: string = '') {
    return this.getWardrobeInventory(uuid).pipe(
      map((e) =>
        e.filter((i) =>
          i.clothe.typeClothe.name.toLowerCase().includes(search.toLowerCase())
        )
      )
    );
  }

  createThresHolds(request: CreateThresholdRequest[]) {
    return this.http.post(
      `${environment.apiUrl}${this.PATH}/inventory/minimum_stocks/save`,
      request
    );
  }
}
