import { Injectable } from '@angular/core';
import { Table } from '../models/table.model';

@Injectable({
  providedIn: 'root'
})
export class FloorplanService {
  private tables: Table[] = [
    {
      tableNumber: 1,
      x: 1,
      y: 1,
      width: 1,
      height: 1
    }
  ];

  getTables() {
    return [...this.tables];
  }

  addTable(t: Table) {
    this.tables.push(t);
  }
  constructor() {}
}
