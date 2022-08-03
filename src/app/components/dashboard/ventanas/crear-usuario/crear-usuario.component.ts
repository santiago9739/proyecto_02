import { Component, ElementRef, Inject, OnInit, ViewChild } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { MatSnackBar } from '@angular/material/snack-bar';
import { Facultad } from '@data/interfaces/facultad';
import { Programa } from '@data/interfaces/programa';
import { Usuario } from '@data/interfaces/usuario';
import { ProgramaService } from 'app/services/programa.service';
import { UsuariosComponent } from '../../usuarios/usuarios.component';

@Component({
  selector: 'app-crear-usuario',
  templateUrl: './crear-usuario.component.html',
  styleUrls: ['./crear-usuario.component.scss']
})
export class CrearUsuarioComponent implements OnInit {
  hide = true;
  loading = false;
  form!: FormGroup;

  //facultades:String[] = ["Facultad de Artes","Facultad de Ciencias Agrarias","Facultad de Ciencias Contables Económicas y Administrativas","Facultad de Ciencias de la Salud","Facultad de Ciencias Humanas y Sociales","Facultad de Ciencias Naturales, Exactas y de la Educación","Facultad de Derecho, Ciencias Políticas y Sociales","Facultad de Ingeniería Civil","Facultad de Ingeniería Electrónica y Telecomunicaciones"];

  //programas: String[] = ["Artes Plásticas","Dirección de Banda","Diseño Gráfico","Licenciatura en Música","Música Instrumental","Ingeniería Agroindustrial","Ingenieria Agroindustrial Diurno - Sede Santander de Quilichao","Ingeniería Agropecuaria","Ingeniería Forestal","Ingeniería Forestal Sur","Administración de Empresas","Contaduría Pública","Contaduría Pública - Miranda","Contaduría Pública Nocturna - Sede Santander de Quilichao","Contaduría Pública Sur Diurno - Sede Popayán","Economía","Turismo","Enfermería","Fisioterapia","Fonoaudiología","Medicina","Antropología","Filosofía - Diurna","Filosofía - Nocturna","Geografía del Desarrollo Regional y Ambiental","Historia","Lic. en Lenguas Modernas, Inglés y Francés Diurno - Sede Stder de Quilichao","Licenciatura en Español y Literatura","Licenciatura en Etnoeducación","Licenciatura en Etnoeducación - Guapi","Licenciatura en Etnoeducación - Pitayo","Licenciatura en Etnoeducación - Silvia","Licenciatura en Lenguas Modernas con Énfasis en Inglés y Francés","Licenciatura en Lenguas Modernas con Énfasis en Ingles y Francés – Santander de Quilichao","Licenciatura en Lenguas Modernas Inglés-Francés","Licenciatura en Literatura y Lengua Castellana","Biología","Ingeniería Física","Licenciatura en  Educación Básica Con Enfasis en Educación Física, Recreación y Deportes","Licenciatura en Ciencias Naturales y Educación Ambiental","Licenciatura en Educación Artística","Licenciatura en Educación Básica Con Enfasis Ciencias Naturales y Educación Ambiental","Licenciatura en Educación Básica con Enfasis en Educación Artística","Licenciatura en Educación Básica Con Enfasis en Lengua Castellana E Inglés","Licenciatura en Educación Básica Primaria","Licenciatura en Educación Física, Recreación y Deportes","Licenciatura en Matemáticas","Matemáticas","Química","Ciencia Política","Comunicación Social","Derecho","Derecho Cohorte Especial Policía Nacional y Líderes Populares-Nocturno","Derecho Diurno - Sede Miranda","Derecho Diurno-Sede Santander de Quilichao","Derecho Nocturno - Sede Santander de Quilichao","Derecho Nocturno Cohorte Especial Popayán","Derecho Nocturno CRIC - Sede Santander de Quilichao","Arquitectura","Geotecnología","Ingeniería Ambiental","Ingeniería Civil","Ingeniería Civil Diurno - Sede Santander de Quilichao","Ingeniería de Sistemas","Ingeniería Electrónica y Telecomunicaciones","Ingeniería en Automática Industrial","Tecnología en Telemática"];

  listaFacultades!: Facultad[];
  listaProgramas!: Programa[];
  facultadControl = new FormControl('');
  programaControl = new FormControl('');
  codControl = new FormControl();
  idControl = new FormControl();
  nombresControl = new FormControl('Kevith');
  apellidosControl = new FormControl('Bastidas');
  usuarioControl = new FormControl('kevithchi');
  titulo = "";
  @ViewChild('titulo') element!: ElementRef;
  constructor(
    public dialogRef: MatDialogRef<UsuariosComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any,private fb:FormBuilder,private _snackBar: MatSnackBar,private _formBuilder: FormBuilder,private _programas:ProgramaService) {
      this.form = fb.group({codigo:['',Validators.required],identificacion:['',Validators.required],nombres:['',Validators.required],apellidos:['',Validators.required],usuario:['',Validators.required],});
      this._programas.getAllFacultades().subscribe((f:Facultad[])=>{
        this.listaFacultades = f;
        if(data.method=="Crear Nuevo")
          this.facultadControl.setValue(f[0].facultad);
        else
          this.facultadControl.setValue(data.usuario.facultad);
        this._programas.getProgramasByFacultad(this.facultadControl.value).subscribe(programas=>{
          if(data.method=="Crear Nuevo")
            this.programaControl.setValue(programas[0].pro_nombre);
          else
            this.programaControl.setValue(data.usuario.programa);
          this.listaProgramas = programas;
        });
      });
      this.cargarInfoUsuario(data.usuario); 
      this.titulo = data.method;
  }

  cargarInfoUsuario(user:Usuario){
    this.facultadControl.setValue(user.facultad);
    this.programaControl.setValue(user.programa);
    this.codControl.setValue(user.codigo);
    this.codControl.addValidators([Validators.min(1),Validators.required]);
    this.idControl.setValue(user.identificacion);
    this.idControl.addValidators([Validators.min(1),Validators.required]);
    this.nombresControl.setValue(user.nombres);
    this.nombresControl.addValidators(Validators.required);
    this.apellidosControl.setValue(user.apellidos);
    this.apellidosControl.addValidators(Validators.required);
    this.usuarioControl.setValue(user.usuario);    
    this.usuarioControl.addValidators(Validators.required);
    this.onChangeStatus();
  }
  ngOnInit(): void {}

  onChangeFacultad() {
    this._programas.getProgramasByFacultad(this.facultadControl.value).subscribe(programas=>{
      this.programaControl.setValue(programas[0].pro_nombre);
      this.listaProgramas = programas;
    });
  }
  status:boolean=false;
  onChangeStatus(){
    this.status = (this.codControl.status=='VALID' && this.idControl.status=='VALID' && this.nombresControl.status=='VALID' && this.apellidosControl.status == 'VALID' && this.usuarioControl.status == 'VALID');
      
  }

  cancelar(){
    this.dialogRef.close();
  }

  enviar(): void{
    let usuario = {facultad:this.facultadControl.value,
      programa:this.programaControl.value,
      codigo:this.codControl.value,
      identificacion:this.idControl.value,
      nombres:this.nombresControl.value,
      apellidos: this.apellidosControl.value,
      usuario: this.usuarioControl.value,
      image:undefined}
    this.fakeLoading(usuario);
  }

  fakeLoading(usuario:Usuario):void{
    this.loading = true;
    setTimeout(()=>{
      // lo redireccionamos al dasboard
      this.dialogRef.close(usuario);
      this.mensajeConfirmacion();
      //this.loading = false;
    },500);
  }

  openSnackBar(message: string, action: string,f:any) {
    this._snackBar.open(message, action,f);
  }

  mensajeConfirmacion():void{
    this.openSnackBar("El usuario se registro correctamente","",{
      duration: 2000,
      horizontalPosition: 'center',
      verticalPosition:'top'
    });
  
  }

}
