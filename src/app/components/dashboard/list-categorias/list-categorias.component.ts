import { Component, OnInit } from '@angular/core';
import { Categoria } from '@data/interfaces/categoria';
import { CategoriaService } from 'app/services/categoria.service';

@Component({
  selector: 'app-list-categorias',
  templateUrl: './list-categorias.component.html',
  styleUrls: ['./list-categorias.component.scss'],
})
export class ListCategoriasComponent implements OnInit {
  listaCategorias!: Categoria[];

  constructor(private _categorias: CategoriaService) {
    this._categorias.getCategorias().subscribe((data) => {
      this.listaCategorias = data;
    });
  }

  ngOnInit(): void {}
}
