import { HttpClient } from '@angular/common/http';
import { Injectable, Input, ViewChild } from '@angular/core';
import { Login } from '@data/interfaces/login';
import { Usuario } from '@data/interfaces/usuario';
import { NavbarComponent } from 'app/components/dashboard/navbar/navbar.component';
import { map, Observable, Subject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class UsuarioService {

  listaUsuario! : Usuario[];
  sub = new Subject<Usuario[]>();
  subLogin = new Subject<Login>();


  constructor(private http: HttpClient) { 
    //this.listaUsuario = this.http.get<Usuario[]>('./assets/data/csvjson.json');
    this.http.get<Usuario[]>('/api/usuarios').subscribe(data=>{
      this.listaUsuario = data;
      this.noitificarAll();
    });
    this.userLogin = {user:"",password:"",rol:"admin"};
  } 

  userLogin: Login;

  getLogin():Observable<Login>{
    return this.subLogin.asObservable();
  }
  noitificarLogin():void{
    this.subLogin.next(this.userLogin);
  }
  logout(){
    this.userLogin = {user:"",password:"",rol:"invitado"};
    this.noitificarLogin();
  }
  login(user:string,password:string):boolean{
    let estado = false;
    if(user == "kevith" && password == "123"){
      this.userLogin.user = 'kevith';
      this.userLogin.password = '123';
      this.userLogin.rol='admin';
      estado = true;
    }
    if(user == "pipe15" && password == "123"){
      this.userLogin.user = 'pipe15';
      this.userLogin.password = '123';
      this.userLogin.rol='no-admin';
      estado = true;
    }
    this.noitificarLogin();
    return estado;
  }

  noitificarAll():void{
    this.sub.next(this.listaUsuario);
  }

  getUsuarios(): Observable<Usuario[]>{
    return this.sub.asObservable();
  }
  /*
  getUsuarios():Observable<Usuario[]>{
    return this.listaUsuario;
  }
  */
  eliminarUsuario(user:Usuario):boolean{
    this.http.delete("api/usuarios/"+user.identificacion).subscribe({
      next: data=>{
        this.http.get<Usuario[]>('/api/usuarios').subscribe(data=>{
          this.listaUsuario = data;
          this.noitificarAll();
        });
        return data;
      },
      error: error => {
          console.error('There was an error!', error);
      }
    });
    return false;
    /*
    this.listaUsuario = this.listaUsuario
    .pipe( // Transformamos el Observable y lo guardamos
      map((data) => {
        return data.filter(user2=> user2.codigo!=user.codigo);
      })
    );
    */
  }

  agregarUsuario(user:Usuario){
    const body = { 
      facultad: user.facultad,
      programa: user.programa,
      codigo: user.codigo,
      identificacion: user.identificacion,
      nombres: user.nombres,
      apellidos: user.apellidos,
      usuario: user.usuario,
      image: user.image
    };

    this.http.post<Usuario[]>("api/usuarios",user).subscribe({
      next: data => {
        this.http.get<Usuario[]>('/api/usuarios').subscribe(data=>{
          this.listaUsuario = data;
          this.noitificarAll();
        });
        //this.noitificarAll();
      },
      error: error => {
          console.error('There was an error!', error);
      }
    });
    /*
    if(user.image!==undefined){
      const uploadImageData = new FormData();
      uploadImageData.append('imageFile', user.image, user.image.name);
      console.log("entro aqui");
      
      this.http.post<Usuario[]>(`api/usuarios-image/${user.identificacion}`,uploadImageData).subscribe({
        next: data=>{

        },
        error: error => {
            console.error('There was an error!', error);
        }
      }
        
      );
    }
    /*
    this.http.get("api/usuarios/1059362874").subscribe(
      {
        next: data => {
          console.log("user recuperado: ");
          
          console.log(data);
          
        }
      }
    )
    /*
    this.listaUsuario = this.listaUsuario
    .pipe( // Transformamos el Observable y lo guardamos
      map((data) => {
        data.push(user);
        return data;
      })
    );
    */
  }

  getUserById(id:any):Observable<Usuario>{
    return this.http.get<Usuario>(`api/usuarios/${id}`);
  }

  editarUsuario(id:number,user:Usuario){

    this.http.put("api/usuarios/"+id,user).subscribe({
      next:(data)=>{
        this.http.get<Usuario[]>('/api/usuarios').subscribe(data=>{
          this.listaUsuario = data;
          this.noitificarAll();
        });
        this.noitificarAll();
      },
      error: error => {
          console.error('There was an error!', error);
      }
      
    });
    /*
    this.listaUsuario = this.listaUsuario
    .pipe( // Transformamos el Observable y lo guardamos
      map((data) => {
        return data.filter(u=>{
          if(u.codigo==user.codigo){
            //console.log(user);
            //console.log(u);
            u.apellidos = user.apellidos;
            u.nombres = user.nombres;
            u.programa = user.programa;
            u.usuario = user.usuario;
            u.facultad = user.facultad;
          }
          return u;
        })
      })
    );
    */
  }

}
