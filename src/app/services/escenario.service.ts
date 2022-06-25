import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Categoria } from '@data/interfaces/categoria';
import { Escenario } from '@data/interfaces/escenario';
import { Observable, Subject } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class EscenarioService {
  listaEscenario!: Escenario[];
  sub = new Subject<Escenario[]>();

  constructor(private http: HttpClient) {
    //this.listaEscenario = this.http.get<Escenario[]>('./assets/data/csvjson.json');
    this.http.get<Escenario[]>('/api/escenarios').subscribe((data) => {
      this.listaEscenario = data;
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
    this.sub.next(this.listaEscenario);
  }

  getEscenarios(): Observable<Escenario[]> {
    return this.sub.asObservable();
  }

  getCategorias(): Observable<Categoria[]> {
    return this.http.get<Categoria[]>('api/categorias');
  }

  getCategoriaById(id: any): Observable<Categoria> {
    return this.http.get<Categoria>(`api/categorias/${id}`);
  }

  getEscenariosByCateogoria(id: any): Observable<Escenario[]> {
    return this.http.get<Escenario[]>(`api/categorias/escenarios/${id}`);
  }

  /*
  getEscenarios():Observable<Escenario[]>{
    return this.listaEscenario;
  }
  */
  eliminarEscenario(escenario: Escenario): boolean {
    this.http.delete('api/escenarios/' + escenario.esc_nombre).subscribe({
      next: (data) => {
        this.http.get<Escenario[]>('/api/escenarios').subscribe((data) => {
          this.listaEscenario = data;
          this.noitificarAll();
        });
        return data;
      },
      error: (error) => {
        console.error('There was an error!', error);
      },
    });
    return false;
  }

  agregarEscenario(escenario: Escenario) {
    this.http.post<Escenario[]>('api/escenarios', escenario).subscribe({
      next: (data) => {
        this.http.get<Escenario[]>('/api/escenarios').subscribe((data) => {
          this.listaEscenario = data;
          this.noitificarAll();
        });
      },
      error: (error) => {
        console.error('There was an error!', error);
      },
    });
  }

  getEscenarioById(id: any): Observable<Escenario> {
    return this.http.get<Escenario>(`api/escenarios/${id}`);
  }

  editarEscenario(id: string, user: Escenario) {
    this.http.put('api/escenarios/' + id, user).subscribe({
      next: (data) => {
        this.http.get<Escenario[]>('/api/escenarios').subscribe((data) => {
          this.listaEscenario = data;
          this.noitificarAll();
        });
        this.noitificarAll();
      },
      error: (error) => {
        console.error('There was an error!', error);
      },
    });
  }
}
