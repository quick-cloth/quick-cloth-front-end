import { CommonModule } from '@angular/common';
import { Component, computed, input, output } from '@angular/core';
import { Router, RouterModule } from '@angular/router';
import { NavigationRoutes } from '@constants/navigation-routes';
import { USER_TYPE } from '@model/auth/user-details';
import { NgIconComponent, provideIcons } from '@ng-icons/core';
import {
  lucideAlarmClockPlus, lucideArchive, lucideArrowRightFromLine, lucideArrowLeftFromLine,
  lucideHeartHandshake, lucideInfo, lucideListTodo, lucideLogOut, lucidePackageOpen,
  lucideShirt,
  lucideListOrdered,
  lucideBookUser,
  lucideBadgeDollarSign,
  lucideMedal
} from '@ng-icons/lucide';
import { AuthService } from '@services/internal/auth.service';
import { AvatarModule } from 'primeng/avatar';

@Component({
  selector: 'BancoRopa-sidebar',
  standalone: true,
  imports: [NgIconComponent, AvatarModule, RouterModule, CommonModule],
  templateUrl: './sidebar.component.html',
  styleUrl: './sidebar.component.scss',
  providers: [
    provideIcons({
      lucideArrowRightFromLine, lucideArchive, lucideArrowLeftFromLine,
      lucidePackageOpen, lucideListTodo, lucideAlarmClockPlus,
      lucideHeartHandshake, lucideInfo, lucideLogOut, lucideShirt,
      lucideListOrdered, lucideBookUser, lucideBadgeDollarSign, lucideMedal
    })
  ]
})
export class SidebarComponent {
  isCollapsed = input.required<boolean>()
  changeIsCollapsed = output<boolean>()

  protected getArrowStatus = computed(() => {
    return this.isCollapsed() ? 'lucideArrowRightFromLine' : 'lucideArrowLeftFromLine'
  })

  //Doing this dynamically so if the navigation has restrictions could be removed or edited
  private readonly navItemsBank = [
    {
      routerLink: "wardrobes",
      icon: "lucideArchive",
      name: "Roperos"
    },
    {
      routerLink: "foundations",
      icon: "lucidePackageOpen",
      name: "Fundaciones"
    },
    {
      routerLink: "orders",
      icon: "lucideListTodo",
      name: "Pedidos"
    },
    {
      routerLink: "campaigns",
      icon: "lucideAlarmClockPlus",
      name: "Campañas"
    },
    {
      routerLink: "donations",
      icon: "lucideHeartHandshake",
      name: "Donaciones"
    }
  ]

  private readonly navItemsWardrobe = [
    {
      routerLink: "inventory",
      icon: "lucideShirt",
      name: "Prendas"
    },
    {
      routerLink: "orders",
      icon: "lucideListOrdered",
      name: "Pedidos"
    },
    {
      routerLink: "sales",
      icon: "lucideBadgeDollarSign",
      name: "Aportes"
    }
  ]

  constructor(private auth: AuthService, private router: Router) { }

  get userInfo() {
    return this.auth.userDetails
  }

  get navItems() {
    switch (this.auth.userDetails?.role as USER_TYPE) {
      case 'ROLE_BANK_EMPLOYEE': {
        return this.navItemsBank
      }
      case 'ROLE_WARDROBE_EMPLOYEE': {
        return this.navItemsWardrobe
      }
      default:{
        return []
      }
    }
  }

  get routerPrefix(){
    switch (this.auth.userDetails?.role as USER_TYPE) {
      case 'ROLE_BANK_EMPLOYEE': {
        return NavigationRoutes.BANK_EMPLOYEE_HOME
      }
      case 'ROLE_WARDROBE_EMPLOYEE': {
        return NavigationRoutes.WARDROBE_EMPLOYEE_HOME
      }
      default: {
        return null
      }
    }
  }

  toggleCollapse() {
    this.changeIsCollapsed.emit(!this.isCollapsed())
  }

  logout() {
    this.auth.logout().subscribe(() => this.router.navigateByUrl("/login"))
  }

}
