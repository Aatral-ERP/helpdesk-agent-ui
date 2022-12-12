import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { UtilService } from './util.service';
declare var $: any;

@Injectable({
  providedIn: 'root'
})
export class LoginService {

  constructor(private http: HttpClient, private util: UtilService) { }

  isLogin(): boolean {
    let login = false;
    if (localStorage.getItem('member_code')) {
      login = true;
    }
    return login;
  }

  getMemberCode(): String {
    let memberCode = "";
    if (localStorage.getItem('member_code')) {
      memberCode = localStorage.getItem('member_code');
    }
    return memberCode;
  }

  getUserRights(): String {
    let login_rights = "";
    if (localStorage.getItem('member_details')) {
      let member_details = JSON.parse(atob(localStorage.getItem('member_details')));
      login_rights = member_details['login_rights'];
    }
    return login_rights;
  }

  getMemberName(): String {
    let memberName = "";
    if (localStorage.getItem('member_details')) {
      let member_details = JSON.parse(atob(localStorage.getItem('member_details')));
      memberName = member_details['member_name'];
    }
    return memberName;
  }

  getMemberPhotoURL(): String {
    let url = "";
    if (localStorage.getItem('photo')) {
      let photo = localStorage.getItem('photo');
      if (photo !== undefined && photo !== null && photo != '') {
        $('#profilePhoto').attr('src', `data:image/png;base64,${photo}`);
        url = 'data:image/png;base64,' + photo;
      } else {
        url = 'assets/static/images/user-profile.png';
      }
    } else {
      url = 'assets/static/images/user-profile.png';
    }
    return url;
  }

  login(member_code, password) {
    let _password = btoa(password);
    let _member_code = btoa(member_code);
    let request = { "ChannelName": "WEB", "LoginReq": { "password": _password, "member_code": _member_code, enc: 'base64' } };
    return this.http.post(this.util.getBaseURL() + 'selfChickin/login', request);
  }

  loadProperties() {
    let request = { "ChannelName": "WEB" };
    return this.http.post(this.util.getBaseURL() + 'selfChickin/pingMyServer', request);
  }

  googleLogin(request) {
    return this.http.post(this.util.getBaseURL() + 'selfChickin/google-signin', request);
  }

  loadLibraryMessage() {
    return this.http.post(this.util.getBaseURL() + 'selfChickin/library-message', {});
  }

  changePassword(member_code, new_password, old_password) {
    let request = { "ChannelName": "WEB", "ChangePasswordReq": { "member_code": member_code, "new_password": new_password, "old_password": old_password } };
    return this.http.post(this.util.getBaseURL() + 'selfChickin/changePassword', request);
  }

  

}
