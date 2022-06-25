import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class FileService {
  constructor(private httpClient: HttpClient) {}

  selectedFile!: File;
  retrievedImage: any;
  base64Data: any;
  retrieveResonse: any;
  message!: string;
  //Gets called when the user clicks on submit to upload the image
  onUpload(selectedFile: any, name: any): Observable<any> {
    console.log('entro a onUpload');

    //FormData API provides methods and properties to allow us easily prepare form data to be sent with POST HTTP requests.
    const uploadImageData = new FormData();
    uploadImageData.append('imageFile', selectedFile, name);

    //Make a call to the Spring Boot Application to save the image
    return this.httpClient.post('api/upload', uploadImageData);
  }

  //Gets called when the user clicks on retieve image button to get the image from back end
  cargarImage(name: any): Observable<any> {
    //Make a call to Sprinf Boot to get the Image Bytes.
    console.log('entro a cargar image');

    return this.httpClient.get('api/get/' + name);
  }

  getImageDefault(): Observable<any> {
    //Make a call to Sprinf Boot to get the Image Bytes.
    return this.httpClient.get('./assets/barra.png');
  }
}
