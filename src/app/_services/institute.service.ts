import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { environment } from '../../environments/environment';
import { AuthService } from './auth.service';

@Injectable({
  providedIn: 'root'
})
export class InstituteService {

  constructor(private http: HttpClient, private auth: AuthService) { }

  getInstituteDetails(instituteDetails) {
    return this.http.post(environment.apiUrl + 'institute/get-institute-details',
      { instituteId: instituteDetails['instituteId'] });
  }

  getEditDetails(institute) {
    return this.http.post(environment.apiUrl + '/institute/edit-institute', institute);
  }

  deletesContact(id, instituteId, emailId) {

    const httpHeaders: HttpHeaders = new HttpHeaders();
    httpHeaders.append('Authorization', "Bearer " + localStorage.getItem('token'))
    let request = { "id": id, "instituteId": instituteId, "emailId": emailId };
    return this.http.post(environment.apiUrl + 'institute/delete-institute-contact',
      request, { headers: httpHeaders });
  }

  getContact(id, instituteId, emailId) {
    const httpHeaders: HttpHeaders = new HttpHeaders();
    httpHeaders.append('Authorization', "Bearer " + localStorage.getItem('token'))
    let request = { "instituteId": instituteId };
    return this.http.post(environment.apiUrl + 'institute/get-institute',
      request, { headers: httpHeaders });
  }

  getSaveContact(firstname = "", lastname = "", emailid = "", mobileno = "", address1 = "", address2 = "", city = "", state = "", country = "", pincode = "") {
    let request = {
      ChannelName: "WEB", firstname: firstname, lastname: lastname, emailid: emailid, mobileno: mobileno, address1: address1, address2: address2, city: city, state: state, country: country, pincode: pincode
    }
    console.log(request);
    return this.http.post(environment.apiUrl + 'institute/save-institute-contact', request);
  }

  changePassword(old_password, new_password) {
    let request = { "ChangePasswordReq": { "username": this.auth.getLoginEmailId(), "new_password": new_password, "old_password": old_password } };
    return this.http.post(environment.apiUrl + 'institute/changePassword', request);
  }

  forgetPassword(username) {
    let request = { "SendOTPReq": { "username": username } };
    return this.http.post(environment.apiUrl + 'institute/forgetPassword', request);
  }

  verifyOTP(username, otp) {
    let request = { "CheckOTPReq": { "username": username, "otp": otp } };
    return this.http.post(environment.apiUrl + 'institute/checkOTP', request);
  }

  updatePassword(username, new_password) {
    let request = { "ResetPasswordReq": { "username": username, "new_password": new_password } };
    return this.http.post(environment.apiUrl + 'institute/resetPassword', request);
  }

  saveContact(contact) {
    return this.http.post(environment.apiUrl + 'institute/save-institute-contact', contact);
  }

  sendDetails(contact) {
    return this.http.post(environment.apiUrl + 'institute/send-login-details', contact);
  }

  getAllInstituteContacts(instituteDetails) {
    return this.http.post(environment.apiUrl + 'institute/get-institute-contacts', instituteDetails);
  }

  deleteContact(id, emailId) {
    let instituteDetails = this.auth.getInstituteDetails();
    let request = { "id": id, "instituteId": instituteDetails['instituteId'], "emailId": emailId };
    return this.http.post(environment.apiUrl + 'institute/delete-institute-contact',
      request);
  }

  getAmcReport(selectedinstitute, product, paymode, validFromDate, validToDate, paidFromDate, paidToDate) {
    let request = {
      SearchAmcReport: {
        "selectedinstitute": selectedinstitute, "product": product, "paymode": paymode, "validFromDate": validFromDate,
        "validToDate": validToDate, "paidFromDate": paidFromDate, "paidToDate": paidToDate
      }
    };
    return this.http.post(environment.apiUrl + 'institute/amc-report', request);
  }

  getInstituteProducts(instituteId) {
    console.log(instituteId);
    let request = { institute: { "instituteId": instituteId } };
    return this.http.post(environment.apiUrl + 'institute/get-institute-products',
      request);
  }

  addInstProduct(selectedinstitute, amcAmount, current_service_under, product, amcExpiryDate, quantity) {
    let request = {
      "institute": { 'instituteId': selectedinstitute },
      "amcAmount": amcAmount, "currentServiceUnder": current_service_under,
      "product": product, amcExpiryDate: amcExpiryDate, quantity: quantity

    };
    return this.http.post(environment.apiUrl + 'institute/save-institute-products', request);
  }

  removeInstProduct(instproduct) {
    return this.http.post(environment.apiUrl + 'institute/remove-institute-products', instproduct);
  }

  loadAmcDetails(filters) {
    let req = filters;
    return this.http.post(environment.apiUrl + 'institute/load-amc-details', req);
  }


  getAmcDetails(aid) {
    {
      console.log(aid);
      return this.http.get(environment.apiUrl + 'institute/get-amc-details-edit/' + aid);
    }
  }

  saveAmcDetail(ad) {
    return this.http.post(environment.apiUrl + 'institute/save-amc-details', ad);
  }

  loadAMCReminders(req) {
    return this.http.post(environment.apiUrl + 'institute/get-institute-amc-reminder-sent-report', req);
  }

  getInstitutePreDeleteData(req) {
    return this.http.post(environment.apiUrl + 'institute/get-institute-pre-delete-data', req);
  }

  deleteInstitute(req) {
    return this.http.post(environment.apiUrl + 'institute/delete-institute', req);
  }

  getInstContact(filters) {
    let request = filters;
    return this.http.post(environment.apiUrl + 'institute/get-institute-contact', request)
  }

  instituteReport(filters) {
    let request = filters;
    return this.http.post(environment.apiUrl + 'institute/institute-report', request);
  }

  validateEmail(emailId): boolean {
    if (emailId != null && emailId != undefined && emailId.length > 0) {
      let regex = /^((?!\.)[\w-_.]*[^.])(@\w+)(\.\w+(\.\w+)?[^.\W])$/;
      return regex.test(String(emailId).toLowerCase());
    } else {
      return true;
    }
  }

  validatePhoneNumber(phone): boolean {
    if (phone != null && phone != undefined && phone.length > 0) {
      let regex = /^[\+]?[(]?[0-9]{3}[)]?[-\s\.]?[0-9]{3}[-\s\.]?[0-9]{4,6}$/;
      return regex.test(String(phone));
    } else {
      return true;
    }
  }

  validateGstNumber(gst): boolean {
    if (gst != null && gst != undefined && gst.length > 0) {
      let regex = /^[0-9]{2}[A-Z]{5}[0-9]{4}[A-Z]{1}[1-9A-Z]{1}Z[0-9A-Z]{1}$/;
      return regex.test(String(gst));
    } else {
      return true;
    }
  }

  validatePinCode(zipcode): boolean {
    let regex = /^[1-9][0-9]{5}$/;
    return regex.test(String(zipcode));
  }

  validateLandLine(cmpLandLine): boolean {
    if (cmpLandLine != null && cmpLandLine != undefined && cmpLandLine.length > 0) {
      let regex = /^[0-9]\d{2,4}-\d{6,8}$/;
      return regex.test(String(cmpLandLine));
    } else {
      return true;
    }
  }

  loadAddressFromPincode(pincode) {
    return this.http.get(environment.apiUrl + 'institute/get-address-from-pincode/' + pincode);
  }

  saveInstituteLogo(file, instituteId) {
    let form = new FormData();
    form.append('file', file);
    form.append('instituteId', instituteId);
    return this.http.post(environment.apiUrl + '/institute/logo-upload', form);
  }

  saveInstituteImport(institute) {
    console.log(institute);
    let request = {
      "institute": institute
    }
    return this.http.post(environment.apiUrl + '/institute/save-institute-import', request);
  }

  updateInstituteImport(institute) {
    console.log(institute);
    let request = {
      "institute": institute
    }
    return this.http.post(environment.apiUrl + '/institute/update-institute-import', request);
  }

  getAMCEntries(req) {
    console.log(req);
    return this.http.post(environment.apiUrl + 'institute/get-invoice-amc-entries/', req);
  }


}
