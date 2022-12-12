import { Component, OnInit } from '@angular/core';
import { AuthService } from '../_services/auth.service';
import { environment } from 'src/environments/environment';
import { ChatService } from '../_services/chat.service';

@Component({
  selector: 'app-navbar',
  templateUrl: './navbar.component.html',
  styleUrls: ['./navbar.component.css']
})
export class NavbarComponent implements OnInit {
  logourl = environment.logourl;

  phoneNo = '';
  isLoggedIn(): boolean {
    return this.auth.isLoggedIn();
  }
  constructor(public auth: AuthService,private cs:ChatService) { }

  ngOnInit() {
    this.infoDetails();
  }

  logout() {
    localStorage.clear();
    window.location.href = "./";
  }

  infoDetails()
  {
    this.cs.getInfoDetails(1).subscribe(res => {
      console.log(res);

     this.phoneNo = res['infoDetails']['cmpPhone'];
    });
  }

}
