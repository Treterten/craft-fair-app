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
  displayedColumns: string[] = ['name', 'address', 'delete', 'edit'];

  name: string;
  address: string;

  changedCustomer: Customer = {
    name: '',
    address: '',
    id: ''
  };

  constructor(private tableService: TableService) { }

  ngOnInit() {
    this.tableService.getCustomerList();
    this.customerSub = this.tableService.getCustomerUpdateListener()
      .subscribe((customerList: Customer[]) => {
        this.customers = customerList;
      });
  }

  onSubmit() {
    if(this.name == undefined || this.address == undefined) {
      return;
    }
    let customer: Customer = {
      id: null,
      name: this.name,
      address: this.address
    };
    this.tableService.addCustomer(customer);
  }

  onDeleteCustomer(id: string) {
    this.tableService.deleteCustomer(id);
  }

  beginEditCustomer(customer: Customer) {
    this.changedCustomer = Object.assign({}, customer);
  }

  onEditCustomer() {
    console.log("I'm in onEditCustomer");

    this.tableService.editCustomer(this.changedCustomer);
  }

  ngOnDestroy() {
    this.customerSub.unsubscribe();
  }



}
