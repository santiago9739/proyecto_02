import { Component, Inject, OnInit } from '@angular/core';
import { MatDialogRef } from '@angular/material/dialog';
import { Usuario } from '@data/interfaces/usuario';
import { UsuariosComponent } from '../../usuarios/usuarios.component';
import { MAT_DIALOG_DATA } from '@angular/material/dialog';
import {
  FormBuilder,
  FormControl,
  FormGroup,
  Validators,
} from '@angular/forms';
import { Programa } from '@data/interfaces/programa';
import { Facultad } from '@data/interfaces/facultad';
import { MatSnackBar } from '@angular/material/snack-bar';
import { ProgramaService } from 'app/services/programa.service';
import { FileService } from 'app/services/file.service';
import { Categoria } from '@data/interfaces/categoria';
import { EscenarioService } from 'app/services/escenario.service';
import { Escenario } from '@data/interfaces/escenario';

@Component({
  selector: 'app-editar',
  templateUrl: './editar.component.html',
  styleUrls: ['./editar.component.scss'],
})
export class EditarComponent implements OnInit {
  //#region Atributos
  retrievedImage: any;
  escenario!: Escenario;
  loading = false;
  form!: FormGroup;
  listaCategorias!: Categoria[];
  listaEstados: string[] = ['HABILITADO', 'DESHABILITADO'];
  categoriaControl = new FormControl();
  estadoControl = new FormControl();
  nombreControl = new FormControl();
  descripcionControl = new FormControl();
  titulo = '';
  status: boolean = false;
  //#endregion
  tiles: any[] = [
    { text: 'One', cols: 3, rows: 1, color: 'lightblue' },
    { text: 'Two', cols: 1, rows: 2, color: 'lightgreen' },
    { text: 'Three', cols: 1, rows: 1, color: 'lightpink' },
    { text: 'Four', cols: 2, rows: 1, color: '#DDBDF1' },
  ];
  //#region Constructores
  constructor(
    public dialogRef: MatDialogRef<UsuariosComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any,
    private fb: FormBuilder,
    private _snackBar: MatSnackBar,
    private _formBuilder: FormBuilder,
    private _escenarios: EscenarioService,
    private _file: FileService
  ) {
    this.form = fb.group({
      nombre: this.nombreControl,
      descripcion: this.descripcionControl,
    });

    this._escenarios.getCategorias().subscribe((c: Categoria[]) => {
      this.cargarCategorias(c);
    });
    this.cargarInfoUsuario(data.dato);
    this.escenario = data.dato;
    this.titulo = data.method;
    if (this.titulo == 'Editar') {
      this.status = true;
    }
  }
  ngOnInit(): void {}
  //#endregion

  //#region Cargadores
  cargarCategorias(c: Categoria[]) {
    this.listaCategorias = c;
    if (this.titulo == 'Crear Nuevo') {
      this.categoriaControl.setValue(c[0].cat_nombre);
      this.estadoControl.setValue(this.listaEstados[0]);
    } else this.categoriaControl.setValue(this.escenario.categoria.cat_nombre);
  }

  cargarInfoUsuario(escenario: Escenario) {
    this.categoriaControl.setValue(escenario.categoria.cat_nombre);
    let estado = escenario.esc_estado == '0' ? 'HABILITADO' : 'DESHABILITADO';
    this.estadoControl.setValue(estado);
    this.nombreControl.setValue(escenario.esc_nombre);
    this.nombreControl.addValidators([Validators.min(1), Validators.required]);
    this.descripcionControl.setValue(escenario.esc_descripcion);
    this.descripcionControl.addValidators([
      Validators.min(1),
      Validators.required,
    ]);

    if (escenario.esc_foto != null)
      this.retrievedImage = 'data:image/jpeg;base64,' + escenario.esc_foto;
  }
  //#endregion

  //#region Eventos
  cancelar() {
    this.dialogRef.close(false);
  }

  onChangeStatus() {
    this.status = this.form.status == 'VALID';
    this.nombreControl.setValue(this.nombreControl.value.toUpperCase());
  }
  enviar(): void {
    this._escenarios.getCategoriaById(this.categoriaControl.value).subscribe({
      next: (v_categoria: any) => {
        if (this.titulo == 'Crear Nuevo') {
          this.crear(v_categoria);
        } else {
          this.editar(v_categoria);
        }
      },
    });
  }

  editar(v_categoria: any) {
    if (this.data.dato.esc_nombre != this.nombreControl.value) {
      this._escenarios.getEscenarioById(this.nombreControl.value).subscribe({
        next: (esc) => {
          if (esc != null) { 
            this.mensajeNombreExistente();
          } else {
            this.registrar(v_categoria);
          }
        },
      });
    } else {
      this.registrar(v_categoria);
    }
  }

  crear(v_categoria: any) {
    this._escenarios.getEscenarioById(this.nombreControl.value).subscribe({
      next: (data) => {
        if (data != null) this.mensajeNombreExistente();
        else this.registrar(v_categoria); 
      },
    });
  }

  registrar(v_categoria: any) {
    let escenario: Escenario = {
      esc_nombre: this.nombreControl.value,
      esc_descripcion: this.descripcionControl.value,
      esc_foto: this.escenario.esc_foto,
      esc_estado: this.estadoControl.value == 'HABILITADO' ? '0' : '1',
      categoria: v_categoria,
    };

    if(escenario.esc_nombre.length>30){
      this.mensajeNombreCarecteresSuperados();
    }else{
      this.loading = true;
      setTimeout(() => {
        // lo redireccionamos al dasboard
        this.dialogRef.close(escenario);
      }, 500);
    }

    
  }

  onImageDefault() {
    this.retrievedImage = undefined;
    this.escenario.esc_foto = null;
  }
  //Gets called when the user selects an image
  onFileChanged(event: any) {
    //Select File
    const reader = new FileReader();
    reader.onload = (e: any) => {
      this.escenario.esc_foto = e.target.result.split('base64,')[1];
      this.retrievedImage = 'data:image/jpeg;base64,' + this.escenario.esc_foto;
    };
    reader.readAsDataURL(event.target.files[0]);
    /*
    this._file
      .onUpload(event.target.files[0], event.target.files[0].name)
      .subscribe((response) => {
        this._file.cargarImage(event.target.files[0].name).subscribe((res) => {
          this.escenario.esc_foto = res.picByte;
          this.retrievedImage = 'data:image/jpeg;base64,' + res.picByte;
        });
      });
    */
  }
  //#endregion

  mensajeNombreExistente(): void {
    this.openSnackBar(
      'Error: Ya existe un escenario con ese mismo nombre...',
      'X',
      {
        duration: 2000,
        horizontalPosition: 'center',
        verticalPosition: 'top',
      }
    );
  }

  mensajeNombreCarecteresSuperados(): void {
    this.openSnackBar(
      'Error: el nombre del escenario debe tener maximo 30 caracteres',
      'X',
      {
        duration: 2000,
        horizontalPosition: 'center',
        verticalPosition: 'top',
      }
    );
  }

  openSnackBar(message: string, action: string, f: any) {
    this._snackBar.open(message, action, f);
  }
}
