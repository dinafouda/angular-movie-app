import { Component } from '@angular/core';
import { Router, RouterLink } from '@angular/router';
import { NavItems } from '../../interfaces/ui-config/navi-item-config.interface';
import { NgClass } from '@angular/common';

@Component({
  selector: 'app-navbar',
  standalone: true,
  imports: [NgClass, RouterLink],
  templateUrl: './navbar.component.html',
  styleUrl: './navbar.component.scss'
})
export class NavbarComponent {
  navItems: NavItems[] = [{
    name: 'Movie',
    path: 'movies',
    active: false
  },
  {
    name: 'TV Shows',
    path: 'tvshows',
    active: false
  }
  ]

  constructor(private router: Router) { }
  selectedItem(nav: NavItems) {
    this.navItems.map((item: NavItems) => {
      item.active = nav.name === item.name
    })
    this.router.navigateByUrl(nav.path)
  }
}
