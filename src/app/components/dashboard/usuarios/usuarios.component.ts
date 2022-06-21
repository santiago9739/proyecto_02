import { Component, NgModule, OnInit, ViewChild } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { MatPaginator } from '@angular/material/paginator';
import { MatSnackBar } from '@angular/material/snack-bar';
import { MatSort,Sort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import { Usuario } from '@data/interfaces/usuario';
import { UsuarioService } from 'app/services/usuario.service';
import { Observable, Subscription } from 'rxjs';
import { EditarUsuarioComponent } from '../ventanas/editar-usuario/editar-usuario.component';
import { RemoveUsuarioComponent } from '../ventanas/remove-usuario/remove-usuario.component';

@Component({
  selector: 'app-usuarios',
  templateUrl: './usuarios.component.html',
  styleUrls: ['./usuarios.component.scss']
})

export class UsuariosComponent implements OnInit {

  //#region Atributos
  displayedColumns: string[] = ['programa','codigo','identificacion', 'nombres', 'apellidos',"acciones"];
  listUser:Usuario[]=[];
  dataSource = new MatTableDataSource<Usuario>(this.listUser);
  @ViewChild(MatPaginator) paginator: any;
  @ViewChild(MatSort) sort: any;
  usuarioSubscripcion!: Subscription;
  //#endregion

  //#region Constructores
  constructor(private _usuarios:UsuarioService,private _snackBar: MatSnackBar,public dialog: MatDialog) {
    this.usuarioSubscripcion = this._usuarios.getUsuarios().subscribe((users:Usuario[]) => {
      this.dataSource.data = users;
    });
  }
  ngAfterViewInit() { 
    this.dataSource.paginator = this.paginator;
    this.dataSource.sort = this.sort;
    this._usuarios.noitificarAll();
  }
  ngOnDestroy(){
    this.usuarioSubscripcion.unsubscribe();
  }

  ngOnInit(): void {}
  //#endregion
  
  //#region Eventos
  eliminarUsuario(user:Usuario){
    this.dialog.open(RemoveUsuarioComponent,{
      data: {usuario: user, method: "Remove"},
    }).afterClosed().subscribe((result:any) => {
      if(result!==undefined)
        if(result.status==true){
          this._usuarios.eliminarUsuario(user);
          this.mensajeConfirmacionEliminar();
        }

    });
    
  }

  editarUsuario(user:Usuario){ 
    this._usuarios.getUserById(user.identificacion).subscribe(
      {
        next: dato=>{
          this.dialog.open(EditarUsuarioComponent, {
            data: {usuario: dato, method: "Editar"},height: '80%',width: '90%',disableClose: true
          }).afterClosed().subscribe((result:any) => {
            if(result!="false"){
              this._usuarios.editarUsuario(parseInt(user.identificacion),result);              
              this.mensajeConfirmacionEditar();
            }
            //if(result.facultad!==undefined && result.programa!==undefined)
          });
        }
      }
    );

    
  }

  crearUsuario() {
    let user: Usuario = {facultad: "Facultad de Artes",
    programa: "Artes Plásticas",
    codigo: "",
    identificacion: "",
    nombres: "",
    apellidos: "",
    usuario: "",
    image:null}; 
    const dialogRef = this.dialog.open(EditarUsuarioComponent, {
      data: {usuario:user, method: "Crear Nuevo"},height: '80%',width: '90%',disableClose: true})
      .afterClosed().subscribe((result:any) => {
      if(result!="false"){
        this._usuarios.agregarUsuario(result);
        this.mensajeConfirmacionCrear();
      }
        
      });
  }
  //#endregion

  

  //#region Otros metodos
  mensajeConfirmacionCrear():void{
    this.openSnackBar("El usuario se registro correctamente","",{
      duration: 2000,
      horizontalPosition: 'center',
      verticalPosition:'top'
    });
  }

  mensajeConfirmacionEliminar():void{
    this.openSnackBar("El usuario se elimino correctamente","",{
      duration: 2000,
      horizontalPosition: 'center',
      verticalPosition:'top'
    });
  }

  mensajeConfirmacionEditar():void{
    this.openSnackBar("El usuario se actualizo correctamente","",{
      duration: 2000,
      horizontalPosition: 'center',
      verticalPosition:'top'
    });
  }

  openSnackBar(message: string, action: string,f:any) {
    this._snackBar.open(message, action,f);
  }

  time = new Observable<string>(observer => {
    setInterval(() => observer.next(new Date().toString()), 1000);
  });
  //#endregion

  //#region paginacion
  //ayuda a filtrar la informacion. -> paginación.
  applyFilter(event: Event) {
    const filterValue = (event.target as HTMLInputElement).value;
    this.dataSource.filter = filterValue.trim().toLowerCase();

    if (this.dataSource.paginator) {
      this.dataSource.paginator.firstPage();
    }
  }

  sortData(sort: Sort) {
    const data = this.dataSource.data.slice();
    if (!sort.active || sort.direction === '') {
      this.dataSource.data = data;
      return;
    }
    this.dataSource.data = data.sort((a, b) => {
      const isAsc = sort.direction === 'asc';
      switch (sort.active) {
        case 'nombres':
          return this.compare(a.nombres, b.nombres, isAsc);
        case 'codigo':
          return this.compare(a.codigo, b.codigo, isAsc);
        case 'facultad':
          return this.compare(a.facultad, b.facultad, isAsc);
        case 'apellidos':
          return this.compare(a.apellidos, b.apellidos, isAsc);
        case 'programa':
          return this.compare(a.programa, b.programa, isAsc);
        default:
          return 0;
      }
    });
  }

  compare(a: number | string, b: number | string, isAsc: boolean) {
    return (a < b ? -1 : 1) * (isAsc ? 1 : -1);
  }
  //#endregion
}
