import { Injectable } from '@angular/core';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root'
})
export class UtilService {
  public InstitutionName = '';
  public InstitutionLogo = '';
  public ContentPath = '';
  public RemoteAccessURL = '';
  public StrictLogin = false;

  constructor() {
  };

  getBaseURL(): String {
    return environment.apiUrl;
  }

  getHeader(): any {

    let headers = new Headers();

    headers.append('Content-Type', 'application/json');
    headers.append('Accept', 'application/json');

    headers.append('Access-Control-Allow-Origin', '*');
    headers.append('Access-Control-Allow-Credentials', 'true');


    return headers;
  };

  validateEmail(emailId): boolean {
    if (emailId != null && emailId != undefined && emailId.length > 0) {
      let regex = /^((?!\.)[\w-_.]*[^.])(@\w+)(\.\w+(\.\w+)?[^.\W])$/;
      return regex.test(String(emailId).toLowerCase());
    } else {
      return false;
    }
  }

  validatePhoneNumber(phone): boolean {
    if (phone != null && phone != undefined && phone.length > 0) {
      let regex = /^[\+]?[(]?[0-9]{3}[)]?[-\s\.]?[0-9]{3}[-\s\.]?[0-9]{4,6}$/;
      return regex.test(String(phone));
    } else {
      return false;
    }
  }

  validateWebsiteURL(str): boolean {
    var pattern = new RegExp('^(https?:\\/\\/)?' + // protocol
      '((([a-z\\d]([a-z\\d-]*[a-z\\d])*)\\.)+[a-z]{2,}|' + // domain name
      '((\\d{1,3}\\.){3}\\d{1,3}))' + // OR ip (v4) address
      '(\\:\\d+)?(\\/[-a-z\\d%_.~+]*)*' + // port and path
      '(\\?[;&a-z\\d%_.~+=-]*)?' + // query string
      '(\\#[-a-z\\d_]*)?$', 'i'); // fragment locator
    return !!pattern.test(str);
  }

}
