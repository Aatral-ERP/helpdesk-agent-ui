import { Component, OnInit } from '@angular/core';
import { MatSnackBar } from '@angular/material';
import { LeadManagementService } from 'src/app/_services/lead-management.service';
import { environment } from 'src/environments/environment';

@Component({
  selector: 'app-lead-details-upload',
  templateUrl: './lead-details-upload.component.html',
  styleUrls: ['./lead-details-upload.component.css']
})
export class LeadDetailsUploadComponent implements OnInit {

  constructor(private snackbar: MatSnackBar, private lms: LeadManagementService) { }

  selectFile: any;
  uploading = false;

  uploadErrors: any = {};objectKeys = Object.keys;

  ngOnInit() {
  }

  fileUpload(event) {
    if (confirm('Do you want to upload')) {
      this.selectFile = event.target.files[0];
      this.uploadLeadDetails();
    }
  }

  uploadLeadDetails() {
    this.uploading = true;
    this.lms.uploadLeadDetails(this.selectFile).subscribe(res => {
      this.uploading = false;
      if (res['StatusCode'] == '00') {
        this.snackbar.open('Lead Uploaded Successfully');
      } else if (res['StatusCode'] == "02") {
        this.snackbar.open(res['StatusDesc']);
        Object.assign(this.uploadErrors, res);
        console.log(this.uploadErrors);
        delete this.uploadErrors.StatusCode;
        delete this.uploadErrors.StatusDesc;
        delete this.uploadErrors.message;
      }
    }, error => { this.uploading = false; })
  }

  getErrorValues(key) {
    return this.uploadErrors[key];
  }

  downloadPDF() {
    let url = environment.apiUrl + 'download/download-lead-template';
    window.open(url, '_blank');
  }

}
