import { Component, OnInit } from '@angular/core';
import { TableService } from '../table.service';
import { Subscription } from 'rxjs';
import { Booth } from '../booth.model';
import { Vendor } from '../vendor.model';
import { FormControl, Validators } from '@angular/forms';

@Component({
  selector: 'app-booth-list',
  templateUrl: './booth-list.component.html',
  styleUrls: ['./booth-list.component.css']
})
export class BoothListComponent implements OnInit {
  private boothsSub: Subscription;
  private vendorSub: Subscription;
  booths: Booth[] = [];
  boothsCopy: Booth[] = [];
  boothControl = new FormControl('', Validators.required);
  filterControl = new FormControl('');
  selectedBooth: Booth;

  vendors: Vendor[] = [];


  number: number;
  isOpen: string;
  vendor: Vendor = {
    id: undefined,
    firstName: undefined,
    lastName: undefined,
    business: undefined,
    applicationSent: undefined,
    applicationRecieved: undefined,
    boothNumber: undefined
  };
  business: string;
  size: string;
  outlets: number;
  tables: number;


  constructor(private tableService: TableService) { }

  ngOnInit() {
    //get the booths
    this.tableService.getBoothList();
    this.boothsSub = this.tableService.getBoothUpdateListener()
      .subscribe((boothList: Booth[]) => {
        this.booths = boothList;
        this.boothsCopy = boothList;
      });

    //get the vendors, we do this here to lower the amount of database accesses overall
    this.tableService.getCustomerList();
    this.customerSub = this.tableService.getCustomerUpdateListener()
      .subscribe((vendorList: Vendor[]) => {
        this.vendors = vendorList;
      });
  }

  /* this method filters the booths based on if they're available or not */
  sortBooths() {
    if(this.filterControl.value === undefined) {
      this.booths = this.boothsCopy;
      return;
    }
    this.booths = this.boothsCopy.filter(booth => booth.isOpen === this.filterControl.value);
  }

  getColor(booth: Booth): string {
    if(booth.isOpen) {
      return 'green';
    }
    return 'red';
  }

  getVendorName() {
    if(!this.selectedBooth) {
      return null;
    }

    
  }

  setBooth(booth: Booth) {
    this.selectedBooth = booth;

    console.log(booth);
  }

  reserveBooth() {
    const firstName = this.name.trim().substring(0, this.name.findIndex(" "));
    const lastName = this.name.trim().substring(this.name.findIndex(" "));
    let vendor: Vendor = {
      id: null,
      firstname: firstName,
      lastName: lastName,
      business: this.business,
      applicationSent: false,
      applicationRecieved: false,
      boothNumber: selectedBooth.number
    };

    this.selectedBooth.vendor = this.tableService.addCustomer(vendor);

    this.tableService.editBooth(this.selectedBooth);
  }

  makeNewBooth() {
    const isReserved = this.isOpen.toUpperCase() === 'YES' ? false : true;

    this.tableService.addCustomer(newVendor);
    let booth: Booth = {
      id: null,
      number: +this.number,
      isOpen: isReserved,
      vendor: this.vendor,
      size: this.size,
      outlets: this.outlets,
      tables: this.tables
    };

    this.tableService.createBooth(booth);
  }

  deleteBooth() {
    this.tableService.deleteBooth(this.selectedBooth.id);
  }

  ngOnDestroy() {
    this.boothsSub.unsubscribe();
  }

}
