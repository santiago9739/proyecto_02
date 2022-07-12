import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { Escenario } from '@data/interfaces/escenario';

@Component({
  selector: 'app-prueba',
  templateUrl: './prueba.component.html',
  styleUrls: ['./prueba.component.scss'],
})
export class PruebaComponent implements OnInit {
  urlapi: string = 'api/horario';
  constructor(public fb: FormBuilder, private _http: HttpClient) {
    const headers = new HttpHeaders({ id: '25' });
    const datos = { id: 12 };

    const hi = 1;
    const hf = 3;
    const fi = '2021-02-12';
    const ff = '2021-02-19';
    const dia = 'LUNES';
    const esc = 'cancha 1';
    const url = `${this.urlapi}?hi=${hi}&hf=${hf}&fi=${fi}&ff=${ff}&dia=${dia}&esc=${esc}`;
    //console.log(url);
    this._http.get(url).subscribe({
      next: (dato) => {
        console.log(dato);
      },
    });
  }

  ngOnInit(): void {}
}
