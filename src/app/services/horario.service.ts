import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Horario } from '@data/interfaces/horario';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class HorarioService {

  constructor(private http: HttpClient) { }
  getHorarios(esc_name: string): Observable<Horario[]> {
    return this.http.get<Horario[]>('api/horarios/escenario/' + esc_name);
  }

  crearHorario(horario:Horario): Observable<Horario>{
    return this.http.post<Horario>('api/horarios/',horario);
  }

  eliminarHorario(horario:Horario): Observable<boolean>{
    const hi = horario.pk_horario.hor_hora_inicio;
    const hf = horario.pk_horario.hor_hora_fin;
    const fi = horario.pk_horario.hor_fecha_inicio;
    const ff = horario.pk_horario.hor_fecha_fin;
    const dia = horario.pk_horario.hor_dia;
    const esc = horario.pk_horario.esc_nombre;
    const url = `${'api/horarios'}?hi=${hi}&hf=${hf}&fi=${fi}&ff=${ff}&dia=${dia}&esc=${esc}`;
    
    return this.http.delete<boolean>(url);
  }
}
