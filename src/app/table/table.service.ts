import { Injectable } from '@angular/core';
import { Customer } from './customer.model';
import { Booth } from './booth.model';
import { HttpClient } from '@angular/common/http';
import { Subject } from 'rxjs';
import { map } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class TableService {
  private customers: Customer[] = [];
  private customersUpdated = new Subject<Customer[]>();

  private booths: Booth[] = [];
  private boothsUpdated = new Subject<Booth[]>();

  constructor(private http: HttpClient) { }

  getCustomerList() {
    this.http.get<{message: string, customers: any}>('https://localhost:443/api/customer-list')
      .pipe(map((customerData) => {
        return customerData.customers.map(customer => {
          return {
            name: customer.name,
            address: customer.address,
            id: customer._id
          };
        });
      }))
      .subscribe((transformedCustomers) => {
        this.customers = transformedCustomers;
        this.customersUpdated.next([...this.customers]);
      });
  }

  getBoothList() {
    this.http.get<{message: string, booths: any}>('https://localhost:443/api/booths')
      .pipe(map((boothData) => {
        return boothData.booths.map(booth => {
          return {
            number: booth.number,
            isOpen: booth.isOpen,
            vendor: booth.vendor,
            business: booth.business,
            size: booth.size,
            outlets: booth.outlets,
            tables: booth.tables
          };
        });
      }))
      .subscribe((transformedBooths) => {
        this.booths = transformedBooths;
        this.boothsUpdated.next([...this.booths]);
      })
  }

  getCustomerUpdateListener() {
    return this.customersUpdated.asObservable();
  }

  getBoothUpdateListener() {
    return this.boothsUpdated.asObservable();
  }
}
