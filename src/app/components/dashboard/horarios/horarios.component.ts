import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormControl, FormGroup } from '@angular/forms';
import { ActivatedRoute, Params } from '@angular/router';
import { Login } from '@data/interfaces/login';
import { Programa } from '@data/interfaces/programa';
import { ProgramaColor } from '@data/interfaces/programacolor';
import { EscenarioService } from 'app/services/escenario.service';
import { ProgramaService } from 'app/services/programa.service';
import { UsuarioService } from 'app/services/usuario.service';
import {Horario} from '@data/interfaces/horario';
import { DatePipe } from '@angular/common';
import { HorarioService } from 'app/services/horario.service';
import { MatSnackBar } from '@angular/material/snack-bar';
import { ThisReceiver } from '@angular/compiler';
import { MatDialog } from '@angular/material/dialog';
import { RemoveComponent } from './remove/remove.component';

@Component({
  selector: 'app-horarios',
  templateUrl: './horarios.component.html',
  styleUrls: ['./horarios.component.scss']
})

export class HorariosComponent implements OnInit {

  range = new FormGroup({
    start: new FormControl(null),
    end: new FormControl(null),
  });
  validatorsDatosAdmin: boolean[] = [false,false,false,false,false];
  validatorsDatosAdminReservas: boolean[] = [false,false,false,false];
  validatorsDatosInvitado:boolean[] = [false,false,false];
  mostrarButton: boolean = false;
  diaAgregar!: '';
  login: Login = { user: '', password: '', rol: 'admin' };
  lista_dias:string[]=["LUNES","MARTES","MIERCOLES","JUEVES","VIERNES","SABADO","DOMINGO"];
  dias_cbx = this.fb.group({
    LUNES: false,
    MARTES: false,
    MIERCOLES: false,
    JUEVES: false,
    VIERNES: false,
    SABADO: false,
    DOMINGO: false,
  });

  dato: any;
  form!: FormGroup;
  programaControl = new FormControl();
  horaInicioControl = new FormControl();
  horaFinControl = new FormControl();
  fechaInicio : string="";
  fechaFin : string="";
  lista_horas:number[]=[];
  lista_horas_fin:number[]=[];
  listaProgramas!: Programa[];

  displayedColumns: string[] = ["HORA", "LUNES","MARTES","MIERCOLES","JUEVES","VIERNES","SABADO","DOMINGO"];
   
  clickedRows = new Set<any>();

  
  dataSource: any[] = [];
  constructor(private _rutaActiva: ActivatedRoute,
    private _escenarios: EscenarioService,private fb:FormBuilder,private _programas:ProgramaService,private _horarios:HorarioService,private _snackBar: MatSnackBar,public dialog: MatDialog) { 

      this.dato = this._rutaActiva.snapshot.params['esc_nombre'];

      this._horarios.getHorarios(this.dato).subscribe(horas => {
        this.cargarHorario(horas);
      });

      this.form = fb.group({programa:this.programaControl});
      this._programas.getAllProgramas().subscribe(
        (dato)=>{
          this.listaProgramas = dato;
        }
      )
    for (var i = 0; i <= 10; i++) { 
      this.lista_horas.push(i+8);
      let cont = i+8;
      this.dataSource.push({HORA: [cont+":00",], LUNES: ['',false],MARTES:['',false],MIERCOLES:['',false],JUEVES:['',false],VIERNES:['',false],SABADO:['',false],DOMINGO:['',false]});
    }
  }

  estado_horario : number=2;
  titulo:string = "HORARIO";
  onSelectionReservacion(){
    if(this.estado_horario==0){
      this.titulo = "HORARIO";
    }else if(this.estado_horario==1){
      this.titulo = "RESERVACIÓN";
    }
    
  }
  codigo:string="";
  onChangeCodigo(){
    this.validatorsDatosAdminReservas[0] = this.codigo==null?false:true;
    this.validarButtonAgregarAdmin();
  }
  validarButtonAgregarAdmin() {
    if(this.estado_horario==0){
      for(let item of this.validatorsDatosAdmin){
        if(item==false){
          this.mostrarButton=false;
          return;
        }
      }
      
    }else{
      for(let item of this.validatorsDatosAdminReservas){

        if(item==false){
          this.mostrarButton=false;
          return;
        }
      }
    }
    this.mostrarButton=true;
  }
  validarButtonAgregarInvitado() {
    for(let item of this.validatorsDatosInvitado){
      if(item==false){
        this.mostrarButton=false;
        return;
      }
    }
    this.mostrarButton=true;
  }

  onChangePrograma(){
    this.validatorsDatosAdmin[0] = this.programaControl.value==""?false:true;
    this.validarButtonAgregarAdmin();
    
  }
  listaDiasAgregar!:string[];
  onChangeDias(){
    this.listaDiasAgregar = [];
    for(let item of this.lista_dias){
      if(this.dias_cbx.value[item]){
        this.listaDiasAgregar.push(item);
      }
    }
    this.validatorsDatosAdmin[1] = this.listaDiasAgregar.length>0;
    this.validarButtonAgregarAdmin();
    
  }
  onChangeDia(){
    if(this.login.rol=='admin'){
      this.validatorsDatosAdminReservas[1] = this.diaAgregar==""?false:true;
      this.validarButtonAgregarAdmin();
    }else{
      this.validatorsDatosInvitado[0] = this.diaAgregar==""?false:true;
      this.validarButtonAgregarInvitado();
    }

    
  }

  ngOnInit(): void {
    this.dato = this._rutaActiva.snapshot.params['esc_nombre'];
    this._rutaActiva.params.subscribe((params: Params) => {
      this._escenarios.getEscenariosByCateogoria(this.dato).subscribe({
        next: (dato) => {
          
        },
      });
    });
  }

  enviar(){
    //console.log(this.toppings.value);
    
  }
  listaColorPrograma: ProgramaColor[] =[];
  listaColores:String[]=["#00ffff","#7fffd4","#ffe4c4","#8a2be2","#deb887","#7fff00","#d2691e","#ff7f50","#6495ed","#00ffff"];
  darColor(x:string){
    for (let item of this.listaColorPrograma) {
      if(item.programa==x){
        return item.color;
      }
    }
    let v_color = this.listaColores.pop();
    if (v_color!=undefined) {
      this.listaColorPrograma.push({programa:x,color:v_color});
    }
    return v_color;
  }

  formatearTablaReservas(){
    this.dataSource = [];
    for (var i = 0; i <= 10; i++) { 
      let cont = i+8;
      this.dataSource.push({HORA: [cont+":00",], LUNES: ['',false,,],MARTES:['',false,,],MIERCOLES:['',false,,],JUEVES:['',false,,],VIERNES:['',false,,],SABADO:['',false,,],DOMINGO:['',false,,]});
    }
  }

  dia_capturado: string = "";
  capturarYHorario(dia_capturado: any){
    this.dia_capturado = dia_capturado;
  }

  eliminarHorario(horario:Horario,programa:string,estado:string){
    this.dialog
      .open(RemoveComponent, {
        data: { dato: horario, method: 'Remove', programa:programa,estado:estado},
        disableClose: true
      })
      .afterClosed()
      .subscribe((result: any) => {
        if (result !== undefined)
          if (result.status == true) {
            
            this._horarios.eliminarHorario(horario).subscribe(result=>{

              this._horarios.getHorarios(this.dato).subscribe(horas => {
                this.cargarHorario(horas);
                this.mensajeConfirmacionEliminar();
              });
            });


            
          }
      });



    
  }

  capturarCHorario(columna:any){
    if(this.dia_capturado!==""){
      let hora = columna["HORA"][0];
      let programa = columna[this.dia_capturado][0];
      let dia = this.dia_capturado;
      let estado = columna[this.dia_capturado][3];
      
      if(parseInt(estado)==1){
        this._horarios.getHorarios(this.dato).subscribe(ListaH =>{
          for(let horario of ListaH) {
            if(horario.pk_horario.hor_dia==dia && horario.user_id==programa){
              if(parseInt(horario.pk_horario.hor_hora_inicio)==parseInt(hora)){
                this.eliminarHorario(horario,programa,estado);
                break;
              }else if(parseInt(hora)>parseInt(horario.pk_horario.hor_hora_inicio) && parseInt(hora)<=parseInt(horario.pk_horario.hor_hora_fin)){
                this.eliminarHorario(horario,programa,estado);
                break;
              }
            }
          }
        });
      }else{
        this._programas.getProgramaByNombre(programa).subscribe((p:Programa)=>{
          this._horarios.getHorarios(this.dato).subscribe(ListaH =>{
            for(let horario of ListaH) {
              if(horario.pk_horario.hor_dia==dia && horario.pro_id==p.pro_id){
                if(parseInt(horario.pk_horario.hor_hora_inicio)==parseInt(hora)){
                  this.eliminarHorario(horario,programa,estado);
                  break;
                }else if(parseInt(hora)>parseInt(horario.pk_horario.hor_hora_inicio) && parseInt(hora)<=parseInt(horario.pk_horario.hor_hora_fin)){
                  this.eliminarHorario(horario,programa,estado);
                  break;
                }
              }
            }
          });
        });
      }

    }
    this.dia_capturado = "";
    
  }

  cargarHorario(lista:Horario[]){
    this.formatearTablaReservas();
    for (let horario of lista) {
      this._programas.getPrograma(horario.pro_id).subscribe((data:any) =>{
        
        let color = this.darColor(horario.pro_id);
        for (let i = parseInt(horario.pk_horario.hor_hora_inicio); i < parseInt(horario.pk_horario.hor_hora_fin); i++){
          try {
            this.dataSource[i-8][horario.pk_horario.hor_dia][0]=data['pro_nombre'];
          } catch (error) {
            this.dataSource[i-8][horario.pk_horario.hor_dia][0]=horario.user_id;
          }
          
          this.dataSource[i-8][horario.pk_horario.hor_dia][1] = true;
          this.dataSource[i-8][horario.pk_horario.hor_dia][2]=color;
          this.dataSource[i-8][horario.pk_horario.hor_dia][3]=horario.hor_estado;
        }
      });
      
    }
  }

  registrarH_R(){
    let horaInicio = this.horaInicioControl.value;
    let horaFin = this.horaFinControl.value;
    let programa = this.programaControl.value;
    this.mostrarButton = false;
    //this.formatearTablaReservas(); 
    if (this.login.rol=="admin") {

      if(this.estado_horario==0){
        this._programas.getProgramaByNombre(programa).subscribe((data)=>{
          for(let dia of this.listaDiasAgregar){
            let dato: Horario = {pk_horario:{hor_hora_inicio:horaInicio,hor_hora_fin:horaFin,hor_dia:dia,hor_fecha_inicio:this.fechaInicio,hor_fecha_fin:this.fechaFin,esc_nombre:this.dato},hor_estado:parseString(this.estado_horario),pro_id:data.pro_id,user_id:""};       
            this.validarFechaInicioFechaFin(horaInicio,horaFin,dia,dato);
          }
        });
      }else{
        let fechaActual = new Date();
        let fechaInicio = fechaActual.getFullYear()+"-"+(fechaActual.getMonth() + 1)+"-"+fechaActual.getDate();
        let fechaFin = this.obtenerFechaFinDeFechaInicio(fechaActual);
        let dato: Horario = {pk_horario:{hor_hora_inicio:horaInicio,hor_hora_fin:horaFin,hor_dia:this.diaAgregar,hor_fecha_inicio:fechaInicio,hor_fecha_fin:fechaFin,esc_nombre:this.dato},hor_estado:parseString(this.estado_horario),pro_id:"",user_id:this.codigo};       
        
        this.validarFechaInicioFechaFin(horaInicio,horaFin,this.diaAgregar,dato);

      }

      

      
      
    }
  }

  obtenerFechaFinDeFechaInicio(fechaInicio:any):string{
    let suma:any = {domingo:0,lunes:6,martes:5,miércoles:4,jueves:3,viernes:2,sábado:1};
    fechaInicio.setDate(fechaInicio.getDate() + suma[this.nombreDelDiaSegunFecha(fechaInicio)]);
    return fechaInicio.getFullYear()+"-"+(fechaInicio.getMonth() + 1)+"-"+fechaInicio.getDate();;
  }

  nombreDelDiaSegunFecha = (fecha:any) => [
    'domingo',
    'lunes',
    'martes',
    'miércoles',
    'jueves',
    'viernes',
    'sábado',
  ][new Date(fecha).getDay()];

  validarFechaInicioFechaFin(horaInicio:number,horaFin:number,dia:String,dato:Horario){
    this._horarios.getHorarios(this.dato).subscribe(listaH => {
      let estado = false;
      for (let horario of listaH) {
        if(horario.pk_horario.hor_dia==dia){
          if(horaInicio>=parseInt(horario.pk_horario.hor_hora_inicio) && horaFin<=parseInt(horario.pk_horario.hor_hora_fin)){
            estado = true;
            break;
          }else if(horaInicio>=parseInt(horario.pk_horario.hor_hora_inicio) && horaInicio<parseInt(horario.pk_horario.hor_hora_fin)){
            estado = true;
            break;
          }else if(horaFin>parseInt(horario.pk_horario.hor_hora_inicio) && horaFin<=parseInt(horario.pk_horario.hor_hora_fin)){
            estado = true;
            break;
          }else if(horaInicio<parseInt(horario.pk_horario.hor_hora_inicio) && horaFin>=parseInt(horario.pk_horario.hor_hora_fin)){
            estado = true;
            break;
          }
        }
      }
      if(estado){
        //window.alert("Error");
        this.mensajeErrorCrearHorario();
      }else{
        
        this._horarios.crearHorario(dato).subscribe(result=>{
          this._horarios.getHorarios(this.dato).subscribe(horas => {
            this.cargarHorario(horas);
          });
        });
        this.mensajeCorrectoCrearHorario();
      }
      this.mostrarButton = true;

    });
  }

  mensajeConfirmacionEliminar(): void {
    this.openSnackBar('El horario elimino correctamente', '', {
      duration: 2000,
      horizontalPosition: 'center',
      verticalPosition: 'top',
    });
  }
  mensajeErrorCrearHorario(): void {
    this.openSnackBar('No se registro correctamente el horario, rango incorrecto', '', {
      duration: 2000,
      horizontalPosition: 'center',
      verticalPosition: 'top',
    });
  }

  mensajeCorrectoCrearHorario(): void {
    this.openSnackBar('Se registro correctamente el horario...', '', {
      duration: 2000,
      horizontalPosition: 'center',
      verticalPosition: 'top',
    });
  }

  openSnackBar(message: string, action: string, f: any) {
    this._snackBar.open(message, action, f);
  }

  onChangeHoraFin(){
    if(this.login.rol=='admin'){
      if(this.estado_horario==0){
        this.validatorsDatosAdmin[3] = this.horaFinControl.value==""?false:true;
        this.validarButtonAgregarAdmin();
      }else{
        this.validatorsDatosAdminReservas[2] = this.horaFinControl.value==""?false:true;
        this.validarButtonAgregarAdmin();
      }

      
    }else{
      this.validatorsDatosInvitado[2] = this.horaFinControl.value==""?false:true;
      this.validarButtonAgregarInvitado();
    }
  }
  onChangeFecha(){
    this.validatorsDatosAdmin[4] = !this.range.invalid;    
    this.fechaInicio =this.range.value.start.getFullYear()+"-"+(this.range.value.start.getMonth() + 1)+"-"+this.range.value.start.getDate();
    this.fechaFin = this.range.value.end.getFullYear()+"-"+(this.range.value.end.getMonth() + 1)+"-"+this.range.value.end.getDate();
    this.validarButtonAgregarAdmin(); 
  }
  cambiarHoraFin(){
    if(this.login.rol=='admin'){

      if(this.estado_horario==0){
        this.validatorsDatosAdmin[2] = this.horaInicioControl.value==""?false:true;
        this.validarButtonAgregarAdmin();
      }else{
        this.validatorsDatosAdminReservas[3] = this.horaInicioControl.value==""?false:true;
        this.validarButtonAgregarAdmin();
      }

      
    }else{
      this.validatorsDatosInvitado[1] = this.horaInicioControl.value==""?false:true;
      this.validarButtonAgregarInvitado();
    }


    this.lista_horas_fin = [];
    let n = this.horaInicioControl.value;
    

    if (this.login.rol == 'admin') {
      while(n<20){
        this.lista_horas_fin.push(++n);
      }
    }else{
      this.lista_horas_fin.push(++n);
      this.lista_horas_fin.push(++n);
    }
  }
}
function parseString(estado_horario: number): string {
  return estado_horario.toString();
}

