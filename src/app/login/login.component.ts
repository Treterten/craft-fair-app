import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from '../auth/auth.service';
import { Subscription } from 'rxjs';
//TODO: make this into a form


@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})

export class LoginComponent {
  password: string = '';
  username: string = '';
  private loginUpdateListener: Subscription;
  // private pw: string = 'Heck';

  constructor(
    private authService: AuthService,
    private router: Router
  ) {}

  onLogin() {
    console.log("Logging in");
    this.authService.login(this.username, this.password);
    this.loginUpdateListener = this.authService.getLoginUpdateListener()
      .subscribe((loggedIn) => {
        if(loggedIn) {
          this.router.navigate(['/customer-list']);
        }
      });
  }

  onLogout() {
    this.authService.logOut();

  }
}
