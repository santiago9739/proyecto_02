import { Component, Inject, OnInit } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { UsuariosComponent } from '../../usuarios/usuarios.component';

@Component({
  selector: 'app-remove-usuario',
  templateUrl: './remove-usuario.component.html',
  styleUrls: ['./remove-usuario.component.scss']
})
export class RemoveUsuarioComponent implements OnInit {

  constructor(public dialogRef: MatDialogRef<UsuariosComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any) { }
  nombre: String ="";
  ngOnInit(): void {
  }

  cancelar(){
    this.dialogRef.close({status:false});
  }

  aceptar(){
    this.dialogRef.close({status:true});
  }

}
