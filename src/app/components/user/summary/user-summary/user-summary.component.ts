import { Component, OnInit } from '@angular/core';
import { NgIcon, provideIcons } from '@ng-icons/core';
import { lucideBadgeDollarSign, lucideCirclePercent, lucideLogOut, lucidePiggyBank } from '@ng-icons/lucide';
import { AuthService } from '@services/internal/auth.service';
import { Router, RouterModule } from '@angular/router';
import { ClientInfo } from '@model/response/client/client-info';
import { Observable } from 'rxjs';
import { ClientService } from '@services/core/client.service';
import { AsyncPipe } from '@angular/common';
import { MessageService } from 'primeng/api';
import { ToastModule } from 'primeng/toast';

@Component({
  selector: 'BancoRopa-user-summary',
  standalone: true,
  imports: [
    NgIcon, AsyncPipe, RouterModule, ToastModule
  ],
  templateUrl: './user-summary.component.html',
  styleUrl: './user-summary.component.scss',
  providers: [provideIcons({ lucidePiggyBank, lucideBadgeDollarSign, lucideCirclePercent, lucideLogOut })]
})
export class UserSummaryComponent implements OnInit{

  clientInfo$!: Observable<ClientInfo>
  

  constructor(private auth: AuthService, private router: Router, private clientS: ClientService) {}

  ngOnInit(): void {
    this.clientInfo$ = this.clientS.getClientInfo(this.userUuid)
  }

  get userUuid(){
    return this.auth.userDetails?.uuid as string
  }

  logout(){
    this.auth.logout().subscribe(()=> this.router.navigate(['/login']))
  }
}
