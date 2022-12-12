import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, BehaviorSubject } from 'rxjs';
import { tap, mapTo } from 'rxjs/operators';
import { ActivatedRoute, Router } from '@angular/router';
import * as jwt_decode from 'jwt-decode';
import { environment } from 'src/environments/environment';
import { MatSnackBar } from '@angular/material/snack-bar';
import { RoleMaster } from '../_admin/role-create/RoleMaster';
import { Agent } from '../_profile/agent-profile/Agent';

@Injectable({
  providedIn: 'root'
})
export class AuthService {

  private readonly JWT_TOKEN = 'token';
  private readonly REFRESH_TOKEN = 'refreshtoken';
  private readonly PHOTO = '_pasB64';
  private readonly PHOTO_FILE_NAME = '_pasB64FN';
  private loggedUser: string;

  private agentDetails$: BehaviorSubject<any> = new BehaviorSubject(this.getAgentDetails());

  constructor(private router: Router, private http: HttpClient, private snackbar: MatSnackBar, private actRoute: ActivatedRoute) {
    this.checkUserLoggedIn();
  }

  checkUserLoggedIn() {
    if (localStorage.getItem('token')) {
      const token = localStorage.getItem('token');
      var decoded = jwt_decode(token);
      if (new Date(decoded['exp']) > new Date()) {
        // let continue_url = window.location.href;
        // this.router.navigate(['/login'], { queryParams: { continue_url: continue_url } });
        this.router.navigate(['/login']);
      }
    }
  }

  diff_minutes(dt2, dt1) {
    var diff = (dt2.getTime() - dt1.getTime()) / 1000;
    diff /= 60;
    return Math.abs(Math.round(diff));
  }

  login(user: { username: string, password: string }): Observable<boolean> {
    console.log(user)
    return this.http.post<any>(environment.apiUrl + 'authenticate/generate-token-agent', user)
      .pipe(
        tap(tokens => {
          if (tokens.message == 'success')
            this.doLoginUser(user.username, tokens);
          else
            this.snackbar.open(tokens.message);
        }),
        mapTo(true));
  }

  googleLogin(request): Observable<boolean> {
    return this.http.post<any>(environment.apiUrl + 'authenticate/generate-token-agent-google', request)
      .pipe(
        tap(tokens => {
          console.log(tokens);
          if (tokens.message == 'success') {
            this.doLoginUser(request.googleEmailId, tokens);
          }
          else {
            let message = tokens.message;
            this.snackbar.open(message);
          }
        }),
        mapTo(true));
  }

  logout() {
    // return this.http.post<any>(this.url+`${config.apiUrl}/logout`, {
    //   'refreshToken': this.getRefreshToken()
    // }).pipe(
    //   tap(() => this.doLogoutUser()),
    //   mapTo(true),
    //   catchError(error => {
    //     alert(error.error);
    //     return of(false);
    //   }));
  }

  isLoggedIn() {
    return !!this.getJwtToken();
  }

  refreshToken() {
    return this.http.post<any>(environment.apiUrl + 'authenticate/refresh-token-agent', {
      'refreshtoken': this.getRefreshToken()
    }).pipe(tap((tokens: any) => {
      this.storeJwtToken(tokens.token);
    }));
  }

  getJwtToken() {
    return localStorage.getItem(this.JWT_TOKEN);
  }

  private doLoginUser(username: string, tokens: any) {
    this.loggedUser = username;
    this.storeTokens(tokens);
    let role = this.getLoggedInRole();
    console.log(window.location.origin);

    if (role.defaultDashboard == 'Home') {
      window.location.href = './';
    } else if (role.defaultDashboard == 'Sales Dashboard') {
      window.location.href = './sales';
    } else if (role.defaultDashboard == 'Teams Dashboard') {
      window.location.href = './teams/boards';
    } else if (role.defaultDashboard == 'Hr Dashboard') {
      window.location.href = './hr';
    } else {
      window.location.href = "./";
    }

    // this.actRoute.queryParams.subscribe(params => {
    //   if (params['continue_url']) {
    //     let continue_url: string = params['continue_url'];
    //     continue_url = continue_url.replace(/"/g, "");
    //     console.log(window.location.origin + '/', continue_url);
    //     alert(window.location.origin + '/' != continue_url);
    //     if (window.location.origin + '/' != continue_url) {
    //       console.log("Inside iifff");
    //       window.location.href = params['continue_url'];
    //     }
    //   }
    //   if (role.defaultDashboard == 'Home') {
    //     window.location.href = './';
    //   } else if (role.defaultDashboard == 'Sales Dashboard') {
    //     window.location.href = './sales';
    //   } else if (role.defaultDashboard == 'Hr Dashboard') {
    //     window.location.href = './hr';
    //   }
    // })

  }

  private doLogoutUser() {
    this.loggedUser = null;
    this.removeTokens();
  }

  private getRefreshToken() {
    return localStorage.getItem(this.REFRESH_TOKEN);
  }

  private storeJwtToken(jwt: string) {
    localStorage.setItem(this.JWT_TOKEN, jwt);
  }

  private storeTokens(tokens: any) {
    localStorage.setItem(this.JWT_TOKEN, tokens.token);
    localStorage.setItem(this.REFRESH_TOKEN, tokens.refreshtoken);

    if (tokens.photo) {
      if (tokens.photo != null)
        localStorage.setItem(this.PHOTO, tokens.photo);
    }
  }

  private removeTokens() {
    localStorage.removeItem(this.JWT_TOKEN);
    localStorage.removeItem(this.REFRESH_TOKEN);
  }

  public getAuthPayload() {

    if (localStorage.getItem(this.JWT_TOKEN)) {
      const token = localStorage.getItem(this.JWT_TOKEN);
      var decoded = jwt_decode(token);
    } else {
      window.location.href = '/login';
    }
  }

  public getLoginAgentFullName() {
    let fullName = '';

    const agentDetails = this.getAgentDetails();
    if (agentDetails != null) {
      if (agentDetails.firstName && agentDetails.lastName) {
        fullName = agentDetails.firstName + ' ' + agentDetails.lastName;
      }
    }
    return fullName;
  }

  public getLoginAgentDesignation() {
    let desig = '';

    const agentDetails = this.getAgentDetails();
    if (agentDetails != null) {
      if (agentDetails.designation) {
        desig = agentDetails.designation;
      }
    }
    return desig;
  }

  getLoggedInRole(): RoleMaster {
    const token = localStorage.getItem(this.JWT_TOKEN);
    if (localStorage.getItem(this.JWT_TOKEN)) {
      var decoded = jwt_decode(token);
      console.log(decoded['Role']);
      return decoded['Role'];
    } else {
      return new RoleMaster();
    }
  }

  public getLoginEmailId() {
    const token = localStorage.getItem(this.JWT_TOKEN);
    var decoded = jwt_decode(token);
    return decoded['sub'];
  }

  public getLoginAgentType(): number {
    let agentDetails = this.getAgentDetails();
    try {
      if (agentDetails != null)
        return agentDetails['agentType'];
      else
        return 99;
    } catch (err) {
      return 99;
    }

  }

  public getInstituteDetails() {
    if (localStorage.getItem(this.JWT_TOKEN)) {
      const token = localStorage.getItem(this.JWT_TOKEN);
      var decoded = jwt_decode(token);
      var InstituteDetails = decoded['InstituteDetails'];
      console.log(InstituteDetails);
      return InstituteDetails;
    } else {
      return null;
    }
  }

  public getAgentMinDetails() {
    if (localStorage.getItem(this.JWT_TOKEN)) {
      const token = localStorage.getItem(this.JWT_TOKEN);
      var decoded = jwt_decode(token);
      var _agent: Agent = decoded['AgentDetails'];

      return { emailId: _agent.emailId, employeeId: _agent.employeeId, firstName: _agent.firstName, lastName: _agent.lastName };
    } else {
      return null;
    }
  }

  public getAgentDetails() {
    if (localStorage.getItem(this.JWT_TOKEN)) {
      const token = localStorage.getItem(this.JWT_TOKEN);
      var decoded = jwt_decode(token);
      var AgentDetails = decoded['AgentDetails'];
      AgentDetails.photo = null;
      if (localStorage.getItem(this.PHOTO_FILE_NAME))
        AgentDetails.photoFileName = localStorage.getItem(this.PHOTO_FILE_NAME);

      // if (localStorage.getItem(this.PHOTO)) {
      //   const photo = localStorage.getItem(this.PHOTO);
      //   AgentDetails.photo = photo;
      // }
      return AgentDetails;
    } else {
      return null;
    }
  }

  getAgentPhoto() {
    if (localStorage.getItem(this.PHOTO)) {
      const photo = localStorage.getItem(this.PHOTO);
      return photo;
    }
    return null;
  }

  // public updatePhotoLocal(photo) {
  //   localStorage.setItem(this.PHOTO, photo);
  //   this.agentDetails$.next(this.getAgentDetails());
  // }

  public updatePhotoLocal(photo, photoFileName) {
    localStorage.setItem(this.PHOTO, photo);
    localStorage.setItem(this.PHOTO_FILE_NAME, photoFileName);
    this.agentDetails$.next(this.getAgentDetails());
  }

  getAgentDetailsObs(): Observable<any> {
    return this.agentDetails$.asObservable();
  }

  validateEmail(email): boolean {
    const re = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
    return re.test(String(email).toLowerCase());
  }

  validatePhoneNumber(phone): boolean {
    let regex = /^(\+\d{1,2}\s)?\(?\d{3}\)?[\s.-]?\d{3}[\s.-]?\d{4}$/;
    return regex.test(String(phone));
  }
}