import { Injectable } from '@angular/core';
import { Customer } from './customer.model';
import { Booth } from './booth.model';
import { Vendor } from './vendor.model';
import { HttpClient } from '@angular/common/http';
import { Subject } from 'rxjs';
import { map } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class TableService {
  private customers: Customer[] = [];


  private booths: Booth[] = [];
  private boothsUpdated = new Subject<Booth[]>();

  private vendors: Vendor[] = [];
  private customersUpdated = new Subject<Vendor[]>();

  constructor(private http: HttpClient) { }

  getCustomerList() {
    this.http.get<{message: string, customers: any}>('https://localhost:443/api/customer-list')
      .pipe(map((customerData) => {
        return customerData.customers.map(customer => {
          return {
            firstName: customer.firstName,
            lastName: customer.lastName,
            address: customer.address,
            business: customer.business,
            applicationSent: customer.applicationSent,
            applicationRecieved: customer.applicationRecieved,
            boothNumber: customer.boothNumber,
            id: customer._id
          };
        });
      }))
      .subscribe((transformedCustomers) => {
        this.vendors = transformedCustomers;
        this.customersUpdated.next([...this.vendors]);
      });
  }

  getBoothList() {
    this.http.get<{message: string, booths: any}>('https://localhost:443/api/booths')
      .pipe(map((boothData) => {
        return boothData.booths.map(booth => {
          return {
            id: booth._id,
            number: booth.number,
            isOpen: booth.isOpen,
            vendor: booth.vendor,
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

  addCustomer(vendor: Vendor) {
    this.http.post<{message: string, id: string}>('https://localhost:443/api/customer-list', vendor)
      .subscribe(responseData => {
        vendor.id = responseData.id;
        this.vendors.push(vendor);
        this.customersUpdated.next([...this.vendors]);
      });

  }

  deleteCustomer(id: string) {
    this.http.delete('https://localhost:443/api/customer-list/' + id)
      .subscribe(successMessage => {
        this.vendors = this.vendors.filter(vendor => vendor.id !== id); //filter out the deleted message
        this.customersUpdated.next([...this.vendors]); //push the new collection of customers to the front end
      });
  }

  editCustomer(vendor: Vendor) {
    vendor.firstName = vendor.firstName.trim();
    vendor.lastName = vendor.lastName.trim();
    vendor.address = vendor.address.trim();
    if(vendor.firstName === '' || vendor.address === '' || vendor.lastName === '') {
      return;
    }

    console.log(vendor);
    //send the update request to the database
    this.http.patch('https://localhost:443/api/customer-list/' + vendor.id, { vendor })
      .subscribe(result => {
        console.log(result);
        const index = this.vendors.findIndex(element => element.id === vendor.id);
        this.vendors[index] = vendor;
        this.customersUpdated.next([...this.vendors]);
      });
  }

  createBooth(booth: Booth) {
    this.http.post<{message: string, boothId: string}>('https://localhost:443/api/booths', { booth })
      .subscribe(result => {
        booth.id = result.boothId;
        this.booths.push(booth);
        this.boothsUpdated.next([...this.booths]);
      });
  }

  deleteBooth(id: string) {
    this.http.delete('https://localhost:443/api/booths/' + id)
      .subscribe(result => {
        console.log(result);
        this.booths = this.booths.filter(booth => booth.id !== id);
        this.boothsUpdated.next([...this.booths]);
      }, err => {
        console.error(err);
      });
  }

  getCustomerUpdateListener() {
    return this.customersUpdated.asObservable();
  }

  getBoothUpdateListener() {
    return this.boothsUpdated.asObservable();
  }
}
