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
  private vendorSub: Subscription;
  vendors: Vendor[] = [];
  displayedColumns: string[] = ['name', 'address', 'delete', 'edit'];

  firstName: string;
  lastName: string;
  address: string;

  changedVendor: Vendor = {
    id: '',
    firstName: '',
    lastName: '',
    business: '',
    applicationSent: false,
    applicationRecieved: false,
    boothNumber: 0
  };

  constructor(private tableService: TableService) { }

  ngOnInit() {
    this.tableService.getVendorList();
    this.vendorSub = this.tableService.getVendorsUpdateListener()
      .subscribe((vendorList: Vendor[]) => {
        this.vendors = vendorList;
        console.log(vendorList);
      });
  }

  onDeleteVendor(id: string) {
    this.tableService.deleteVendor(id);
  }

  beginEditVendor(vendor: Vendor) {
    this.changedVendor = Object.assign({}, vendor);
  }

  onEditVendor() {
    console.log("I'm in onEditCustomer");

    this.tableService.editVendor(this.changedVendor);
  }

  ngOnDestroy() {
    this.vendorSub.unsubscribe();
  }



}
