import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from '@environments/environment';
import { CreateFoundationRequest } from '@model/request/foundation/create-foundation';
import { UpdateFoundationRequest } from '@model/request/foundation/update-foundation';
import { Foundation } from '@model/response/foundation';
import { map, Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class FoundationService {
  private readonly PATH = "/foundation"

  constructor(private http: HttpClient) { }

  getFoundations(uuid: string): Observable<Foundation[]>{
    const params = new HttpParams().set("clotheBankUuid", uuid)
    return this.http.get<Foundation[]>(`${environment.apiUrl}${this.PATH}/get_all/clothe_bank`, {params})
  }

  getFoundationByUUID(uuid: string): Observable<Foundation>{
    const params = new HttpParams().set("foundationUuid", uuid)
    return this.http.get<Foundation>(`${environment.apiUrl}${this.PATH}/get`, {params})
  }

  searchFoundation(uuid: string, search: string = ""): Observable<Foundation[]>{
    return this.getFoundations(uuid).pipe(
      map(e => e.filter(i=>i.name.toLowerCase().includes(search.toLowerCase())))
    )
  }

  createFoundation(data: CreateFoundationRequest){
    return this.http.post(`${environment.apiUrl}${this.PATH}/save`, data)
  }

  updateFoundation(request: UpdateFoundationRequest){
    return this.http.put(`${environment.apiUrl}${this.PATH}/update`, request)
  }
}
