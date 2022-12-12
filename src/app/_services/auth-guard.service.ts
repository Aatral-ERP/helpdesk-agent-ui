import { Injectable } from '@angular/core';
import { AuthService } from './auth.service';
import { Router, CanActivate } from '@angular/router';
import { Location } from '@angular/common';

@Injectable({
  providedIn: 'root'
})
export class AuthGuardService implements CanActivate {

  constructor(private auth: AuthService, public router: Router, private location: Location) { }

  canActivate(): boolean {
    if (!this.auth.isLoggedIn()) {
      let continue_url = window.location.href;
      this.router.navigate(['/login'], { queryParams: { continue_url: continue_url } });
      return false;
    }
    return true;
  }

}
