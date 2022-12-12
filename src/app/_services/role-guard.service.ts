import { Injectable } from '@angular/core';
import { AuthService } from './auth.service';
import { Router, RouterStateSnapshot, ActivatedRouteSnapshot, ActivatedRoute } from '@angular/router';
import { RoleMaster } from '../_admin/role-create/RoleMaster';
import { state } from '@angular/animations';
import { MatSnackBar } from '@angular/material/snack-bar';

@Injectable({
  providedIn: 'root'
})
export class RoleGuardService {

  constructor(private auth: AuthService, private router: Router, private snackbar: MatSnackBar) { }

  private role: RoleMaster = this.auth.getLoggedInRole();

  canActivate(route: ActivatedRouteSnapshot,
    state: RouterStateSnapshot): boolean {
    let path = state.url;
    if (path.startsWith('/product') && this.role.product != 'Full Access') {
      this.router.navigate(['/']);
      this.snackbar.open('You have No Privileges to view this page');
      return false;
    } else if (path.startsWith('/institute') && this.role.institute != 'Full Access') {
      this.router.navigate(['/']);
      this.snackbar.open('You have No Privileges to view this page');
      return false;
    } else if (path.startsWith('/vendor') && this.role.supplier != 'Full Access') {
      this.router.navigate(['/']);
      this.snackbar.open('You have No Privileges to view this page');
      return false;
    } else if (path.startsWith('/sales') && this.role.sales != 'Full Access') {
      this.router.navigate(['/']);
      this.snackbar.open('You have No Privileges to view this page');
      return false;
    } else if (path.startsWith('/purchase-inputs') && this.role.purchaseInput != 'Full Access') {
      this.router.navigate(['/']);
      this.snackbar.open('You have No Privileges to view this page');
      return false;
    } else if (path.startsWith('/accounting') && this.role.accounting != 'Full Access') {
      this.router.navigate(['/']);
      this.snackbar.open('You have No Privileges to view this page');
      return false;
    } else if (path.startsWith('/hr') && this.role.hr != 'Full Access') {
      this.router.navigate(['/']);
      this.snackbar.open('You have No Privileges to view this page');
      return false;
    } else if (path.startsWith('/admin') && this.role.admin != 'Full Access') {
      this.router.navigate(['/']);
      this.snackbar.open('You have No Privileges to view this page');
      return false;
    } else if (path.startsWith('/reports') && this.role.reports != 'Full Access') {
      this.router.navigate(['/']);
      this.snackbar.open('You have No Privileges to view this page');
      return false;
    } else if (path.startsWith('/add-ticket') && !this.role.ticketsAdmin) {
      this.router.navigate(['/']);
      this.snackbar.open('You have No Privileges to view this page');
      return false;
    } else if (path.startsWith('/gmail-tickets') && !this.role.ticketsAdmin) {
      this.router.navigate(['/']);
      this.snackbar.open('You have No Privileges to view this page');
      return false;
    }



    return true;
  }

}
