import { Component } from '@angular/core';
import { RouterModule } from '@angular/router';
import { NgIconComponent, provideIcons, provideNgIconsConfig } from '@ng-icons/core';
import { lucideLock } from '@ng-icons/lucide';
import { ButtonModule } from 'primeng/button';

@Component({
  selector: 'BancoRopa-e403',
  standalone: true,
  imports: [ButtonModule, NgIconComponent, RouterModule],
  templateUrl: './e403.component.html',
  styleUrl: './e403.component.scss',
  providers:[provideNgIconsConfig({size: '5.5em'}),provideIcons({lucideLock})]
})
export class E403Component {

}
