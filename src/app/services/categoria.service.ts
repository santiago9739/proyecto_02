import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Categoria } from '@data/interfaces/categoria';
import { Escenario } from '@data/interfaces/escenario';
import { Observable, Subject } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class CategoriaService {
  listaCategoria!: Categoria[];
  sub = new Subject<Categoria[]>();
  constructor(private http: HttpClient) {
    this.http.get<Categoria[]>('/api/categorias').subscribe((data) => {
      this.listaCategoria = data;
      this.noitificarAll();
    });
  }
  noitificarAll(): void {
    /*
    this.listaEscenario = this.listaEscenario.map((data) => {
      data.esc_foto = 'data:image/jpeg;base64,' + data.esc_foto;
      return data;
    });
    */
    this.sub.next(this.listaCategoria);
  }

  getCategorias(): Observable<Categoria[]> {
    return this.http.get<Categoria[]>('api/categorias');
  }

  getCategoriaById(id: any): Observable<Categoria> {
    return this.http.get<Categoria>(`api/categorias/${id}`);
  }

  agregarCategoria(categoria: Categoria): Observable<any> {
    return this.http.post('api/categorias', categoria);
  }

  eliminarCategoria(categoria: Categoria): Observable<any> {
    return this.http.delete('api/categorias/' + categoria.cat_nombre);
  }

  editarCategoria(name: string, categoria: Categoria): Observable<any> {
    return this.http.put('api/categorias/' + name, categoria);
  }
}
