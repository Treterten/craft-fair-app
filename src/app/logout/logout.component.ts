import { Component, OnInit } from '@angular/core';
import { AuthService } from '../auth/auth.service';
import { RouterModule, Router } from '@angular/router';

@Component({
  selector: 'app-logout',
  templateUrl: './logout.component.html',
  styleUrls: ['./logout.component.css']
})
export class LogoutComponent implements OnInit {

  constructor(private authService: AuthService, private router: Router) { }

  ngOnInit() {}

  onLogout() {
    this.authService.logOut();
    this.router.navigate(['/login']);
  }

}
