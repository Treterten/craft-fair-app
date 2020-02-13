import { Component, OnInit } from '@angular/core';
import { Customer } from '../customer.model';
import { TableService } from '../table.service';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-customer-table',
  templateUrl: './customer-table.component.html',
  styleUrls: ['./customer-table.component.css']
})
export class CustomerTableComponent implements OnInit {
  private customerSub: Subscription;
  customers: Customer[]= [];
  displayedColumns: string[] = ['name', 'address'];

  constructor(private tableService: TableService) { }

  ngOnInit() {
    this.tableService.getCustomerList();
    this.customerSub = this.tableService.getCustomerUpdateListener()
      .subscribe((customerList: Customer[]) => {
        this.customers = customerList;
      });
  }

  ngOnDestroy() {
    this.customerSub.unsubscribe();
  }



}
