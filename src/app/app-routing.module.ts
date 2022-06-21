import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { FicheroComponent } from './components/fichero/fichero.component';
import { LoginComponent } from './components/dashboard/login/login.component';

const routes: Routes = [
  {path: 'fichero',component: FicheroComponent},
  {path: '',redirectTo:'dashboard',pathMatch:'full'},
  {path: 'dashboard',loadChildren:()=>import('./components/dashboard/dashboard.module').then(x=>x.DashboardModule)},
  {path: '**',redirectTo:'dashboard',pathMatch:'full'},
];

@NgModule({
  imports: [RouterModule.forRoot(routes,{useHash:true})],
  exports: [RouterModule]
})
export class AppRoutingModule { }
