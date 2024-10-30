import { AsyncPipe, NgClass } from '@angular/common';
import { Component, signal } from '@angular/core';
import { FormControl, ReactiveFormsModule } from '@angular/forms';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { WardrobeInventoryComponent } from '@components/bank/wardrobes/wardrobe-id/wardrobe-inventory/wardrobe-inventory.component';
import { LoadingElementComponent } from '@components/shared/loading/loading-element/loading-element.component';
import { WardrobeInventory } from '@model/response/wardrobe/wardrobe-inventory';
import { NgIcon, provideIcons } from '@ng-icons/core';
import { lucidePackageOpen } from '@ng-icons/lucide';
import { AuthService } from '@services/internal/auth.service';
import { WardrobeService } from '@services/core/wardrobe.service';
import { ButtonModule } from 'primeng/button';
import { InputTextModule } from 'primeng/inputtext';
import { TableModule } from 'primeng/table';
import { Observable, merge, debounceTime, distinctUntilChanged, switchMap, finalize, tap } from 'rxjs';
import { MessagesModule } from 'primeng/messages';
import { MessageService } from 'primeng/api';

@Component({
  selector: 'BancoRopa-wu-list-inventory',
  standalone: true,
  imports: [
    NgIcon, TableModule, InputTextModule, WardrobeInventoryComponent, AsyncPipe,
    LoadingElementComponent, ReactiveFormsModule, NgClass, ButtonModule, RouterLink,
    MessagesModule
  ],
  templateUrl: './wu-list-inventory.component.html',
  styleUrl: './wu-list-inventory.component.scss',
  providers: [provideIcons({lucidePackageOpen})]
})
export class WuListInventoryComponent {
  wardrobeUUID!: string
  wardrobeInventory$!: Observable<WardrobeInventory[]>

  searchBar = new FormControl('')
  searching = signal(false)

  messages: any[] = []

  constructor(private wardrobeS: WardrobeService, private auth: AuthService, 
    private router: Router, private route: ActivatedRoute, private messageS: MessageService){}

  ngOnInit(): void {
    this.wardrobeUUID = this.auth.userDetails?.placeUuid as string
    this.wardrobeInventory$ = merge(
      this.searchBar.valueChanges.pipe(
        debounceTime(200),
        distinctUntilChanged(),
        switchMap(()=>{
          this.router.navigate([], {
            queryParams: { search: this.searchBar.value},
            queryParamsHandling: 'merge', // Keeps the existing query parameters
          });
          return this.triggerSearch(this.searchBar.value as string)
        })
      ),
      this.route.queryParams.pipe(switchMap(params=>{
        const search = params['search']
        if(search){
          this.searchBar.setValue(search)
        }
        return this.triggerSearch(search)
      }))
    ).pipe(tap((e)=>{
      this.messages = []
      e.forEach(i=>{
        if(i.stock < i.minimumStock){
          this.messages.push({
            severity: 'warn',
            summary: `${i.clothe.typeClothe.name} - ${i.clothe.typeStage.name} - ${i.clothe.typeGender.name}`,
            detail: `Cantidad actual: ${i.stock}, cantidad minima: ${i.minimumStock}`
          })
        }
      })
    }))
  }

  protected getStock(inventory: WardrobeInventory[]): number{
    return inventory.map(e => e.stock).reduce(((s1, s2) => s1+s2), 0)
  }

  protected triggerSearch(search: string){
    this.searching.set(true)
    return this.wardrobeS
      .searchInventory(this.auth.userDetails?.placeUuid as string, search)
      .pipe(finalize(()=> this.searching.set(false)))
  }
}
