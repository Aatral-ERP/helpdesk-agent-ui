import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from 'src/environments/environment';
import { LeaveMaster } from '../_hr/leave-management/leave-master-create/LeaveMaster';
import { LeaveApplied } from '../_profile/apply-leave/LeaveApplied';
import { AuthService } from './auth.service';

@Injectable({
  providedIn: 'root'
})
export class LeaveManagementService {

  constructor(public auth: AuthService, private http: HttpClient) { }

  saveLeaveMaster(leaveMaster: LeaveMaster) {

    leaveMaster.modifiedBy = this.auth.getLoginEmailId();

    if (leaveMaster.id == 0)
      leaveMaster.createdBy = this.auth.getLoginEmailId();

    return this.http.post(environment.apiUrl + '/leave-management/save-leave-master', leaveMaster);
  }

  deleteLeaveMaster(leaveMaster: LeaveMaster) {
    return this.http.post(environment.apiUrl + '/leave-management/delete-leave-master', leaveMaster);
  }

  getAllLeaveMasters() {
    return this.http.get(environment.apiUrl + '/leave-management/get-all-leave-masters');
  }

  applyLeave(leaveApplied: LeaveApplied) {
    return this.http.post(environment.apiUrl + '/leave-management/save-leave-applied', leaveApplied);
  }

  getMyAllAppliedLeaves(agent) {
    return this.http.post(environment.apiUrl + '/leave-management/get-my-all-leave-applied', agent);
  }

  searchLeaveApplied(filters) {
    return this.http.post(environment.apiUrl + '/leave-management/search-leave-applied', filters);
  }

  getAllLeaveBalance() {
    return this.http.post(environment.apiUrl + '/leave-management/get-all-leave-balances', {});
  }
}
