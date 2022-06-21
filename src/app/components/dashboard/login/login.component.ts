import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import {MatSnackBar} from '@angular/material/snack-bar';
import { Router } from '@angular/router';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss']
})
export class LoginComponent implements OnInit {

  hide = true;
  loading = false;
  form: FormGroup;

  constructor(private fb:FormBuilder,private _snackBar: MatSnackBar,private router: Router) {
    this.form = fb.group({
      user:['',Validators.required],
      password:['',Validators.required],
    });
  }

  ngOnInit(): void {
  }

  public ingresar(): void{
    let user = this.form.value.user;
    let password = this.form.value.password;

    if(user == "kevith" && password == "123"){
      //lo redirige a la pagina principal
      this.fakeLoading();
      this.form.reset();
    }else{
      this.loading = false;
      this.error();

    }
    
  }

  openSnackBar(message: string, action: string,f:any) {
    this._snackBar.open(message, action,f);
  }

  error():void{
    this.openSnackBar("El user o Password son invalidos...","X",{
      duration: 2000,
      horizontalPosition: 'center',
      verticalPosition:'top'
    });
  }

  fakeLoading():void{
    this.loading = true;
    setTimeout(()=>{
      // lo redireccionamos al dasboard
      this.router.navigate(["dashboard"]);
      //this.loading = false;
    },1000);
  }

}
