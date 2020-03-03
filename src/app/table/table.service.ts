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

  addCustomer(customer: Customer) {
    this.http.post<{message: string, id: string}>('https://localhost:443/api/customer-list', customer)
      .subscribe(responseData => {
        customer.id = responseData.id;
        this.customers.push(customer);
        this.customersUpdated.next([...this.customers]);
      });

  }

  deleteCustomer(id: string) {
    this.http.delete('https://localhost:443/api/customer-list/' + id)
      .subscribe(successMessage => {
        this.customers = this.customers.filter(customer => customer.id !== id); //filter out the deleted message
        this.customersUpdated.next([...this.customers]); //push the new collection of customers to the front end
      });
  }

  editCustomer(customer: Customer) {
    customer.name = customer.name.trim();
    customer.address = customer.address.trim();
    if(customer.name === '' || customer.address === '') {
      return;
    }

    console.log(customer);
    //send the update request to the database
    this.http.patch('https://localhost:443/api/customer-list/' + customer.id, { customer })
      .subscribe(result => {
        console.log(result);
        const index = this.customers.findIndex(element => element.id === customer.id);
        this.customers[index] = customer;
        this.customersUpdated.next([...this.customers]);
      });
  }

  getCustomerUpdateListener() {
    return this.customersUpdated.asObservable();
  }

  getBoothUpdateListener() {
    return this.boothsUpdated.asObservable();
  }
}
