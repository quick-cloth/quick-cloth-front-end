import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from '@environments/environment';
import { InternalType } from '@model/types/constants-config';
import { withCache } from '@ngneat/cashew';
import { map, Observable, shareReplay, tap } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class InternalTypesService {

  private readonly orderStatusMapping = [
    { server: "ON_WAY", local: "En camino" },
    { server: "DELIVERED", local: "Entregado" },
    { server: "RECEIVED", local: "Recibido" },
  ]

  constructor(private http: HttpClient) { }

  getClotheTypes(): Observable<InternalType[]> {
    return this.makeRequest("/clothe/type_clothe/get_all")
  }

  getGenderTypes(): Observable<InternalType[]> {
    return this.makeRequest("/clothe/type_gender/get_all")
  }

  getStageType(): Observable<InternalType[]> {
    return this.makeRequest("/clothe/type_stage/get_all")
  }

  getFoundationMeetType(): Observable<InternalType[]> {
    return this.makeRequest("/foundation/type_meet_us/get_all")
  }

  getCampaignType(): Observable<InternalType[]> {
    return this.makeRequest("/clothe_bank/type_campaign/get_all")
  }

  getOrderType(): Observable<InternalType[]> {
    return this.makeRequest("/ward_robe/order_state/get_all").pipe(
      map(original => {
        original.forEach(i => {
          i.name = this.translateOrderStatus(i.name)
        })
        return original
      })
    )
  }

  getDocumentTypes(): Observable<InternalType[]> {
    return this.makeRequest("/user/get_all/type_document")
  }

  translateOrderStatus(server: string): string {
    return this.orderStatusMapping.find(e => e.server === server)?.local as string
  }

  private makeRequest(path: string): Observable<InternalType[]> {
    return this.http.get<InternalType[]>(`${environment.apiUrl}${path}`, {
      context: withCache()
    }).pipe(shareReplay(1))
  }
}
