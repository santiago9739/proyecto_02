import { Component, Inject, OnInit } from '@angular/core';
import { MatDialogRef } from '@angular/material/dialog';
import { Usuario } from '@data/interfaces/usuario';
import { UsuariosComponent } from '../../usuarios/usuarios.component';
import {  MAT_DIALOG_DATA} from '@angular/material/dialog';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { Programa } from '@data/interfaces/programa';
import { Facultad } from '@data/interfaces/facultad';
import { MatSnackBar } from '@angular/material/snack-bar';
import { ProgramaService } from 'app/services/programa.service';
import { FileService } from 'app/services/file.service';


@Component({
  selector: 'app-editar-usuario',
  templateUrl: './editar-usuario.component.html',
  styleUrls: ['./editar-usuario.component.scss']
})
export class EditarUsuarioComponent implements OnInit {

  //#region Atributos
  retrievedImage: any;
  usuario!: Usuario;
  loading = false;
  form!: FormGroup;
  listaFacultades!: Facultad[];
  listaProgramas!: Programa[];
  facultadControl = new FormControl();
  programaControl = new FormControl();
  codControl = new FormControl();
  idControl = new FormControl();
  nombresControl = new FormControl();
  apellidosControl = new FormControl();
  usuarioControl = new FormControl();
  titulo = "";
  status:boolean=false;
  //#endregion
  tiles: any[] = [
    {text: 'One', cols: 3, rows: 1, color: 'lightblue'},
    {text: 'Two', cols: 1, rows: 2, color: 'lightgreen'},
    {text: 'Three', cols: 1, rows: 1, color: 'lightpink'},
    {text: 'Four', cols: 2, rows: 1, color: '#DDBDF1'},
  ];
  //#region Constructores
  constructor(
    public dialogRef: MatDialogRef<UsuariosComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any,private fb:FormBuilder,private _snackBar: MatSnackBar,private _formBuilder: FormBuilder,private _programas:ProgramaService,private _file:FileService) {
      this.form = fb.group({codigo:this.codControl,identificacion:this.idControl,nombres:this.nombresControl,apellidos:this.apellidosControl,usuario:this.usuarioControl,});
      this._programas.getAllFacultades().subscribe((f:Facultad[])=>{
        this.cargarFacultadPrograma(f);
      });
      this.cargarInfoUsuario(data.usuario); 
      this.usuario = data.usuario;
      this.titulo = data.method;
      if (this.titulo=='Editar') {
        this.status = true;
      }
  }
  ngOnInit(): void {}
  //#endregion
  
  //#region Cargadores
  cargarFacultadPrograma(f:any){
    this.listaFacultades = f;
      if(this.titulo=="Crear Nuevo")
        this.facultadControl.setValue(f[0].facultad);
      else
        this.facultadControl.setValue(this.usuario.facultad);
      this._programas.getProgramasByFacultad(this.facultadControl.value).subscribe(programas=>{
        if(this.titulo=="Crear Nuevo")
          this.programaControl.setValue(programas[0].pro_nombre);
        else
          this.programaControl.setValue(this.usuario.programa);
        this.listaProgramas = programas;
      });
  }

  cargarInfoUsuario(user:Usuario){
    this.facultadControl.setValue(user.facultad);
    this.programaControl.setValue(user.programa);
    this.codControl.setValue(user.codigo);
    this.codControl.addValidators([Validators.min(1),Validators.required]);
    this.idControl.setValue(user.identificacion);
    this.idControl.addValidators([Validators.min(1),Validators.required]);
    this.nombresControl.setValue(user.nombres);
    this.nombresControl.addValidators([Validators.required,Validators.minLength(1)]);
    this.apellidosControl.setValue(user.apellidos);
    this.apellidosControl.addValidators([Validators.required,Validators.minLength(1)]);
    this.usuarioControl.setValue(user.usuario);    
    this.usuarioControl.addValidators([Validators.required,Validators.minLength(1)]);
    if(user.image!=null)
      this.retrievedImage = 'data:image/jpeg;base64,' + user.image.picByte;
    
  }
  //#endregion

  //#region Eventos
  cancelar(){
    this.dialogRef.close("false");
  }
  
  onChangeFacultad() {
    this._programas.getProgramasByFacultad(this.facultadControl.value).subscribe(programas=>{
      this.programaControl.setValue(programas[0].pro_nombre);
      this.listaProgramas = programas;
    });
  }

  onChangeStatus(){
    this.status = this.form.status == 'VALID';
  }
  enviar(): void{
    let usuario = {facultad:this.facultadControl.value,programa:this.programaControl.value,codigo:this.codControl.value,identificacion:this.idControl.value,nombres:this.nombresControl.value,apellidos: this.apellidosControl.value,usuario: this.usuarioControl.value,image: this.usuario.image}
    this.loading = true;
    setTimeout(()=>{
      // lo redireccionamos al dasboard
      this.dialogRef.close(usuario);
    },500);
  }
  onImageDefault(){
    this.retrievedImage = undefined;
    this.usuario.image = null;
  }
  //Gets called when the user selects an image
  onFileChanged(event:any) {
    //Select File
    this._file.onUpload(event.target.files[0],event.target.files[0].name).subscribe((response) => {
      this._file.cargarImage(event.target.files[0].name).subscribe(
        res => {
          this.usuario.image = res;
          this.retrievedImage = 'data:image/jpeg;base64,' + res.picByte;
        }
      );
    });
  }
  //#endregion
}
