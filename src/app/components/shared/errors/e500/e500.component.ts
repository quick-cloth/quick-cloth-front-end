import { Component } from '@angular/core';
import { RouterModule } from '@angular/router';
import { NgIconComponent, provideIcons, provideNgIconsConfig } from '@ng-icons/core';
import { lucideTriangleAlert } from '@ng-icons/lucide';
import { ButtonModule } from 'primeng/button';

@Component({
  selector: 'BancoRopa-e500',
  standalone: true,
  imports: [ButtonModule, NgIconComponent, RouterModule],
  templateUrl: './e500.component.html',
  styleUrl: './e500.component.scss',
  providers:[provideNgIconsConfig({size: '5.5em'}),provideIcons({lucideTriangleAlert})]
})
export class E500Component {

}
