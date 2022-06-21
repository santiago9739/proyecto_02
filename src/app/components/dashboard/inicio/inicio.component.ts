import { Component, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { Usuario } from '@data/interfaces/usuario';
import { UsuarioService } from 'app/services/usuario.service';
import { Observable, Subject } from 'rxjs';
import { UsuariosComponent } from '../usuarios/usuarios.component';
import { EditarUsuarioComponent } from '../ventanas/editar-usuario/editar-usuario.component';



@Component({
  selector: 'app-inicio',
  templateUrl: './inicio.component.html',
  styleUrls: ['./inicio.component.scss']
})

export class InicioComponent implements OnInit {

  time = new Observable<string>(observer => {
    setInterval(() => observer.next(new Date().toString()), 1000);
  });

  constructor(private _usuarios:UsuarioService,public dialog: MatDialog) { }

  ngOnInit(): void {
  }

}
