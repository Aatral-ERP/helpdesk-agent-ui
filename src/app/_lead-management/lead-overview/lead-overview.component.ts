import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { LeadManagementService } from 'src/app/_services/lead-management.service';
import { MatSnackBar } from '@angular/material';
import { Lead } from '../lead-create/Lead';
import { environment } from 'src/environments/environment';
import { FileSystemFileEntry, NgxFileDropEntry } from 'ngx-file-drop';
import { HttpEventType } from '@angular/common/http';
import Swal from 'sweetalert2';
import { LeadContact } from '../lead-contact/LeadContact';

@Component({
  selector: 'app-lead-overview',
  templateUrl: './lead-overview.component.html',
  styleUrls: ['./lead-overview.component.css']
})
export class LeadOverviewComponent implements OnInit {

  constructor(private actRoute: ActivatedRoute, private lms: LeadManagementService,
    private snackbar: MatSnackBar, private route: Router) {
    this.lead.id = this.actRoute.snapshot.params['id'];

    this.actRoute.params.subscribe(params => {
      console.log(params);

      if (this.actRoute.snapshot.params['tab'] == 'lead')
        this.tab = 0;
      else if (this.actRoute.snapshot.params['tab'] == 'activities')
        this.tab = 1;
      else if (this.actRoute.snapshot.params['tab'] == 'emails')
        this.tab = 2;
      else
        this.tab = 0;
    })
  }

  loading = false;
  lead: Lead = new Lead();
  leadContacts: Array<LeadContact> = [];
  tab = 0;

  ngOnInit() {
    this.getLead(this.actRoute.snapshot.paramMap.get('id'));
  }

  getLead(leadId) {
    this.loading = true;
    this.lms.getLead(leadId).subscribe(resp => {
      this.loading = false;
      if (resp['StatusCode'] == "00") {
        if (resp['Lead'] != null) {
          this.lead = resp['Lead'];
          this.leadContacts = resp['LeadContacts']
          if (this.lead.description != null) {
            this.lead.description = this.lead.description.replace(/(?:\r\n|\r|\n)/g, '<br>')
          }
        } else {
          this.snackbar.open('Lead not found for id #' + leadId);
          this.route.navigateByUrl('/lead-management/reports/leads');
        }
      } else if (resp['StatusCode'] == '03') {
        this.snackbar.open(resp['StatusDesc']);
      } else {
        this.snackbar.open('Something went wrong');
      }
    }, error => this.loading = false)
  }

  deleteLead() {
    Swal.fire({
      title: 'Are you sure?',
      text: `You want to delete this lead`,
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#3085d6',
      cancelButtonColor: '#d33',
      confirmButtonText: 'Yes, Delete!'
    }).then((result) => {
      if (result.value) {

        let _lead: Lead = Object.assign({}, this.lead);
        _lead.status = status;

        this.loading = true;
        this.lms.deleteLead(_lead).subscribe(resp => {
          this.loading = false;
          if (resp['StatusCode'] == "00") {
            this.snackbar.open('Deleted Successfully');
            this.route.navigateByUrl('/lead-management/reports/leads');
          } else if (resp['StatusCode'] == '02') {
            this.snackbar.open(resp['StatusDesc']);
          } else {
            this.snackbar.open('Something went wrong');
          }
        }, error => this.loading = false)
      }
    })
  }

  changeStatus(status) {

    Swal.fire({
      title: 'Are you sure?',
      text: `You want to change status to '${status}'`,
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#3085d6',
      cancelButtonColor: '#d33',
      confirmButtonText: 'Yes, Change!'
    }).then((result) => {
      if (result.value) {

        let _lead: Lead = Object.assign({}, this.lead);
        _lead.status = status;

        this.loading = true;
        this.lms.updateLead(_lead, this.leadContacts).subscribe(resp => {
          this.loading = false;
          if (resp['StatusCode'] == "00") {
            this.snackbar.open('Saved Successfully');
            this.lead = resp['Lead'];
          } else if (resp['StatusCode'] == '03') {
            this.snackbar.open(resp['StatusDesc']);
          } else {
            this.snackbar.open('Something went wrong');
          }
        }, error => this.loading = false)
      }
    })
  }

  registerAsInstitute() {
    this.route.navigateByUrl('/institute/register?prefill-from-lead=1&lid=' + this.lead.id);
  }

  EditLead() {
    this.route.navigateByUrl('/lead-management/create?edit=1&lid=' + this.lead.id);
  }

  redirectURL(link: string) {
    if (link.startsWith('http:'))
      window.open(link, "_blank");
    else
      window.open('http://' + link, "_blank");
  }

  getProductsAsArray(): Array<string> {
    if (this.lead.products !== undefined && this.lead.products != null && this.lead.products != '')
      return this.lead.products.split(';');
    else
      return [];
  }

  getAttachmentssAsArray(): Array<string> {
    if (this.lead.files !== undefined && this.lead.files != null && this.lead.files != '')
      return this.lead.files.split(';');
    else
      return [];
  }

  downloadLeadAttachmnet(attachment) {
    console.log(attachment);
    window.open(environment.contentPath + 'lead-attachments/download/' + this.lead.id + '/' + attachment, '_blank');
  }


  public filesDrop: NgxFileDropEntry[] = [];
  files: Array<fileUpload> = [];
  filesUploaded = 0;

  public dropped(files: NgxFileDropEntry[]) {
    this.filesDrop = files;
    for (const droppedFile of this.filesDrop) {

      // Is it a file?
      if (droppedFile.fileEntry.isFile) {
        const fileEntry = droppedFile.fileEntry as FileSystemFileEntry;
        fileEntry.file((file: File) => {

          if (file.size > 26214400) {
            this.snackbar.open(`File is exceeds limit 25MB`);
          } else {

            // Here you can access the real file
            console.log(droppedFile.relativePath, file);

            let _file_upload: fileUpload = {
              file: file,
              progress: 0,
              status: 'uploading'
            }

            this.files.push(_file_upload);

            this.lms.uploadLeadAttachment(file, this.lead.id)
              .subscribe(resp => {
                if (resp.type == HttpEventType.UploadProgress) {
                  _file_upload.progress = Math.round(100 * resp.loaded / resp.total);

                }
                if (resp.type === HttpEventType.Response) {
                  console.log('Upload complete');
                  _file_upload.status = 'Uploaded';
                  this.filesUploaded = this.filesUploaded + 1;
                  this.finishFileUpload();
                }
              });
          }
        });
      }
    }
  }

  finishFileUpload() {
    console.log(this.files.length, this.filesUploaded, this.files.length == this.filesUploaded);
    if (this.files.length == this.filesUploaded) {
      console.log("All Upload Finished::");
      let _attachments = this.lead.files;
      this.files.forEach(file => { _attachments = _attachments + file.file.name + ';' });

      let _lead = Object.assign({}, this.lead);
      _lead.files = _attachments;
      this.loading = true;
      this.lms.updateLead(_lead, this.leadContacts).subscribe(resp => {
        this.loading = false;
        if (resp['StatusCode'] == '00') {
          this.snackbar.open('Uploaded Files successfully');

          this.files = [];
          this.filesUploaded = 0;

          this.lead = resp['Lead'];
        }
      }, error => this.loading = false)
    }
  }


  tabChange(event) {
    console.log(event);

    if (event.index == 0)
      this.route.navigate(['/lead-management/overview/' + this.lead.id + '/lead']);
    else if (event.index == 1)
      this.route.navigate(['/lead-management/overview/' + this.lead.id + '/activities']);
    else if (event.index == 2)
      this.route.navigate(['/lead-management/overview/' + this.lead.id + '/emails']);
    else
      this.route.navigate(['/lead-management/overview/' + this.lead.id + '/lead']);
  }


}

interface fileUpload {
  file: any;
  progress: number;
  status: string;
}