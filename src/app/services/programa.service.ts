import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Facultad } from '@data/interfaces/facultad';
import { Programa } from '@data/interfaces/programa';
import { map, Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class ProgramaService {
  listaProgramas! : Observable<Programa[]>;
  listaFacultades! : Observable<Facultad[]>;
  constructor(private http: HttpClient) { 
    //this.listaProgramas =  this.http.get<Programa[]>('./assets/data/facultad_programas.json');
    //this.listaFacultades =  this.http.get<Facultad[]>('./assets/data/facultades.json');
    this.listaProgramas =  this.http.get<Programa[]>('/api/programas/');
  }

  getAllFacultades():Observable<Facultad[]>{
    return this.listaFacultades;
  }

  getAllProgramas():Observable<Programa[]>{
    return this.listaProgramas;
  }

  getProgramasByFacultad(facultad:String):Observable<Programa[]>{
    return this.listaProgramas
    .pipe( // Transformamos el Observable y lo guardamos
      map((data) => {
        return data.filter(p=> p.pro_nombre==facultad);
      })
    );
  }

  

  getPrograma(id:String):Observable<Programa>{
    return this.http.get<Programa>('/api/programas/'+id);
  }

  getProgramaByNombre(name:String):Observable<Programa>{
    return this.http.get<Programa>('/api/programas/nombre/'+name);
  }


}
