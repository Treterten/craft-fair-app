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


  private booths: Booth[] = [];
  private boothsUpdated = new Subject<Booth[]>();

  private vendors: Vendor[] = [];
  private vendorsUpdated = new Subject<Vendor[]>();

  constructor(private http: HttpClient) { }

  getVendorList() {
    this.http.get<{message: string, vendors: any}>('https://localhost:443/api/customer-list')
      .pipe(map((vendorData) => {
        return vendorData.vendors.map(customer => {
          return {
            firstName: customer.firstName,
            lastName: customer.lastName,
            business: customer.business,
            applicationSent: customer.applicationSent,
            applicationRecieved: customer.applicationRecieved,
            boothNumber: customer.boothNumber,
            id: customer._id
          };
        });
      }))
      .subscribe((transformedVendors) => {
        this.vendors = transformedVendors;
        this.vendorsUpdated.next([...this.vendors]);
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

  addVendor(vendor: Vendor) {
    this.http.post<{message: string, id: string}>('https://localhost:443/api/customer-list', vendor)
      .subscribe(responseData => {
        vendor.id = responseData.id;
        this.vendors.push(vendor);
        this.vendorsUpdated.next([...this.vendors]);
      });
    return vendor.id;
  }

  deleteVendor(id: string) {
    this.http.delete('https://localhost:443/api/customer-list/' + id)
      .subscribe(successMessage => {
        this.vendors = this.vendors.filter(vendor => vendor.id !== id); //filter out the deleted message
        this.vendorsUpdated.next([...this.vendors]); //push the new collection of customers to the front end
      });
  }

  editVendor(vendor: Vendor) {
    vendor.firstName = vendor.firstName.trim();
    vendor.lastName = vendor.lastName.trim();
    if(vendor.firstName === '' || vendor.lastName === '') {
      return;
    }

    console.log(vendor);
    //send the update request to the database
    this.http.patch('https://localhost:443/api/customer-list/' + vendor.id, { vendor })
      .subscribe(result => {
        console.log(result);
        const index = this.vendors.findIndex(element => element.id === vendor.id);
        this.vendors[index] = vendor;
        this.vendorsUpdated.next([...this.vendors]);
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

  editBooth(booth: Booth) {
    this.http.patch('https://localhost:443/api/booths/' + booth.id, { booth })
      .subscribe(result => {
        console.log(result);
        const index = this.vendors.findIndex(element => element.id === booth.id);
        this.booths[index] = booth;
        this.boothsUpdated.next([...this.booths]);
      })
  }

  getVendorsUpdateListener() {
    return this.vendorsUpdated.asObservable();
  }

  getBoothUpdateListener() {
    return this.boothsUpdated.asObservable();
  }
}
