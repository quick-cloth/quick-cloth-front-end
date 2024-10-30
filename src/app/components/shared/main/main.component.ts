import { Component } from '@angular/core';
import { ChildrenOutletContexts, RouterModule } from '@angular/router';
import { routeTransition } from '@animations/slide-animations';
import { SideBarWrapperComponent } from '@components/shared/frame/side-bar-wrapper/side-bar-wrapper.component';
import { ToastModule } from 'primeng/toast';

@Component({
  selector: 'BancoRopa-main',
  standalone: true,
  imports: [SideBarWrapperComponent, RouterModule, ToastModule],
  template: `
    <p-toast/>
    <BancoRopa-side-bar-wrapper >
      <div class="contents min-h-full" [@routeTransition]="getRouteAnimationData()">
        <router-outlet class="pb-5"/>
      </div>
    </BancoRopa-side-bar-wrapper>
  `,
  animations: [routeTransition],
})
export class MainComponent {
  constructor(private contexts: ChildrenOutletContexts) { }
  getRouteAnimationData() {
    return this.contexts.getContext('primary')?.route?.snapshot?.data
  }
}
