import { Component, Output, EventEmitter } from '@angular/core';
import { Router } from '@angular/router';
import { DataService } from '../../data.service';


@Component({
  selector: 'app-sidenav',
  templateUrl: './sidenav.component.html',
  styleUrls: ['./sidenav.component.css']
})
export class SidenavComponent {
  searchTerm = '';
  isCollapsed = true;
  @Output() sidenavToggle = new EventEmitter<void>();
  @Output() closeSidenav = new EventEmitter<void>();

  constructor(
    private router: Router,
    private data: DataService
  ) { this.data.cartItems = this.data.getCart().length; }

  onClose() {
    this.closeSidenav.emit();
  }

  onToggleSidenav() {
    this.sidenavToggle.emit();
  }

  get token() {
    return localStorage.getItem('token');
  }

  collapse() {
    this.isCollapsed = true;
  }

  closeDropDown(dropdown) {
    dropdown.close();
  }

  logout() {
    this.data.user = {};
    this.data.cartItems = 0;
    localStorage.clear();
    this.router.navigate(['']);
  }

  search() {

  }
}
