import { ChangeDetectorRef, Component, OnInit, ViewChild } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { MatPaginator } from '@angular/material/paginator';
import { MatSnackBar } from '@angular/material/snack-bar';
import { MatSort, Sort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import { Categoria } from '@data/interfaces/categoria';
import { Escenario } from '@data/interfaces/escenario';
import { EscenarioService } from 'app/services/escenario.service';
import { Observable, Subscription } from 'rxjs';
import { EditarComponent } from './editar/editar.component';
import { RemoveComponent } from './remove/remove.component';
@Component({
  selector: 'app-escenarios',
  templateUrl: './escenarios.component.html',
  styleUrls: ['./escenarios.component.scss'],
})
export class EscenariosComponent implements OnInit {
  //#region Atributos
  displayedColumns: string[] = [
    'cat_nombre',
    'esc_nombre',
    'imagen',
    'estado',
    'acciones',
  ];
  listEscenario: Escenario[] = [];
  dataSource = new MatTableDataSource<Escenario>(this.listEscenario);
  @ViewChild(MatPaginator) paginator: any;
  @ViewChild(MatSort) sort: any;
  escenarioSubscripcion!: Subscription;
  //#endregion

  //#region Constructores
  constructor(
    private _escenarios: EscenarioService,
    private _snackBar: MatSnackBar,
    public dialog: MatDialog,
    private changeDetector: ChangeDetectorRef
  ) {
    this.escenarioSubscripcion = this._escenarios
      .getEscenarios()
      .subscribe((esc: Escenario[]) => {
        if (esc != null) {
          this.dataSource.data = esc.map((e) => {
            e.esc_estado = e.esc_estado == '0' ? 'HABILITADO' : 'INHABILITADO';
            e.esc_nombre = e.esc_nombre.toUpperCase();
            e.categoria.cat_nombre = e.categoria.cat_nombre.toUpperCase();
            return e;
          });
        }
      });
  }
  ngAfterViewInit() {
    this.dataSource.paginator = this.paginator;
    this.dataSource.sort = this.sort;
    this._escenarios.noitificarAll();
    setTimeout(() => {}, 0);
  }
  ngOnDestroy() {
    this.escenarioSubscripcion.unsubscribe();
  }

  ngOnInit(): void {}
  ngAfterViewChecked() {
    this.changeDetector.detectChanges();
  }
  //#endregion

  //#region Eventos
  eliminarEscenario(escenario: Escenario) {
    this.dialog
      .open(RemoveComponent, {
        data: { dato: escenario, method: 'Remove' },
      })
      .afterClosed()
      .subscribe((result: any) => {
        if (result !== undefined)
          if (result.status == true) {
            this._escenarios.eliminarEscenario(escenario);
            this.mensajeConfirmacionEliminar();
          }
      });
  }

  editarEscenario(escenario: Escenario) {
    this._escenarios.getEscenarioById(escenario.esc_nombre).subscribe({
      next: (esc) => {
        console.log(esc);

        this.dialog
          .open(EditarComponent, {
            data: { dato: esc, method: 'Editar' },
            height: '80%',
            width: '90%',
            disableClose: true,
          })
          .afterClosed()
          .subscribe((result: any) => {
            if (result != false) {
              this._escenarios.editarEscenario(esc.esc_nombre, result);
              this.mensajeConfirmacionEditar();
            }
          });
      },
    });
  }

  crearEscenario() {
    let v_categoria: Categoria = {
      cat_nombre: '',
      cat_descripcion: '',
      cat_foto: null,
    };

    let escenario: Escenario = {
      esc_nombre: '',
      esc_descripcion: '',
      esc_foto: null,
      esc_estado: '',
      categoria: v_categoria,
    };
    const dialogRef = this.dialog
      .open(EditarComponent, {
        data: { dato: escenario, method: 'Crear Nuevo' },
        height: '80%',
        width: '90%',
        disableClose: true,
      })
      .afterClosed()
      .subscribe((result: any) => {
        if (result != false) {
          this._escenarios.agregarEscenario(result);
          this.mensajeConfirmacionCrear();
        }
      });
  }
  //#endregion

  //#region Otros metodos
  mensajeConfirmacionCrear(): void {
    this.openSnackBar('Se registro correctamente el escenario', '', {
      duration: 2000,
      horizontalPosition: 'center',
      verticalPosition: 'top',
    });
  }

  mensajeConfirmacionEliminar(): void {
    this.openSnackBar('El usuario se elimino correctamente', '', {
      duration: 2000,
      horizontalPosition: 'center',
      verticalPosition: 'top',
    });
  }

  mensajeConfirmacionEditar(): void {
    this.openSnackBar('El usuario se actualizo correctamente', '', {
      duration: 2000,
      horizontalPosition: 'center',
      verticalPosition: 'top',
    });
  }

  openSnackBar(message: string, action: string, f: any) {
    this._snackBar.open(message, action, f);
  }

  time = new Observable<string>((observer) => {
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
        case 'esc_estado':
          return this.compare(a.esc_estado, b.esc_estado, isAsc);
        case 'esc_nombre':
          return this.compare(a.esc_nombre, b.esc_nombre, isAsc);
        case 'cat_nombre':
          return this.compare(
            a.categoria.cat_nombre,
            b.categoria.cat_nombre,
            isAsc
          );
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
