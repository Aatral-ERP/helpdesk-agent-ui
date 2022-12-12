import { Component, Input, OnInit } from '@angular/core';
import { MatSnackBar } from '@angular/material';
import { Deal } from '../../_entity/deals-create/Deal';
import { AMCVisit } from './AMCVisit';
import { MomentDateAdapter, MAT_MOMENT_DATE_ADAPTER_OPTIONS } from '@angular/material-moment-adapter';
import { DateAdapter, MAT_DATE_FORMATS, MAT_DATE_LOCALE } from '@angular/material/core';
import { AMCVisitsService } from 'src/app/_services/amc-visits.service';
import Swal from 'sweetalert2';

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
  selector: 'app-deal-amc-visits',
  templateUrl: './deal-amc-visits.component.html',
  styleUrls: ['./deal-amc-visits.component.css'],
  providers: [
    {
      provide: DateAdapter,
      useClass: MomentDateAdapter,
      deps: [MAT_DATE_LOCALE, MAT_MOMENT_DATE_ADAPTER_OPTIONS]
    },
    { provide: MAT_DATE_FORMATS, useValue: MY_FORMATS },
  ]
})

export class DealAmcVisitsComponent implements OnInit {

  constructor(private amcVisitsService: AMCVisitsService, private snackbar: MatSnackBar) { }

  @Input("dealId") dealId: number;
  @Input("deal") deal: Deal;

  amcVisits: Array<AMCVisit> = [];
  amcVisit: AMCVisit = new AMCVisit();

  loading = false;

  ngOnInit() {
    this.getAMCVisits();
  }

  getAMCVisits() {
    this.loading = true;
    this.amcVisitsService.getAMCVisits(this.dealId).subscribe(resp => {
      this.loading = false;
      if (resp['StatusCode'] == '00') {
        this.amcVisits = resp['AMCVisits'];
      }
    }, error => this.loading = false)
  }

  saveAMCVisits() {
    this.amcVisit.dealId = this.dealId;
    if (this.amcVisit.subject === undefined || this.amcVisit.subject == null || this.amcVisit.subject == '') {
      this.snackbar.open('Enter Subject...');
      return;
    }
    if (this.amcVisit.visitDate === undefined || this.amcVisit.visitDate == null) {
      this.snackbar.open('Select valid Visit Date');
      return;
    }
    this.loading = true;
    this.amcVisitsService.saveAMCVisit(this.amcVisit).subscribe(resp => {
      this.loading = false;
      if (resp['StatusCode'] == '00') {
        this.getAMCVisits();
        this.amcVisit = new AMCVisit();

        this.snackbar.open('Added Successfully');
      }
    }, error => this.loading = false)
  }

  deleteAMCVisits(_amcVisit) {
    Swal.fire({
      title: 'Are you sure?',
      text: "This will delete the AMC Visit entry.",
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#3085d6',
      cancelButtonColor: '#d33',
      confirmButtonText: 'Yes, Delete it!'
    }).then((result) => {
      if (result.value) {
        this.loading = true;
        this.amcVisitsService.deleteAMCVisits(_amcVisit).subscribe(resp => {
          this.loading = false;
          this.snackbar.open('Deleted Successfully');
          if (resp['StatusCode'] == '00') {
            this.getAMCVisits();
          }
        }, error => this.loading = false)
      }
    })
  }

}
