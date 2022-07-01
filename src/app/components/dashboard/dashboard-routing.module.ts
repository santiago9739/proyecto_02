import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { LoginComponent } from './login/login.component';
import { DashboardComponent } from './dashboard.component';
import { InicioComponent } from './inicio/inicio.component';
import { ReportesComponent } from './reportes/reportes.component';
import { UsuariosComponent } from './usuarios/usuarios.component';
import { EscenariosComponent } from './escenarios/escenarios.component';
import { CategoriasComponent } from './categorias/categorias.component';
import { PruebaComponent } from './prueba/prueba.component';
import { ListCategoriasComponent } from './list-categorias/list-categorias.component';

const routes: Routes = [
  {
    path: '',
    component: DashboardComponent,
    children: [
      { path: '', component: InicioComponent },
      { path: 'usuario', component: UsuariosComponent },
      { path: 'categoria', component: CategoriasComponent },
      { path: 'reporte', component: ReportesComponent },
      { path: 'escenario', component: EscenariosComponent },
      { path: 'login', component: LoginComponent },
      { path: 'prueba', component: PruebaComponent },
      { path: 'reservacion/listarCategorias', component: ListCategoriasComponent}
    ],
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class DashboardRoutingModule {}
