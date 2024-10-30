import { AsyncPipe, NgClass } from '@angular/common';
import { Component, input, OnInit } from '@angular/core';
import { LoadingElementComponent } from '@components/shared/loading/loading-element/loading-element.component';
import { WardrobeInventory } from '@model/response/wardrobe/wardrobe-inventory';
import { WardrobeService } from '@services/core/wardrobe.service';
import { TableModule } from 'primeng/table';
import { Observable } from 'rxjs';

@Component({
  selector: 'BancoRopa-wardrobe-inventory',
  standalone: true,
  imports: [LoadingElementComponent, TableModule, AsyncPipe, NgClass],
  templateUrl: './wardrobe-inventory.component.html',
  styleUrl: './wardrobe-inventory.component.scss'
})
export class WardrobeInventoryComponent implements OnInit {
  wardrobeInventory$!: Observable<WardrobeInventory[]>
  wardrobeUUID = input.required<string>()

  constructor(private wardrobeS: WardrobeService) { }

  ngOnInit(): void {
    this.wardrobeInventory$ = this.wardrobeS.getWardrobeInventory(this.wardrobeUUID())
  }

}
