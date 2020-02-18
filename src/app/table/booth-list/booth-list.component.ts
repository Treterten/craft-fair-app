import { Component, OnInit } from '@angular/core';
import { TableService } from '../table.service';
import { Subscription } from 'rxjs';
import { Booth } from '../booth.model';
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


  constructor(private tableService: TableService) { }

  ngOnInit() {
    this.tableService.getBoothList();
    this.boothsSub = this.tableService.getBoothUpdateListener()
      .subscribe((boothList: Booth[]) => {
        this.booths = boothList;
        this.boothsCopy = boothList;
      });
  }

  isBoothOpen() {
    if(this.boothControl == undefined) {
      return '';
    }
    const open = this.boothControl.value.isOpen ? "open" : "closed";
    return open;
  }

  /* This method will filter out the booths based
  on if they're available or not */
  sortBooths() {
    if(this.filterControl.value === undefined) {
      this.booths = this.boothsCopy;
      return;
    }
    this.booths = this.boothsCopy.filter(booth => booth.isOpen === this.filterControl.value);
  }

  ngOnDestroy() {
    this.boothsSub.unsubscribe();
  }

}
