import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { MatSnackBar } from '@angular/material';
import { SalesService } from 'src/app/_services/sales.service';
import Swal from 'sweetalert2';
import { TermsAndConditions } from './TermsAndConditions';

@Component({
  selector: 'app-terms-and-conditions',
  templateUrl: './terms-and-conditions.component.html',
  styleUrls: ['./terms-and-conditions.component.css']
})
export class TermsAndConditionsComponent implements OnInit {

  constructor(private ss: SalesService, private snackbar: MatSnackBar) { }

  @Input() type: string;
  @Output() OnChoose = new EventEmitter<string>();

  loading = false;
  terms: Array<TermsAndConditions> = [];
  showAddEditDiv = false;
  term: TermsAndConditions = new TermsAndConditions();

  ngOnInit() {
    this.loadTermsAndConditions();
  }

  clicked(term: TermsAndConditions) {
    console.log(term);
    this.OnChoose.next(term.terms);
  }

  loadTermsAndConditions() {
    this.loading = true;
    this.ss.loadTermsAndConditions(this.type).subscribe(resp => {
      this.loading = false;
      if (resp['StatusCode'] == '00') {
        this.terms = resp['Terms'];
      } else {
        this.snackbar.open('Something went wrong');
      }
    }, error => this.loading = false)
  }

  saveTermsAndConditions() {

    if (this.term.name == '') {
      this.snackbar.open('Enter valid Name');
      return false;
    } else if (this.term.terms == '') {
      this.snackbar.open('Enter valid Terms');
      return false;
    }

    this.term.type = this.type;
    this.loading = true;
    this.ss.saveTermsAndConditions(this.term).subscribe(resp => {
      this.loading = false;
      if (resp['StatusCode'] == '00') {
        this.snackbar.open('Saved Successfully');
        this.loadTermsAndConditions();
      } else {
        this.snackbar.open('Something went wrong');
      }
    }, error => this.loading = false)
  }

  getHTMLContent(str: String) {
    return str.replace(/(?:\r\n|\r|\n)/g, '<br>');
  }

  deleteTermsAndConditions(term: TermsAndConditions) {
    Swal.fire({
      title: 'Are you sure?',
      text: `You want to delete ${term.name}.`,
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#3085d6',
      cancelButtonColor: '#d33',
      confirmButtonText: 'Yes, Delete!'
    }).then((result) => {
      if (result.value) {

        this.loading = true;
        this.ss.deleteTermsAndConditions(this.term).subscribe(resp => {
          this.loading = false;
          if (resp['StatusCode'] == '00') {
            this.snackbar.open('Deleted Successfully');
            this.loadTermsAndConditions();
          } else {
            this.snackbar.open('Something went wrong');
          }
        }, error => this.loading = false)

      }
    })
  }

  showAddEdit(_term?: TermsAndConditions) {

    if (_term !== undefined)
      this.term = _term;
    else
      this.term = new TermsAndConditions();

    this.showAddEditDiv = true;
  }

  useTerm(term: TermsAndConditions) {
    Swal.fire({
      title: 'Are you sure?',
      text: `You want to use Term ' ${term.name} '.`,
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#3085d6',
      cancelButtonColor: '#d33',
      confirmButtonText: 'Yes'
    }).then((result) => {
      if (result.value) {
        this.OnChoose.next(term.terms);
      }
    })
  }

}
