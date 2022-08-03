import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import {
  FormBuilder,
  FormControl,
  FormGroup,
  Validators,
} from '@angular/forms';
import { MatDialog } from '@angular/material/dialog';
import { MatPaginator } from '@angular/material/paginator';
import { MatSnackBar } from '@angular/material/snack-bar';
import { MatSort, Sort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import { Categoria } from '@data/interfaces/categoria';
import { CategoriaService } from 'app/services/categoria.service';
import { EscenarioService } from 'app/services/escenario.service';
import { FileService } from 'app/services/file.service';
import { RemoveComponent } from './remove/remove.component';
@Component({
  selector: 'app-categorias',
  templateUrl: './categorias.component.html',
  styleUrls: ['./categorias.component.scss'],
})
export class CategoriasComponent implements OnInit {
  //#region Atributos
  categorias!: Categoria[];
  retrievedImage: any;
  form!: FormGroup;
  nombreControl = new FormControl();
  descripcionControl = new FormControl();
  statusAgregar: boolean = false;
  statusEditar: boolean = false;
  statusEliminar: boolean = false;
  @ViewChild(MatPaginator) paginator: any;
  @ViewChild(MatSort) sort: any;
  @ViewChild('imagen') elementInput!: ElementRef;
  dataSource = new MatTableDataSource<Categoria>(this.categorias);
  foto: any = null;
  displayedColumns: string[] = ['nombre', 'descripcion', 'foto'];
  clickedRows = new Array<Categoria>();
  bandera: boolean = false;
  categoria: Categoria = {
    cat_nombre: '',
    cat_descripcion: '',
    cat_foto: null,
  };
  //#endregion

  //#region Constructores
  constructor(
    private _escenarios: EscenarioService,
    private fb: FormBuilder,
    private _file: FileService,
    private _categorias: CategoriaService,
    private elementRef: ElementRef,
    private _snackBar: MatSnackBar,
    public dialog: MatDialog,
  ) {
    this.form = fb.group({
      nombre: this.nombreControl,
      descripcion: this.descripcionControl,
    });

    this._escenarios.getCategorias().subscribe({
      next: (cats) => {
        this.categorias = cats;
        this.dataSource.data = cats;
      },
    });
    this.cargarInfoCategoria({
      cat_nombre: '',
      cat_descripcion: '',
      cat_foto: null,
    });
  }

  ngAfterViewInit() {
    this.dataSource.paginator = this.paginator;
    this.dataSource.sort = this.sort;
    this.elementRef.nativeElement.focus();
  }

  ngOnInit(): void {}

  //#endregion

  //#region Mutadores
  crear() {
    //TODO LJ
    let categoria: Categoria = {
      cat_nombre: this.nombreControl.value,
      cat_descripcion: this.descripcionControl.value,
      cat_foto: this.foto,
    };
    this._categorias.agregarCategoria(categoria).subscribe({
      next: (result) => {
        if (result != null) {
          this.updateCategorias();
          this.mensajeConfirmacionCrear();
        }
        this.limpiarInfoCategoria();
      },
    });
  }

  updateCategorias() {
    this._categorias.getCategorias().subscribe({
      next: (resultGetCat) => {
        this.categorias = resultGetCat;
        this.dataSource.data = resultGetCat;
      },
    });
  }

  actualizar() {
    this.categoria.cat_descripcion = this.descripcionControl.value;
    
    if(this.foto!=null){
      this.categoria.cat_foto = this.foto;
    }
    
    
    this._categorias
      .editarCategoria(this.categoria.cat_nombre, this.categoria)
      .subscribe({
        next: (resultEdi) => {
          if (resultEdi != null) {
            this.updateCategorias();
            this.mensajeConfirmacionEditar();
          }
          this.limpiarInfoCategoria();
        },
      });
  }

  eliminar() {
    this.dialog
      .open(RemoveComponent, {
        data: { dato: this.categoria, method: 'Remove' },
      })
      .afterClosed()
      .subscribe((result: any) => {
        if (result !== undefined)
          if (result.status == true) {
            this._categorias.eliminarCategoria(this.categoria).subscribe({
              next: (result) => {
                if (result == true) {
                  this.updateCategorias();
                  this.mensajeConfirmacionEliminar();
                }
              },
            });
            this.limpiarInfoCategoria();
          }
      }); 
    
  }
  //#endregion

  //#region Metodos

  limpiarInfoCategoria()
  {
    this.categoria = {cat_descripcion:"",cat_foto:null,cat_nombre:""}
    this.cargarInfoCategoria(this.categoria);
    this.statusAgregar = this.statusEditar = this.statusEliminar = false;
    
  }

  cargarInfoCategoria(categoria: Categoria) {
    
    this.categoria = categoria;
    this.nombreControl.addValidators([Validators.min(1), Validators.required]);
    this.nombreControl.setValue(categoria.cat_nombre);

    this.descripcionControl.addValidators([
      Validators.min(1),
      Validators.required,
    ]);
    this.descripcionControl.setValue(categoria.cat_descripcion);

    if (categoria.cat_foto != null)
      this.retrievedImage = 'data:image/jpeg;base64,' + categoria.cat_foto;
    else this.retrievedImage = undefined;
  }

  informacionColumna(p_cat: any) {
    this.onImageDefault();
    this.clickedRows.push(p_cat);
    this.cargarInfoCategoria(p_cat);
    this.statusEditar = true;
    //this.statusAgregar = false;
    this.onChangeStatus();
    this.bandera = true;
    this._escenarios
      .getEscenariosByCateogoria(this.nombreControl.value.toUpperCase())
      .subscribe({
        next: (escs) => {
          this.statusEliminar = escs.length == 0;
        },
      });
  }

  onChangeNombre() {
    if (this.nombreControl.status == 'VALID') {
      this._escenarios
        .getCategoriaById(this.nombreControl.value.toUpperCase())
        .subscribe({
          next: (cat: Categoria) => {
            if (cat != null) {
              this.limpiarForm();
              this.cargarInfoCategoria(cat);
              this.bandera = true;
              this.statusEditar = true;
              this._escenarios
                .getEscenariosByCateogoria(
                  this.nombreControl.value.toUpperCase()
                )
                .subscribe({
                  next: (escs) => {
                    this.statusEliminar = escs.length == 0;
                  },
                });
            } else {
              this.statusEditar = false;
              this.statusEliminar = false;
              if (this.bandera) {
                this.limpiarForm();
                this.bandera = false;
              }
            }
            this.onChangeStatus();
          },
          error: () => {
            console.log('error');
          },
        });
    } else {
      this.statusEditar = false;
      this.statusEliminar = false;
      if (this.bandera) {
        this.limpiarForm();
        this.bandera = false;
      }
      //this.descripcionControl.setValue('');
    }
  }

  onChangeStatus() {
    //this.nombreControl.setValue(this.nombreControl.value.toUpperCase());
    this.statusAgregar =
      this.form.status == 'VALID' && !this.statusEditar && !this.statusEliminar;
  }

  limpiarForm() {
    //this.nombreControl.setValue('');
    this.descripcionControl.setValue('');
    this.onImageDefault();
  }

  onImageDefault() {
    this.retrievedImage = undefined;
    this.elementInput.nativeElement.value = '';
    this.foto = null;
    //this.escenario.esc_foto = null;
  }
  //Gets called when the user selects an image
  onFileChanged(event: any) {
    //Select File
    //this.elementInput.nativeElement.value = '';
    const reader = new FileReader();
    reader.onload = (e: any) => {
      //this.escenario.esc_foto = e.target.result.split('base64,')[1];
      this.foto = e.target.result.split('base64,')[1];
      this.retrievedImage = 'data:image/jpeg;base64,' + this.foto;
    };
    reader.readAsDataURL(event.target.files[0]);
  }
  //#endregion

  //#region mensajes
  mensajeConfirmacionCrear(): void {
    this.openSnackBar('Se registro la categoria correctamente...', '', {
      duration: 2000,
      horizontalPosition: 'center',
      verticalPosition: 'top',
    });
  }

  mensajeConfirmacionEliminar(): void {
    this.openSnackBar('La categoria se elimino correctamente', '', {
      duration: 2000,
      horizontalPosition: 'center',
      verticalPosition: 'top',
    });
  }
  mensajeConfirmacionEditar(): void {
    this.openSnackBar('La categoria se actualizo correctamente', '', {
      duration: 2000,
      horizontalPosition: 'center',
      verticalPosition: 'top',
    });
  }

  openSnackBar(message: string, action: string, f: any) {
    this._snackBar.open(message, action, f);
  }
  //#endregion

  //#region metodos de la tabla

  sortData(sort: Sort) {
    const data = this.dataSource.data.slice();
    if (!sort.active || sort.direction === '') {
      this.dataSource.data = data;
      return;
    }
    this.dataSource.data = data.sort((a, b) => {
      const isAsc = sort.direction === 'asc';
      switch (sort.active) {
        case 'descripcion':
          return this.compare(a.cat_descripcion, b.cat_descripcion, isAsc);
        case 'nombre':
          return this.compare(a.cat_nombre, b.cat_nombre, isAsc);
        default:
          return 0;
      }
    });
  }

  compare(a: number | string, b: number | string, isAsc: boolean) {
    return (a < b ? -1 : 1) * (isAsc ? 1 : -1);
  }
  applyFilter(event: Event) {
    const filterValue = (event.target as HTMLInputElement).value;
    this.dataSource.filter = filterValue.trim().toLowerCase();

    if (this.dataSource.paginator) {
      this.dataSource.paginator.firstPage();
    }
  }
  //#endregion
}
