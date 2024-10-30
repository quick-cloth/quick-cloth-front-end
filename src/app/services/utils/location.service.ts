import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from '@environments/environment';
import { City, Department } from '@model/response/colombian-api';
import { InternalType } from '@model/types/constants-config';
import { withCache } from '@ngneat/cashew';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class LocationService {
  private readonly PATH = "/location"

  constructor(private http: HttpClient) { }

  getDepartments(): Observable<InternalType[]>{
    return this.http.get<InternalType[]>(`${environment.apiUrl}${this.PATH}/department/get_all`,{
      context: withCache()
    });
  }

  getCities(uuid: string): Observable<InternalType[]>{
    const params = new HttpParams().set("departmentUuid", uuid)
    return this.http.get<InternalType[]>(`${environment.apiUrl}${this.PATH}/city/get_all/by_department`, {
      context: withCache(),
      params: params
    })
  }
}
