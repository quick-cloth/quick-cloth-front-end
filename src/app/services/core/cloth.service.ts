import { HttpClient, HttpParams } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { environment } from "@environments/environment";
import { map, Observable } from "rxjs";

@Injectable({
    providedIn: 'root'
})
export class ClothService {
    constructor(private http: HttpClient) { }

    getClothUUID(options: {
        typeClothUuid: string
        typeGenderUuid: string
        typeStageUuid: string
        wardRopeUuid: string
    }): Observable<string> {
        const params = this.fromObjectToParams(options)
        return this.http.get<any>(`${environment.apiUrl}/clothe/get`, { params })
            .pipe(map(e => e.uuid))
    }

    private fromObjectToParams(obj: Record<string, any>): HttpParams {
        let params = new HttpParams()
        Object.keys(obj).forEach((key) => {
            if (obj[key] !== undefined && obj[key] !== null) {
                params = params.set(key, obj[key]);
            }
        })
        return params
    }
}