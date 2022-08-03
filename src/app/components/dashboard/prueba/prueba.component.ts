import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { Escenario } from '@data/interfaces/escenario';
import { Subject } from 'rxjs';
export interface PeriodicElement {
  name     : string;
  position : number;
  weight   : number;
  symbol   : string;
}

const ELEMENT_DATA: PeriodicElement[] = [
  { position: 1,  name: 'Hydrogen',  weight: 1.0079,  symbol: 'H'  },
  { position: 2,  name: 'Helium',    weight: 4.0026,  symbol: 'He' },
  { position: 3,  name: 'Lithium',   weight: 6.941,   symbol: 'Li' },
  { position: 4,  name: 'Beryllium', weight: 9.0122,  symbol: 'Be' },
  { position: 5,  name: 'Boron',     weight: 10.811,  symbol: 'B'  },
  { position: 6,  name: 'Carbon',    weight: 12.0107, symbol: 'C'  },
  { position: 7,  name: 'Nitrogen',  weight: 14.0067, symbol: 'N'  },
  { position: 8,  name: 'Oxygen',    weight: 15.9994, symbol: 'O'  },
  { position: 9,  name: 'Fluorine',  weight: 18.9984, symbol: 'F'  },
  { position: 10, name: 'Neon',      weight: 20.1797, symbol: 'Ne' },
];

interface RenderJob {
  type: 'pdf' | 'docx';
  data: PeriodicElement
}
@Component({
  selector: 'app-prueba',
  templateUrl: './prueba.component.html',
  styleUrls: ['./prueba.component.scss'],
})
export class PruebaComponent implements OnInit {
  private rowClick$  = new Subject<PeriodicElement>();
  private renderJob$ = new Subject<RenderJob>();

  dataSource = ELEMENT_DATA;
  displayedColumns = [ 'position', 'name', 'weight', 'symbol', 'descargaPdfDoc'];

  ngOnInit() {
    this.rowClick$.subscribe(
      row => console.log('[row clicked]', row)
    );
    this.renderJob$.subscribe(
      ({ type, data }) => console.log(`[render job received] type: ${type}`, data)
    );
  }

  descargarPDF(row: PeriodicElement) {
    this.renderJob$.next({ type: 'pdf', data: row });
  }

  descargarDocx(row: PeriodicElement) {
    this.renderJob$.next({ type: 'docx', data: row });
  }

  onRowClicked(row: PeriodicElement): void {
    this.rowClick$.next(row);
  }

  descargarPDFFueraDeMatTable() {
    console.log('funciona');
  }

}
