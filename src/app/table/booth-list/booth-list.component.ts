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
  booths: Booth[] = [];
  boothsCopy: Booth[] = [];
  boothControl = new FormControl('', Validators.required);
  filterControl = new FormControl('');
  selectedBooth: Booth;

  number: number;
  isOpen: string;
  vendor: Vendor = {
    firstName: undefined,
    lastName: undefined,
    address: undefined,
    business: undefined,
    applicationSent: undefined,
    applicationRecieved: undefined
  };
  business: string;
  size: string;
  outlets: number;
  tables: number;


  constructor(private tableService: TableService) { }

  ngOnInit() {
    this.tableService.getBoothList();
    this.boothsSub = this.tableService.getBoothUpdateListener()
      .subscribe((boothList: Booth[]) => {
        this.booths = boothList;
        this.boothsCopy = boothList;
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

  setBooth(booth: Booth) {
    this.selectedBooth = booth;
    console.log(booth);
  }

  makeNewBooth() {
    const isReserved = this.isOpen.toUpperCase() === 'YES' ? false : true;
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
