import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { CanLoad } from '@angular/router';

import { Observable, Subject } from 'rxjs';
import { tap, delay } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private isLoggedIn = false;
  private loggedInUpdated = new Subject<boolean>(); //TODO make this what the other classes use for privacy

  redirectUrl: string; // <- this is probably not needed in our app, just kinda here cause what if I guess

  login(username: string, password: string) {
      this.http.post<{message: string}>('https://localhost:443/api/login', { username, password })
        .subscribe((responseData) => {
          this.isLoggedIn = true;
          this.loggedInUpdated.next(true);
          console.log("success");
        }, (err) => {
          this.isLoggedIn = false;
          this.loggedInUpdated.next(false);
          console.error(err);
        });
  }

  getLoginUpdateListener() {
    return this.loggedInUpdated.asObservable();
  }

  getCanActivate() {
    return this.isLoggedIn;
  }

  logOut(): void {
    this.isLoggedIn = false;
    this.loggedInUpdated.next(false);
    console.log('logged out');
  }

  constructor( private http: HttpClient ) { }
}
