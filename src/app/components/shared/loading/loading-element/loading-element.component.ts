import { Component } from '@angular/core';
import { ProgressSpinnerModule } from 'primeng/progressspinner';

@Component({
  selector: 'BancoRopa-loading-element',
  standalone: true,
  imports: [ProgressSpinnerModule],
  templateUrl: './loading-element.component.html',
  styleUrl: './loading-element.component.scss'
})
export class LoadingElementComponent {}
