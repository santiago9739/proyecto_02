import { HttpClient } from '@angular/common/http';
import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { Escenario } from '@data/interfaces/escenario';

@Component({
  selector: 'app-prueba',
  templateUrl: './prueba.component.html',
  styleUrls: ['./prueba.component.scss'],
})
export class PruebaComponent implements OnInit {
  imageURL!: string;
  uploadForm: FormGroup;

  constructor(public fb: FormBuilder, private _http: HttpClient) {
    this.uploadForm = this.fb.group({
      avatar: [null],
      name: [''],
    });
  }

  @ViewChild('MyRef') element!: ElementRef;
  ngOnInit() {
    console.log(this.element);
  }
  ngAfterViewInit() {
    console.log(this.element);
  }

  showPreview(event: any) {
    this.file = event.target.files[0];
    //const reader = new FileReader();
    //reader.onload = () => (this.imageURL = reader.result as string);
    //reader.readAsDataURL(event.target.files[0]);
  }

  esc: Escenario = {
    esc_nombre: 'CANCHA 12',
    esc_descripcion: ' descripcion de la cancha 1',
    esc_foto: null,
    esc_estado: '0',
    categoria: {
      cat_nombre: 'CDU',
      cat_descripcion: 'centro deportivo tulcan',
      cat_foto: null,
    },
  };

  imagen: any = {
    image: null,
  };

  submit() {
    //console.log(this.uploadForm.value);

    this.agregarEscenario(this.esc);
  }
  file: any;
  agregarEscenario(escenario: Escenario) {
    //const uploadImageData = new FormData();
    //uploadImageData.append('imageFile', this.file, this.file.name);
    //console.log(this.imageURL);

    const reader = new FileReader();
    reader.onload = (e: any) => {
      this.imagen.image = e.target.result.split('base64,')[1];
    };
    reader.readAsDataURL(this.file);
  }

  registrar() {
    this._http.post<any>('api/prueba', this.imagen).subscribe({
      next: (data) => {
        // this._http.get<Escenario[]>('/api/escenarios').subscribe((data) => {
        this.imageURL = 'data:image/jpeg;base64,' + data.image;
        console.log(data);
        //});
      },
      error: (error) => {
        console.error('There was an error!', error);
      },
    });
  }
}
