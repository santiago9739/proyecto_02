import { Component, OnInit, Inject } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { Horario } from '@data/interfaces/horario';
import { HorariosComponent } from '../horarios.component';


@Component({
  selector: 'app-remove',
  templateUrl: './remove.component.html',
  styleUrls: ['./remove.component.scss']
})



export class RemoveComponent implements OnInit {
  horario!:Horario;
  programa!:string;
  estado:number;
  informacion:string = "";
  titulo:string = "";
  nombre:string = "";
  nombrePrograma:string = "";
  constructor(
    public dialogRef: MatDialogRef<HorariosComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any
  ) {
    this.nombre = data.dato.pk_horario.hor_hora_inicio+"-"+data.dato.pk_horario.hor_hora_fin;
    this.horario = data.dato;
    this.programa = data.programa;
    this.estado = data.estado;
    console.log(this.estado);
    
    if(this.estado==0){
      this.informacion = "este horario";
      this.titulo = "Horario";
      this.nombrePrograma ="PROGRAMA";
    }else{
      this.informacion = "esta RESERVACIÓN";
      this.titulo = "RESERVACIÓN";
      this.nombrePrograma = "RESERVADO POR";
    }
  }
  ngOnInit(): void {}

  cancelar() {
    this.dialogRef.close({ status: false });
  }

  aceptar() {
    this.dialogRef.close({ status: true });
  }

}
