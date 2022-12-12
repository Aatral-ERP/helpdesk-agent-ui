import { Component, EventEmitter, OnInit, Output } from '@angular/core';
import { MatSnackBar } from '@angular/material';
import { LeaveManagementService } from 'src/app/_services/leave-management.service';
import Swal from 'sweetalert2';
import { LeaveMaster } from './LeaveMaster';
declare var $: any;

@Component({
  selector: 'app-leave-master-create',
  templateUrl: './leave-master-create.component.html',
  styleUrls: ['./leave-master-create.component.css']
})
export class LeaveMasterCreateComponent implements OnInit {

  constructor(private snackbar: MatSnackBar, private ls: LeaveManagementService) { }

  @Output('respEvent') respEvent = new EventEmitter();

  leaveMaster: LeaveMaster = new LeaveMaster();

  errors = {
    name: '',
    annualLeave: '',
    sickLeave: '',
    casualLeave: '',
    otherLeave: '',
    permissions: '',
    maximumCarryForward: '',
    lopPerDay: ''
  }

  ngOnInit() {
  }

  public openCreateModal(leaveMasterEvent?: LeaveMaster) {
    console.log("Inside openCreateModal", leaveMasterEvent);

    if (leaveMasterEvent === undefined) {
      this.leaveMaster = new LeaveMaster();
    } else {
      this.leaveMaster = leaveMasterEvent;
    }

    $(function () {
      $('#addLeaveMasterScrollable').appendTo("body").modal('show');
    });
  }

  saveLeaveMaster() {

    let _error = false;
    if (this.leaveMaster.name === undefined || this.leaveMaster.name == null || this.leaveMaster.name == '') {
      this.errors.name = 'Enter Valid Name';
      _error = true;
    }
    if (isNaN(this.leaveMaster.annualLeave) || this.leaveMaster.annualLeave < 0) {
      this.errors.annualLeave = 'Enter Valid Annual Leave Count';
      _error = true;
    }
    if (isNaN(this.leaveMaster.casualLeave) || this.leaveMaster.casualLeave < 0) {
      this.errors.casualLeave = 'Enter Valid Casual Leave Count';
      _error = true;
    }
    if (isNaN(this.leaveMaster.sickLeave) || this.leaveMaster.sickLeave < 0) {
      this.errors.sickLeave = 'Enter Valid Sick Leave Count';
      _error = true;
    }
    if (isNaN(this.leaveMaster.otherLeave) || this.leaveMaster.otherLeave < 0) {
      this.errors.otherLeave = 'Enter Valid Other Leave Count';
      _error = true;
    }
    if (isNaN(this.leaveMaster.permissions) || this.leaveMaster.permissions < 0) {
      this.errors.permissions = 'Enter Valid Permissions Leave Count';
      _error = true;
    }


    if (isNaN(this.leaveMaster.maximumCarryForward) || this.leaveMaster.maximumCarryForward < 0) {
      this.errors.maximumCarryForward = 'Enter Valid Maximum Carry Forward Leave';
      _error = true;
    }
    if (isNaN(this.leaveMaster.lopPerDay) || this.leaveMaster.lopPerDay < 0) {
      this.errors.lopPerDay = 'Enter Valid Loss of Pay';
      _error = true;
    }

    if (_error) {
      this.snackbar.open('Please check the errors.');
      return;
    } else {
      this.ls.saveLeaveMaster(this.leaveMaster).subscribe(resp => {
        if (resp['StatusCode'] == '00') {
          this.snackbar.open('Saved Successfully');
          $(function () {
            $('#addLeaveMasterScrollable').appendTo("body").modal('hide');
          });
          this.respEvent.next(resp['LeaveMaster']);
        } else {
          this.snackbar.open('Something went wrong!');
        }
      })
    }

  }

  deleteLeaveMaster() {

    Swal.fire({
      title: 'Are you sure?',
      text: `You want to Delete.`,
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#3085d6',
      cancelButtonColor: '#d33',
      confirmButtonText: 'Yes, Delete!'
    }).then((result) => {
      if (result.value) {

        this.ls.deleteLeaveMaster(this.leaveMaster).subscribe(resp => {
          if (resp['StatusCode'] == '00') {
            this.snackbar.open('Deleted successfully');
            $(function () {
              $('#addLeaveMasterScrollable').appendTo("body").modal('hide');
            });
            this.respEvent.next(resp['LeaveMaster']);
          }
        })

      }
    })
  }

}
