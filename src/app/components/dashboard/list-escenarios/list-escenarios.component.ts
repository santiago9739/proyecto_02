import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Params } from '@angular/router';
import { Escenario } from '@data/interfaces/escenario';
import { EscenarioService } from 'app/services/escenario.service';

@Component({
  selector: 'app-list-escenarios',
  templateUrl: './list-escenarios.component.html',
  styleUrls: ['./list-escenarios.component.scss'],
})
export class ListEscenariosComponent implements OnInit {
  listaEscenarios!: Escenario[];
  constructor(
    private _rutaActiva: ActivatedRoute,
    private _escenarios: EscenarioService
  ) {
    this.dato = this._rutaActiva.snapshot.params['cat_nombre'];
    this._rutaActiva.params.subscribe((params: Params) => {
      this._escenarios.getEscenariosByCateogoria(this.dato).subscribe({
        next: (dato) => {
          this.listaEscenarios = dato;
        },
      });
    });
  }
  dato: any;
  ngOnInit(): void {}
}
