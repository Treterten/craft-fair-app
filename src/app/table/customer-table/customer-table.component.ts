import { Component, OnInit } from '@angular/core';
import { Vendor } from '../vendor.model';
import { TableService } from '../table.service';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-customer-table',
  templateUrl: './customer-table.component.html',
  styleUrls: ['./customer-table.component.css']
})
export class CustomerTableComponent implements OnInit {
  private customerSub: Subscription;
  customers: Vendor[] = [];
  displayedColumns: string[] = ['name', 'address', 'delete', 'edit'];

  firstName: string;
  lastName: string;
  address: string;

  changedCustomer: Vendor = {
    id: '',
    firstName: '',
    lastName: '',
    business: '',
    address: '',
    applicationSent: false,
    applicationRecieved: false,
    boothNumber: 0
  };

  constructor(private tableService: TableService) { }

  ngOnInit() {
    this.tableService.getCustomerList();
    this.customerSub = this.tableService.getCustomerUpdateListener()
      .subscribe((vendorList: Vendor[]) => {
        this.customers = vendorList;
        console.log(vendorList);
      });
  }

  onDeleteCustomer(id: string) {
    this.tableService.deleteCustomer(id);
  }

  beginEditCustomer(vendor: Vendor) {
    this.changedCustomer = Object.assign({}, vendor);
  }

  onEditCustomer() {
    console.log("I'm in onEditCustomer");

    this.tableService.editCustomer(this.changedCustomer);
  }

  ngOnDestroy() {
    this.customerSub.unsubscribe();
  }



}
