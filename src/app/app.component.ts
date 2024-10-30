import { isPlatformServer } from '@angular/common';
import { Component, inject, PLATFORM_ID, signal } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { LoadingServerComponent } from '@components/shared/loading/loading-server/loading-server.component';

@Component({
  selector: 'BancoRopa-root',
  standalone: true,
  imports: [RouterOutlet, LoadingServerComponent],
  template: `
    @if(isServer()){
      <BancoRopa-loading-server/>
    }@else {
      <router-outlet> </router-outlet>
    }
    `
})
export class AppComponent{
  isServer = signal(false)
  constructor(){
    const platformId = inject(PLATFORM_ID)
    this.isServer.set(isPlatformServer(platformId))
  }
}

