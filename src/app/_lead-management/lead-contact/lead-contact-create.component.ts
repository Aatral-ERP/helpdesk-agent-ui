import { Component, Inject, Input, OnInit } from '@angular/core';
import { MatDialogRef, MatSnackBar, MAT_DIALOG_DATA } from '@angular/material';
import { LeadManagementService } from 'src/app/_services/lead-management.service';
import { LeadContact } from './LeadContact';

@Component({
  selector: 'app-lead-contact-create',
  templateUrl: './lead-contact-create.component.html',
  styleUrls: ['./lead-contact-create.component.css']
})
export class LeadContactCreateComponent implements OnInit {

  constructor(private lms: LeadManagementService, private snackbar: MatSnackBar,
    public dialogRef: MatDialogRef<LeadContactCreateComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any) { }

  leadContact: LeadContact;
  mode = 'Add';

  ngOnInit() {
    console.log(this.data);
    if (this.data != null) {
      this.leadContact = this.data.leadContact;
      this.mode = this.leadContact.id == 0 ? 'Add' : 'Update';
    }
  }

  _errors = {
    phoneNo: '',
    emailId: '',
    altEmailId: '',
    name: ''
  }

  saveLeadContact() {
    console.log(this.leadContact);
    this.checkName(); this.checkPhone(); this.checkEmail(); this.checkAltEmail();

    if (this.leadContact.name == '') {
      this.snackbar.open('Please enter Name');
      return;
    } else if (this.leadContact.phoneNo == '' && this.leadContact.alternatePhoneNo == '' && this.leadContact.emailId == '' && this.leadContact.alternateEmail == '') {
      this.snackbar.open('Atleast enter one contact details.');
      return;
    } else {
      this.dialogRef.close({ action: 'Lead Created_Updated', LeadContact: this.leadContact });
    }
  }

  close() {
    this.dialogRef.close({ action: 'Lead Closed', LeadContact: this.leadContact });
  }

  checkName() {
    if (this.leadContact.name == '') {
      this._errors.name = 'Name is not valid';
    } else {
      this._errors.name = '';
    }
  }

  checkPhone() {
    if (this.leadContact.phoneNo != '') {
      if (!this.lms.util.validatePhoneNumber(this.leadContact.phoneNo))
        this._errors.phoneNo = 'Phone No. is not valid (i.e, 9876543210)';
      else
        this._errors.phoneNo = '';
    } else {
      this._errors.phoneNo = '';
    }
  }

  checkEmail() {
    if (this.leadContact.emailId != '') {
      if (!this.lms.util.validateEmail(this.leadContact.emailId))
        this._errors.emailId = 'Email is not valid (e.g. someone@domain.com)';
      else
        this._errors.emailId = '';
    } else {
      this._errors.emailId = '';
    }
  }

  checkAltEmail() {
    if (this.leadContact.alternateEmail != '') {
      if (!this.lms.util.validateEmail(this.leadContact.alternateEmail))
        this._errors.altEmailId = 'Alt. Email is not valid (e.g. someone@domain.com)';
      else
        this._errors.altEmailId = '';
    } else {
      this._errors.altEmailId = '';
    }
  }

}
