import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import {
  FormBuilder,
  FormControl,
  FormGroup,
  Validators,
} from '@angular/forms';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort, Sort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import { Categoria } from '@data/interfaces/categoria';
import { EscenarioService } from 'app/services/escenario.service';
import { FileService } from 'app/services/file.service';
@Component({
  selector: 'app-categorias',
  templateUrl: './categorias.component.html',
  styleUrls: ['./categorias.component.scss'],
})
export class CategoriasComponent implements OnInit {
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
  constructor(
    private _escenarios: EscenarioService,
    private fb: FormBuilder,
    private _file: FileService
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

  ngOnInit(): void {
    console.log('editando la rama develop');
  }
  displayedColumns: string[] = ['nombre', 'descripcion', 'foto'];
  clickedRows = new Array<Categoria>();

  informacionColumna(p_cat: any) {
    this.clickedRows.push(p_cat);
    this.cargarInfoCategoria(p_cat);
    this.statusEditar = true;
    this.statusAgregar = false;
    this.bandera = true;
    this._escenarios
      .getEscenariosByCateogoria(this.nombreControl.value.toUpperCase())
      .subscribe({
        next: (escs) => {
          this.statusEliminar = escs.length == 0;
        },
      });
  }
  cargarInfoCategoria(categoria: Categoria) {
    this.nombreControl.setValue(categoria.cat_nombre);
    this.nombreControl.addValidators([Validators.min(1), Validators.required]);

    this.descripcionControl.setValue(categoria.cat_descripcion);
    this.descripcionControl.addValidators([
      Validators.min(1),
      Validators.required,
    ]);

    if (categoria.cat_foto != null)
      this.retrievedImage = 'data:image/jpeg;base64,' + categoria.cat_foto;
    else this.retrievedImage = undefined;
  }
  bandera: boolean = false;
  onChangeNombre() {
    if (this.nombreControl.status == 'VALID') {
      this._escenarios
        .getCategoriaById(this.nombreControl.value.toUpperCase())
        .subscribe({
          next: (cat: Categoria) => {
            if (cat != null) {
              console.log('entro aqui');
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

  ngAfterViewInit() {
    this.dataSource.paginator = this.paginator;
    this.dataSource.sort = this.sort;
  }
  onImageDefault() {
    this.retrievedImage = undefined;
    this.elementInput.nativeElement.value = '';
    //this.escenario.esc_foto = null;
  }
  //Gets called when the user selects an image
  onFileChanged(event: any) {
    //Select File
    const reader = new FileReader();
    reader.onload = (e: any) => {
      //this.escenario.esc_foto = e.target.result.split('base64,')[1];
      this.retrievedImage =
        'data:image/jpeg;base64,' + e.target.result.split('base64,')[1];
    };
    reader.readAsDataURL(event.target.files[0]);
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
}
