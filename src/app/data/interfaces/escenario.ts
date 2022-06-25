import { Categoria } from "./categoria";

export interface Escenario{
    esc_nombre:string;
    esc_descripcion:string;
    esc_foto:any;
    esc_estado:string;
    categoria: Categoria;
}