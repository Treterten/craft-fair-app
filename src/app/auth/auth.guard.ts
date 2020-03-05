import { Injectable } from '@angular/core';
import { CanActivate, ActivatedRouteSnapshot, RouterStateSnapshot, UrlTree, Router, CanLoad } from '@angular/router';
import { Observable, Subscription } from 'rxjs';

import { AuthService } from './auth.service';

@Injectable({
  providedIn: 'root'
})
export class AuthGuard implements CanActivate, CanLoad {
  constructor(private authService: AuthService, private router: Router) {}
  private loginSub: Subscription;
  private loggedIn: boolean;

  canActivate(
    next: ActivatedRouteSnapshot,
    state: RouterStateSnapshot): Observable<boolean | UrlTree> | Promise<boolean | UrlTree> | boolean | UrlTree {
    return this.checkLogin();
  }

  checkLogin(): boolean {

    this.loggedIn = this.authService.getCanActivate();

    if(this.loggedIn) { return true; }
    //else return to the login screen
    this.router.navigate(['/login']);
    return false;
  }

  canLoad(): boolean {
    return this.checkLogin();
  }



}
