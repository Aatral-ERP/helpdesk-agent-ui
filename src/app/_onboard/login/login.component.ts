import { Component, OnInit, AfterViewInit } from '@angular/core';
import { AuthService } from 'src/app/_services/auth.service';
declare var $: any;
declare const gapi: any;

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent implements OnInit, AfterViewInit {

  constructor(private auth: AuthService) { }
  userName = "";
  password = "";
  submitted = false;
  google_submitted = false;
  ngOnInit(): void {
    if (this.auth.isLoggedIn()) {
      window.location.href = "./";
    }
  }

  login() {
    this.submitted = true;
    console.log({ username: this.userName, password: this.password })
    this.auth.login({ username: this.userName, password: this.password }).subscribe(res => {
      console.log(res); this.submitted = false;
    }, error => { this.submitted = false; });
  }



  // Google SignIn Process

  public auth2: any;
  public googleInit() {
    gapi.load('auth2', () => {
      this.auth2 = gapi.auth2.init({
        client_id: '493032653944-srabrghsrghll86tlpbjhuadj4lrtvu7.apps.googleusercontent.com',
        cookiepolicy: 'single_host_origin',
        scope: 'profile email'
      });
      this.attachSignin(document.getElementById('googleBtn'));
    });
  }

  public attachSignin(element) {
    this.auth2.attachClickHandler(element, {},
      (googleUser) => {
        let profile = googleUser.getBasicProfile();
        console.log('Token || ' + googleUser.getAuthResponse().id_token);
        console.log('ID: ' + profile.getId());
        console.log('Name: ' + profile.getName());
        console.log('Image URL: ' + profile.getImageUrl());
        console.log('Email: ' + profile.getEmail());

        let request = {
          googleEmailId: profile.getEmail(),
          userName: profile.getName(),
          googleId: profile.getId(),
          googleToken: googleUser.getAuthResponse().id_token
        }

        this.signInWithGoogle(request);

      }, (error) => {
        console.log(JSON.stringify(error, undefined, 2));
      });
  }

  signInWithGoogle(request) {
    console.log(request);

    this.google_submitted = true;
    this.auth.googleLogin(request).subscribe(res => {
      console.log(res); this.google_submitted = false;
    }, error => { this.google_submitted = false; console.log(error) });
  }

  ngAfterViewInit() {
    this.googleInit();
  }


}
