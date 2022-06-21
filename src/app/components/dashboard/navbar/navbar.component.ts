import { Component, OnInit } from '@angular/core';
import { Menu } from '@data/interfaces/menu';
import { MenuService } from 'app/services/menu.service';

@Component({
  selector: 'app-navbar',
  templateUrl: './navbar.component.html',
  styleUrls: ['./navbar.component.scss']
})
export class NavbarComponent implements OnInit {

  menuLinks:Menu[] = [];
  lista: [] = [];

  constructor(private _menuService:MenuService) { }

  ngOnInit(): void {
    this.cargarMenu();
  }

  cargarMenu(){
    this._menuService.getMenu().subscribe(data=>{
      this.menuLinks = data;
    });
  }

}
