import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from '@environments/environment';
import { CreateOrderRequest } from '@model/request/order/create-order';
import { ReplyOrderRequest } from '@model/request/order/reply-order';
import { BankOrder } from '@model/response/order/bank-order';
import { WardrobeOrder } from '@model/response/order/wardrobe-order';
import { map, Observable } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class OrderService {
  private readonly PATH = '';
  constructor(private http: HttpClient) {}

  getOrders(bankUuid: string): Observable<BankOrder[]> {
    const params = new HttpParams().set('clotheBankUuid', bankUuid);
    return this.http
      .get<BankOrder[]>(`${environment.apiUrl}/clothe_bank/orders/get_all`, {
        params,
      })
      .pipe(
        map((orders) =>
          orders.sort(
            (a, b) =>
              new Date(b.orderDate).getTime() - new Date(a.orderDate).getTime()
          )
        )
      );
  }

  getWardrobeOrders(wUUID: string): Observable<WardrobeOrder[]> {
    const params = new HttpParams().set('wardRobeUuid', wUUID);
    return this.http
      .get<WardrobeOrder[]>(`${environment.apiUrl}/ward_robe/order/get_all`, {
        params,
      })
      .pipe(
        map((orders) =>
          orders.sort(
            (a, b) =>
              new Date(b.orderDate).getTime() - new Date(a.orderDate).getTime()
          )
        )
      );
  }

  getWardrobeOrderByUUID(uuid: string): Observable<WardrobeOrder> {
    const params = new HttpParams().set('orderUuid', uuid);
    return this.http.get<WardrobeOrder>(
      `${environment.apiUrl}/ward_robe/order/get`,
      { params }
    );
  }

  createOrder(request: CreateOrderRequest): Observable<any> {
    return this.http.post(
      `${environment.apiUrl}/ward_robe/order/create`,
      request
    );
  }

  replyOrder(orderUuid: string, request: ReplyOrderRequest) {
    const params = new HttpParams().set('orderUuid', orderUuid);
    return this.http.post(
      `${environment.apiUrl}/clothe_bank/order/response`,
      request,
      { params }
    );
  }

  confirmOrder(orderUuid: string, request: ReplyOrderRequest) {
    const params = new HttpParams().set('orderUuid', orderUuid);
    return this.http.post(
      `${environment.apiUrl}/ward_robe/order/confirm`,
      request,
      { params }
    );
  }
}
