import { NgModule }              from '@angular/core';
import { RouterModule, Routes }  from '@angular/router';
import { AuthGuard } from './auth/auth.guard';



import { LoginComponent } from './login/login.component';
import { CustomerTableComponent } from './table/customer-table/customer-table.component';
import { PageNotFoundComponent } from './page-not-found/page-not-found.component';
import { BoothListComponent } from './table/booth-list/booth-list.component';

const appRoutes: Routes = [
  { path: 'login', component: LoginComponent },
  { path: 'customer-list', component: CustomerTableComponent, canActivate: [AuthGuard] },
  { path: 'booths', component: BoothListComponent, canActivate: [AuthGuard] },
  { path: '',
    redirectTo: '/login',
    pathMatch: 'full'
  },
  { path: '**', component: PageNotFoundComponent }
];

@NgModule({
  imports: [
    RouterModule.forRoot(
      appRoutes,
      { enableTracing: true } // <-- debugging purposes only
    )
  ],
  exports: [
    RouterModule
  ]
})
export class AppRoutingModule { }
