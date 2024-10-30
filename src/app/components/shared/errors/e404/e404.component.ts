import { Component } from '@angular/core';
import { ButtonModule } from 'primeng/button';
import { NgIconComponent, provideIcons, provideNgIconsConfig } from '@ng-icons/core';
import { lucideTriangleAlert } from '@ng-icons/lucide';
import { Router, RouterModule } from '@angular/router';

@Component({
  selector: 'BancoRopa-e404',
  standalone: true,
  imports: [ButtonModule, NgIconComponent, RouterModule],
  templateUrl: './e404.component.html',
  styleUrl: './e404.component.scss',
  providers:[provideNgIconsConfig({size: '5.5em'}),provideIcons({lucideTriangleAlert})]
})
export class E404Component {
}
