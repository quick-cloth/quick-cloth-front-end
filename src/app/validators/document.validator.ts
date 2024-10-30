import { HttpClient, HttpParams } from '@angular/common/http';
import { inject } from '@angular/core';
import { AbstractControl, AsyncValidatorFn, ValidationErrors } from '@angular/forms';
import { environment } from '@environments/environment';
import { UserInfo } from '@model/response/user/user-info';
import { catchError, debounceTime, distinctUntilChanged, first, Observable, of, switchMap } from 'rxjs';

export function userExistsValidator(storeUserInfo: (user: UserInfo) => void): AsyncValidatorFn {
    const http = inject(HttpClient)
    return (control: AbstractControl): Observable<ValidationErrors | null> => {
        if (!control.value) {
            return of(null)
        }
        return control.valueChanges.pipe(
            debounceTime(800),
            distinctUntilChanged(),
            switchMap(() => {
                if (control.value == null) {
                    return of(null)
                }
                const params = new HttpParams().set("identification", control.value)
                return http.get<UserInfo>(`${environment.apiUrl}/user/get/identification`, { params })
                    .pipe(
                        switchMap((user: UserInfo) => {
                            storeUserInfo(user)
                            return of(null)}), 
                        catchError(() => of({ documentExists: false })))
            }),
            first()
        )
    }
}