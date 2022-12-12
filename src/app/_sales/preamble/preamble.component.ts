import { Component, EventEmitter, OnInit, Output } from '@angular/core';
import { MatSnackBar } from '@angular/material';
import { DomSanitizer, SafeResourceUrl } from '@angular/platform-browser';
import { SalesService } from 'src/app/_services/sales.service';
import { environment } from 'src/environments/environment';
import Swal from 'sweetalert2';
declare var $: any;

@Component({
  selector: 'app-preamble',
  templateUrl: './preamble.component.html',
  styleUrls: ['./preamble.component.css']
})
export class PreambleComponent implements OnInit {

  constructor(private ss: SalesService, private sanitizer: DomSanitizer, private snackbar: MatSnackBar) {
    this.sanitizer = sanitizer;
  }

  @Output() OnChoose = new EventEmitter<string>();
  @Output() OnUnChoose = new EventEmitter<string>();

  _selectedFile: any = {};

  previewURL: any = {};

  _filenames: Array<any> = [];

  apiURI = environment.apiUrl;

  loading = false;

  ngOnInit() {
    this.getPreambleDocumentsList();
  }

  getPreambleDocumentsList() {
    this.loading = true;
    this.ss.getPreambleDocumentsList().subscribe(resp => {
      this.loading = false;
      if (resp['StatusCode'] == '00') {
        let filenames: Array<string> = resp['Files'];
        filenames.sort();
        this._filenames = [];
        filenames.forEach(filename => this._filenames.push({ filename: filename, url: this.apiURI + '/download/download-preamble-pdf/view/' + filename }));

        console.log(this._filenames);
      }
    }, error => this.loading = false)
  }

  cleanURL(oldURL: string): SafeResourceUrl {
    return this.sanitizer.bypassSecurityTrustResourceUrl(oldURL);
  }

  clicked(event) {
    console.log(event);
    console.log(this._selectedFile);
    if (event.filename == this._selectedFile.filename) {
      this.OnUnChoose.next('');
      this._selectedFile = {};
    }
    else {
      this.OnChoose.next(event.filename);
      this._selectedFile = event;
    }

  }

  preambleFileUploadChange(file) {
    console.log(file);

    if (file.type.toLowerCase() != 'application/pdf') {
      this.snackbar.open('Only PDF file type is valid');
      return false;
    }

    Swal.fire({
      title: 'Are you sure?',
      text: "You want to Upload.",
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#3085d6',
      cancelButtonColor: '#d33',
      confirmButtonText: 'Yes, Upload!'
    }).then((result) => {
      if (result.value) {
        this.loading = true;
        this.ss.UploadPreamblePDF(file).subscribe(res => {

          this.loading = false;
          if (res['StatusCode'] == '00') {
            this.getPreambleDocumentsList();
          } else {
            this.snackbar.open('Something went wrong! Try again later', 'OK');
          }
        }, error => this.loading = false)
      }
    })
  }

  openPreviewModal() {
    $(function () {
      $('#previewPreambleModal').appendTo("body").modal('show');
    });
  }

  closePreviewModal() {
    $(function () {
      $('#previewPreambleModal').appendTo("body").modal('hide');
    });
  }

  deletePreamble(preamble) {
    Swal.fire({
      title: 'Are you sure?',
      text: "You want to Delete.",
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#3085d6',
      cancelButtonColor: '#d33',
      confirmButtonText: 'Yes, Delete!'
    }).then((result) => {
      if (result.value) {
        this.loading = true;
        this.ss.deletePreamblePDF(preamble.filename).subscribe(res => {

          this.loading = false;
          if (res['StatusCode'] == '00') {

            this.snackbar.open('Deleted Successfully');
            this.getPreambleDocumentsList();
          } else {
            this.snackbar.open('Something went wrong! Try again later', 'OK');
          }
        }, error => this.loading = false)
      }
    })
  }



}
