import { Component, OnInit } from '@angular/core';


export interface PeriodicElement {
  number:number,
  appReceived:string,
  appSent:string,
  comments:string,
  firstName:string,
  lastName:string

}

//hey this is constant. maybe doesnt want to be.

const BOOTH_DATA: PeriodicElement[] = [
  {number: 429, appReceived: 'YES', appSent: 'YES', comments: '', firstName: 'John', lastName:'Doe'},

];





@Component({
  selector: 'app-table',
  templateUrl: './table.component.html',
  styleUrls: ['./table.component.css']
})
export class TableComponent implements OnInit {
  displayedColumns: string[] = ['number', 'appReceived', 'appSent', 'comments', 'firstName', 'lastName'];
  dataSource = BOOTH_DATA;


  constructor() { }

  ngOnInit(): void {
  }

}
