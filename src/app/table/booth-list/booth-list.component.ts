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
  boothControl = new FormControl('', Validators.required);


  constructor(private tableService: TableService) { }

  ngOnInit() {
    this.tableService.getBoothList();
    this.boothsSub = this.tableService.getBoothUpdateListener()
      .subscribe((boothList: Booth[]) => {
        this.booths = boothList;
      });
  }

  isBoothOpen() {
    if(this.boothControl == undefined) {
      return '';
    }
    const open = this.boothControl.value.isOpen ? "open" : "closed";
    return open;
  }

  ngOnDestroy() {
    this.boothsSub.unsubscribe();
  }

}
