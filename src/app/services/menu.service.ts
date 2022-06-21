import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Menu } from '@data/interfaces/menu';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class MenuService {

  url!: string;
  constructor(private _http: HttpClient) { }
  
  getMenu():Observable<Menu[]>{
    return this._http.get<Menu[]>('./assets/data/menu.json');
    this.url = "";
  }

  uploadFile(File:any): Observable<any> {
    var peticion = "api/upload/";
    var json = JSON.stringify(File);
    console.log(File);
    var headers = new HttpHeaders().set("Content-Type","application/json");
    return this._http.post(peticion, File, { headers });
  }
    
  getUploads(): Observable<any> {
    var peticion = "api/get/nombre";
    return this._http.get(peticion);
  }
      
}
