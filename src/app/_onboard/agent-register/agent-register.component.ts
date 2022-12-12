import { Component, OnInit } from '@angular/core';
import Swal from 'sweetalert2';
import { ActivatedRoute, Router } from '@angular/router';
import { AgentService } from '../../_services/agent.service';
import { IAngularMyDpOptions, IMyDefaultMonth, IMyDateModel } from 'angular-mydatepicker';
import { AuthService } from 'src/app/_services/auth.service';
import { MatSnackBar } from '@angular/material/snack-bar';
import { InstituteService } from 'src/app/_services/institute.service';
import { RoleMaster } from 'src/app/_admin/role-create/RoleMaster';

import { MomentDateAdapter, MAT_MOMENT_DATE_ADAPTER_OPTIONS } from '@angular/material-moment-adapter';
import { DateAdapter, MAT_DATE_FORMATS, MAT_DATE_LOCALE } from '@angular/material/core';
import { LeaveMaster } from 'src/app/_hr/leave-management/leave-master-create/LeaveMaster';
import { Agent } from 'src/app/_profile/agent-profile/Agent';
import { environment } from 'src/environments/environment';
declare var $: any;

export const MY_FORMATS = {
  parse: {
    dateInput: 'DD/MM/YYYY',
  },
  display: {
    dateInput: 'DD/MM/YYYY',
    monthYearLabel: 'MMM YYYY',
    dateA11yLabel: 'LL',
    monthYearA11yLabel: 'MMMM YYYY',
  },
};

@Component({
  selector: 'app-agent-register',
  templateUrl: './agent-register.component.html',
  styleUrls: ['./agent-register.component.css'],
  providers: [
    {
      provide: DateAdapter,
      useClass: MomentDateAdapter,
      deps: [MAT_DATE_LOCALE, MAT_MOMENT_DATE_ADAPTER_OPTIONS]
    },
    { provide: MAT_DATE_FORMATS, useValue: MY_FORMATS },
  ]
})
export class AgentRegisterComponent implements OnInit {

  constructor(private snackbar: MatSnackBar, private auth: AuthService,
    private as: AgentService, private is: InstituteService, private _adapter: DateAdapter<any>,
    private route: Router, private actRoute: ActivatedRoute) {
    _adapter.setLocale('en-GB')
    this.actRoute.queryParams.subscribe(params => {
      console.log(params);
      if (params['edit']) {
        if (params['edit'] == 1 && params['aid']) {
          this.getAgentDetails(params['aid']);
        }
      } else {

      }
    })
  }

  agent: Agent = new Agent();

  mode = 'Create';

  deductTakenLeavesIfany = false;
  loading = false;
  photoLoading = false;
  showPhotoOptions = false;
  changePwd = '';

  selectFile = null;
  designationList = [];
  emptydata = [];
  categoryList = [];

  showEmailError = false;
  showNumberError = false;

  roles: Array<RoleMaster> = [];
  leaveMasters: Array<LeaveMaster> = [];

  ngOnInit() {
    this.loadNeeded();
  }

  save() {
    !(this.is.validateEmail(this.agent.emailId)) ? this.showEmailError = true : this.showEmailError = false;
    !(this.is.validatePhoneNumber(this.agent.phone)) ? this.showNumberError = true : this.showNumberError = false;
    if (this.showEmailError || this.showNumberError) {
      return;
    } else if (this.agent.employeeId == '') {
      this.snackbar.open('Employee Id Cannot be empty');
      return;
    } else if (this.agent.firstName == '') {
      this.snackbar.open('First Name Cannot be empty');
      return;
    } else if (this.agent.lastName == '') {
      this.snackbar.open('Last Name Cannot be empty');
      return;
    }
    this.snackbar.open('Saving...');
    this.loading = true;

    let s_role = this.roles.find(rl => rl.id == this.agent.agentType);
    if (s_role !== undefined) {
      this.agent.roleName = s_role.name;
    }

    this.as.saveAgent(this.agent).subscribe(res => {

      this.loading = false;
      if (res['StatusCode'] == '00') {
        Swal.fire('Update Sucessfully', '', 'success');
        this.route.navigateByUrl('/hr/agent/agent-register?edit=1&aid=' + this.agent.employeeId);
      } else if (res['StatusCode'] == '03' || res['StatusCode'] == '02') {
        Swal.fire('', res['StatusDesc'], 'warning');
      } else {
        Swal.fire("Something went wrong, Try again later!", '', 'warning');
      }
    })
  }

  getAgentDetails(aid) {
    this.as.getAgentDetails(aid).subscribe(res => {
      if (res['StatusCode'] == '00') {
        console.log(":::Inside Agent Details:::");
        this.showPhotoOptions = true;
        this.mode = 'Edit';
        this.agent = res['Agent'];

        if (this.auth.getLoginEmailId() == this.agent.emailId)
          this.auth.updatePhotoLocal(this.agent.photo, this.agent.photoFileName);
      }
    })
  }

  clear() {
    window.location.reload();
  }

  getJoiningDate(date) {
    console.log(date);
    if (date == null || date === undefined)
      return null;
    else {
      let dd = date['singleDate'];
      let dateOfJoining = dd['formatted'];
      console.log('dateOfJoining', dateOfJoining);
      return dateOfJoining;
    }
  }
  preventSalary(event) {
    let value = this.agent.monthlySalary;
    if (value >= 6) {
      event.preventDefault()
      this.agent.monthlySalary = parseInt(value.toString().substring(0, 5));
    }
  }

  preventSalaryDate(event) {
    let value = this.agent.salaryDate;
    if (value >= 2) {
      event.preventDefault()
      this.agent.salaryDate = parseInt(value.toString().substring(0, 2));
    }
  }

  preventLeave(event) {
    let value = this.agent.leavePermit;
    if (value >= 2) {
      event.preventDefault()
      this.agent.leavePermit = parseInt(value.toString().substring(0, 2));
    }
  }

  preventMobile(event) {
    let value = this.agent.phone;
    if (value >= 10) {
      event.preventDefault()
      this.agent.phone = parseInt(value.toString().substring(0, 10));
    }
  }

  public myDatePickerOptions: IAngularMyDpOptions = {
    dateRange: false,
    dateFormat: 'dd/mm/yyyy',
  };

  public defMonth: IMyDefaultMonth = {
    defMonth: ''
  };

  loadNeeded() {
    this.as.autocompleteDesignation().subscribe(res => {
      console.log(res);
      this.designationList = res['designationList'];
      this.roles = res['Roles'];
      this.leaveMasters = res['LeaveMasters'];
      this.categoryList = res['categoryList'];
    })
  }

  saveProfilePhoto() {
    this.photoLoading = true;
    this.as.saveProfilePhoto(this.selectFile, this.agent.employeeId).subscribe(res => {
      this.photoLoading = false;

      if (res['StatusCode'] == '00') {
        console.log(res['agent']);
        let profile = res['agent'];
        this.agent.photo = profile.photo;
        this.agent.photoFileName = profile.photoFileName;
        if (this.auth.getLoginEmailId() == this.agent.emailId)
          this.auth.updatePhotoLocal(this.agent.photo, this.agent.photoFileName);
        this.snackbar.open('Profile Photo Updated Successfully');
      } else {
        this.snackbar.open('Something went wrong');
      }
    })
  }

  fileChange(event) {
    this.selectFile = event.target.files[0];
    this.saveProfilePhoto();
  }

  onRespEvent(role: RoleMaster) {
    this.agent.agentType = role.id;
    this.roles.push(role);
  }

  onLeaveMasterRespEvent(leaveMaster: LeaveMaster) {
    this.agent.leaveMasterId = leaveMaster.id;
    this.leaveMasters.push(leaveMaster);
  }

  getMemberImageURL() {
    if (this.agent !== undefined && this.agent.photoFileName !== undefined && this.agent.photoFileName != null && this.agent.photoFileName != '') {
      return environment.apiUrl + '/download/profile-photos/' + this.agent.photoFileName;
    } else {
      return 'https://buckinghamflooring.co.uk/wp-content/uploads/2019/10/user_5-15-512.png';
    }
  }

  openCreateModal() {
    console.log(":::::Insidde Modal:::");
    $(function () {
      $('#myModal').appendTo("body").modal('show');
    });
  }


  savePwd() {
    console.log(":::Inside Save::::", this.changePwd);
    console.log("::::Mail:::", this.agent.emailId);

    this.as.updatePassword(this.agent.emailId, this.changePwd).subscribe(res => {
      if (res['StatusCode'] == '00') {
        Swal.fire('Update Sucessfully', '', 'success');
        $(function () {
          $('#myModal').appendTo("body").modal('hide');
        });
      }
      else {
        Swal.fire('', res['StatusDesc'], 'warning');
      }
    })
  }

  getLeaveMasterName(id) {
    if (this.leaveMasters.find(lm => lm.id == id))
      return this.leaveMasters.find(lm => lm.id == id).name;
    else
      return "-";
  }

  openLeaveMasterModal() {
    $(function () {
      $('#changeLeaveMasterModal').appendTo("body").modal('show');
    });
  }

  changeLeaveMaster(lm) {

    Swal.fire({
      title: 'Are you sure?',
      text: `You want to change to '${lm.name}'`,
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#3085d6',
      cancelButtonColor: '#d33',
      confirmButtonText: 'Yes'
    }).then((result) => {
      if (result.value) {

        let request = { emailId: this.agent.emailId, newLeaveMasterId: lm.id, deductTakenLeavesIfany: this.deductTakenLeavesIfany };

        this.as.changeLeaveMaster(request).subscribe(res => {
          console.log(res);
          $(function () {
            $('#changeLeaveMasterModal').appendTo("body").modal('hide');
          });
          if (res['StatusCode'] == '00') {
            this.snackbar.open('Changed Successfully and Updated the Leave Balance Sheet.');
            this.agent = res['Agent'];
          } else {
            this.snackbar.open('Something went wrong');
          }
        })
      }

    })

  }
}