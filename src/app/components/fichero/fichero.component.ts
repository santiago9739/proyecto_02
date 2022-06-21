import { Component, OnInit } from '@angular/core';
import { FileService } from 'app/services/file.service';

@Component({
  selector: 'app-fichero',
  templateUrl: './fichero.component.html',
  styleUrls: ['./fichero.component.scss']
})
export class FicheroComponent implements OnInit {

  constructor(private _file:FileService) { }
  ngOnInit(): void {
  }
  retrievedImage: any;
  message!: string;

  //Gets called when the user selects an image
  public onFileChanged(event:any) {
    //Select File
    this._file.onUpload(event.target.files[0],event.target.files[0].name).subscribe((response) => {
      if (response.status === 200) {
        this.message = 'Image uploaded successfully';
      } else {
        this.message = 'Image not uploaded successfully';
      }
    }
    );
    this._file.cargarImage(event.target.files[0].name).subscribe(
      res => {
        this.retrievedImage = 'data:image/jpeg;base64,' + res.picByte;
      }
    );
  }
}
