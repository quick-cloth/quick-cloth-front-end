import { Component, computed, HostListener, signal } from '@angular/core';
import { SidebarComponent } from '../sidebar/sidebar.component';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'BancoRopa-side-bar-wrapper',
  standalone: true,
  imports: [SidebarComponent, CommonModule],
  templateUrl: './side-bar-wrapper.component.html',
  styleUrl: './side-bar-wrapper.component.scss'
})
export class SideBarWrapperComponent {
  isSideBarCollapsed = signal<boolean>(false)
  screenWidth = window.innerWidth
  sizeClass = computed(() => {
    if(this.isSideBarCollapsed()){
      return 'wrapper-collapsed'
    }
    return this.screenWidth > SideBarWrapperComponent.MIN_WIDTH_SIDEBAR_OPEN ? 'wrapper-not-collapsed' : 'wrapper-collapsed'
  })
  private static readonly MIN_WIDTH_SIDEBAR_OPEN = 786

  constructor(){
    this.isSideBarCollapsed.set(this.screenWidth < SideBarWrapperComponent.MIN_WIDTH_SIDEBAR_OPEN)
  }

  @HostListener('window:resize')
  private onResize(){
    this.screenWidth = window.innerWidth
    this.isSideBarCollapsed.set(this.screenWidth < SideBarWrapperComponent.MIN_WIDTH_SIDEBAR_OPEN)
  }

  changeIsSideBarCollapsed(isCollapsed: boolean){
    this.isSideBarCollapsed.set(isCollapsed)
  }
}
