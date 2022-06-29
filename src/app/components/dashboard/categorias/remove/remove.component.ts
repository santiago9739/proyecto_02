import { Component, Inject, OnInit } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { CategoriasComponent } from '../categorias.component';

@Component({
  selector: 'app-remove',
  templateUrl: './remove.component.html',
  styleUrls: ['./remove.component.scss']
})
export class RemoveComponent implements OnInit {

  constructor(
    public dialogRef: MatDialogRef<CategoriasComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any
  ) {
    this.nombre = data.dato.cat_nombre;
  }
  nombre: String = '';
  ngOnInit(): void {}

  cancelar() {
    this.dialogRef.close({ status: false });
  }

  aceptar() {
    this.dialogRef.close({ status: true });
  }

}
