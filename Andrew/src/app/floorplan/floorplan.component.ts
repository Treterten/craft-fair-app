import { Component, OnInit } from '@angular/core';
import { Table } from '../models/table.model';
import { FloorplanService } from '../services/floorplan.service';

@Component({
  selector: 'app-floorplan',
  templateUrl: './floorplan.component.html',
  styleUrls: ['./floorplan.component.css']
})
export class FloorplanComponent implements OnInit {

  public tables: Table[] = [
    {
      tableNumber: 1,
      x: 1,
      y: 1,
      width: 1,
      height: 1
    }
  ];

  constructor() { }

  ngOnInit() {
  }

}
