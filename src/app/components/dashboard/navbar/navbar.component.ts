import { Component, Input, OnInit, ViewChild } from '@angular/core';
import { Login } from '@data/interfaces/login';
import { Menu } from '@data/interfaces/menu';
import { MenuService } from 'app/services/menu.service';
import { UsuarioService } from 'app/services/usuario.service';
import { filter, map } from 'rxjs';

@Component({
  selector: 'app-navbar',
  templateUrl: './navbar.component.html',
  styleUrls: ['./navbar.component.scss'],
})
export class NavbarComponent implements OnInit {
  menuLinks: Menu[] = [];
  lista: [] = [];

  login: Login = { user: '', password: '', rol: 'admin' };

  constructor(
    private _menuService: MenuService,
    private _usuario: UsuarioService
  ) {
    this._usuario.getLogin().subscribe({
      next: (data) => {
        this.login = data;
        this.cargarMenu();
      },
    });
  }

  ngOnInit(): void {
    this.cargarMenu();
  }

  cargarMenu() {
    this._menuService
      .getMenu()
      .pipe(
        // Transformamos el Observable y lo guardamos
        map((data) => {
          return data.filter((menu) => menu.rol == this.login.rol);
        })
      )
      .subscribe((data) => {
        this.menuLinks = data;
      });
  }

  logout() {
    this._usuario.logout();
  }
}
