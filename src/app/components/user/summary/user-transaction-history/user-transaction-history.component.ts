import { AsyncPipe, DatePipe } from '@angular/common';
import { Component, input, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { LoadingElementComponent } from '@components/shared/loading/loading-element/loading-element.component';
import { ClientSale } from '@model/response/client/client-sale';
import { ClientService } from '@services/core/client.service';
import { AuthService } from '@services/internal/auth.service';
import { CalendarModule } from 'primeng/calendar';
import { TabMenuModule } from 'primeng/tabmenu';
import { BehaviorSubject, map, Observable, shareReplay } from 'rxjs';

@Component({
  selector: 'BancoRopa-user-transaction-history',
  standalone: true,
  imports: [DatePipe, AsyncPipe, TabMenuModule, LoadingElementComponent, FormsModule, CalendarModule],
  templateUrl: './user-transaction-history.component.html',
  styleUrl: './user-transaction-history.component.scss'
})
export class UserTransactionHistoryComponent implements OnInit {
  private salesSubject = new BehaviorSubject<ClientSale[]>([])
  clientSales$: Observable<ClientSale[]> = this.salesSubject.asObservable()
  showSales$!: Observable<ClientSale[]>
  dates: Date[] = []
  maxDate = new Date()
  userUUID: string = ""

  menuItems = [
    {
      label: 'Todos', command: () => {
        this.showSales$ = this.clientSales$
      }
    },
    {
      label: 'Acumulados', command: () => {
        this.showSales$ = this.clientSales$.pipe(map((e) => e.filter(e => e.earnedPoints > 0)))
      }
    },
    {
      label: 'Redimidos', command: () => {
        this.showSales$ = this.clientSales$.pipe(map((e) => e.filter(e => e.payPoints > 0)))
      }
    }
  ]

  constructor(private auth: AuthService, private clientS: ClientService) { }

  ngOnInit(): void {
    this.userUUID = this.auth.userDetails?.uuid as string
    this.doSearch(null)
    this.showSales$ = this.clientSales$
  }

  triggerSearch(event: any){
    this.doSearch(event)
  }

  private doSearch(dates: Date[] | null){
    this.clientS.getClientSales(this.userUUID, dates).pipe(shareReplay(1)).subscribe({
      next:(v)=>{
        this.salesSubject.next(v)
      }
    })
  }
}
