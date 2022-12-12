import { Component, OnInit } from '@angular/core';
import { AuthService } from '../../_services/auth.service';
import { environment } from 'src/environments/environment';

@Component({
  selector: 'app-navbar',
  templateUrl: './navbar.component.html',
  styleUrls: ['./navbar.component.css']
})
export class NavbarComponent implements OnInit {
  isLoggedIn: boolean = this.auth.isLoggedIn();
  loginAgentType: number = 2;
  logourl = environment.logourl;

  constructor(public auth: AuthService) { }

  ngOnInit() {
    if (this.isLoggedIn)
      this.loginAgentType = this.auth.getLoginAgentType()
  }

  logout() {
    localStorage.clear();
    window.location.href = "./";
  }

}
