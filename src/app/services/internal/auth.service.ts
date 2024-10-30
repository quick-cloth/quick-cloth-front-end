import { HttpClient, HttpParams } from '@angular/common/http';
import { Inject, Injectable } from '@angular/core';
import { environment } from '@environments/environment';
import { BehaviorSubject, finalize, map, Observable, of, switchMap, tap, throwError } from 'rxjs';
import { JwtHelperService } from '@auth0/angular-jwt';
import { USER_TYPE, UserDetails } from '@model/auth/user-details';
import { LoginResponse } from '@model/response/login-response';
import { DOCUMENT } from '@angular/common';
import { LoginRequest } from '@model/auth/login-request';
import { UserInfo } from '@model/response/user/user-info';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private readonly PATH = "/auth"
  private readonly internalStorageName = "BancoRopaUser"
  private userData: BehaviorSubject<UserDetails | null>

  constructor(private http: HttpClient, private jwt: JwtHelperService, @Inject(DOCUMENT) private document: Document) {
    const localStorage = document.defaultView?.localStorage
    if (localStorage) {
      let user = localStorage.getItem(this.internalStorageName);
      if (user !== null) {
        this.userData = new BehaviorSubject<UserDetails | null>(JSON.parse(user));
        return
      }
    }
    this.userData = new BehaviorSubject<UserDetails | null>(null);
  }

  public get userDetails() {
    return this.userData.value
  }

  public get isLogged() {
    return this.userData.value !== null
  }

  login(loginRequest: LoginRequest): Observable<UserDetails> {
    return this.http.post<LoginResponse>(`${environment.apiUrl}${this.PATH}/login`, loginRequest)
      .pipe(switchMap((res: LoginResponse) => {
        const details = this.extractClaims(res)
        this.userData.next(details)
        if(details.role === 'ROLE_CLIENT'){
          return of(details).pipe(tap((d) => this.storeSessionInfo(d)))
        }
        return this.getPersonalUUID(details.username, details.role).pipe(map((info: UserInfo) => {
          details.uuid = info.uuid
          details.email = info.email

          switch (details.role) {
            case 'ROLE_BANK_EMPLOYEE': {
              details.placeUuid = info.clotheBankUuid as string
              break
            }
            case 'ROLE_WARDROBE_EMPLOYEE': {
              details.placeUuid = info.wardRopeUuid as string
              break
            }
          }
          return details
        }), tap((d) => this.storeSessionInfo(d)))
      }))

  }

  logout(): Observable<any> {
    return of([]).pipe(finalize(() => {
      this.userData.next(null)
      this.removeToken()
    }))
  }

  unathorizedResponse() {
    this.userData.next(null)
    this.removeToken()
  }

  private getPersonalUUID(username: string, type: USER_TYPE): Observable<UserInfo> {
    let path;
    switch (type) {
      case 'ROLE_BANK_EMPLOYEE': {
        path = "/user/get/bank_employee"
        break
      }
      case 'ROLE_WARDROBE_EMPLOYEE': {
        path = "/user/get/wardrobe_employee"
        break
      }
    }
    const params = new HttpParams().set("username", username)
    return this.http.get<UserInfo>(`${environment.apiUrl}${path}`, { params })
  }

  private removeToken() {
    localStorage.removeItem(this.internalStorageName)
  }

  private storeSessionInfo(details: UserDetails): UserDetails {
    //const details = this.extractClaims(res)
    localStorage.setItem(this.internalStorageName, JSON.stringify(details));
    this.userData.next(details);
    return details
  }

  private extractClaims(response: LoginResponse): UserDetails {
    const decoded = this.jwt.decodeToken(response.token)
    return {
      username: decoded['sub'],
      token: response.token,
      role: decoded['role'],
      uuid: decoded['userUuid'],
      placeUuid: "",
      email: ""
    }
  }
}
