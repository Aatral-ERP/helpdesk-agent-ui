import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from 'src/environments/environment';
import { AuthService } from './auth.service';
import { SalaryDetails } from '../_hr/salary-details/SalaryDetails';

@Injectable({
  providedIn: 'root'
})
export class HrService {

  constructor(public auth: AuthService, private http: HttpClient) { }

  loadNeeded(needed: Array<any> = []): void {
    let request = {
      needed: needed
    }

    this.http.post(environment.apiUrl + 'salary/salary-needed-details', request).subscribe(res => {
      console.log(res);
      if (res['bankname']) {
        let all_needed_bankname = res['bankname'];
        if (all_needed_bankname.length > 0)
          localStorage.setItem('ac_bankname', JSON.stringify(all_needed_bankname));
      }
    });
  }

  onBankNameChanged(val): Array<String> {
    if (val == '') {
      return [];
    }

    let ac_bankname = JSON.parse(localStorage.getItem('ac_bankname'));
    let bankname = [];

    ac_bankname.forEach(name => {
      if (name.toUpperCase().includes(val.toUpperCase())) {
        bankname.push(name);
      }
    });
    return bankname.slice(0, 50);
  }


  getHrDashboardDetails() {
    return this.http.post(environment.apiUrl + 'hr/get-hr-dashboard-details', '');
  }

  getAttendanceCount() {
    return this.http.post(environment.apiUrl + 'hr/get-attendance-count', '');
  }

  saveSalaryDetails(sd: SalaryDetails) {
    let req = { salaryDetail: sd, salaryDetailProperty: sd.properties };
    return this.http.post(environment.apiUrl + 'salary/save-salary-details', req);
  }

  deleteSalaryDetails(sd: SalaryDetails) {
    return this.http.post(environment.apiUrl + 'salary/delete-salary-details', sd);
  }

  loadStaffDetails() {
    return this.http.post(environment.apiUrl + 'salary/get-salary-details', '');
  }

  getStaffSalaryDetails(sid) {
    console.log(sid);
    return this.http.get(environment.apiUrl + 'salary/get-salary-details-edit/' + sid);
  }

  getStaffSalaryEntries(req) {
    return this.http.post(environment.apiUrl + 'salary/get-salary-entries', req);
  }

  generateSalaryEntries(request) {
    return this.http.post(environment.apiUrl + 'salary/generate-salary-entries', request);
  }

  generatePayslips(request) {
    return this.http.post(environment.apiUrl + 'salary/generate-payslips', request);
  }

  sendPayslipsMail(request) {
    return this.http.post(environment.apiUrl + 'salary/send-payslips-mail', request);
  }

  
}
