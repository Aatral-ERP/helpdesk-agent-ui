import { Component, OnInit } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { environment } from 'src/environments/environment';
import { InstituteService } from '../_services/institute.service';
import { IAngularMyDpOptions, IMyDefaultMonth } from 'angular-mydatepicker';
import { IDropdownSettings } from 'ng-multiselect-dropdown';

export const MY_CUSTOM_FORMATS = {
  fullPickerInput: 'DD/MM/YYYY',
  parseInput: 'DD/MM/YYYY',
  datePickerInput: 'DD/MM/YYYY',
  timePickerInput: 'LT',
  monthYearLabel: 'MMM YYYY',
  dateA11yLabel: 'LL',
  monthYearA11yLabel: 'MMMM YYYY'
};


@Component({
  selector: 'app-report',
  templateUrl: './report.component.html',
  styleUrls: ['./report.component.css']
})
export class ReportComponent implements OnInit {

  constructor(private http: HttpClient,private is:InstituteService) { }
  institue: Array<any> = [];
  selectedinstitute='';
  product='';
  paymode='';
  validFromDate;
  validToDate;
  paidFromDate;
  paidToDate;
  institute: any = [];
  loading = false;
  amcList = [];

  httpOptions = {
    headers: new HttpHeaders(
      {
        'Content-Type': 'application/json',
        ChannelName: 'WEB',
      })
  };

  ngOnInit() {
    this.loadInstitute();
  }

  getFromDate(date) {
    console.log(date);
    if (date == null || date === undefined)
      return null;
    else {
      let dd = date['singleDate'];
      return dd['jsDate'];
    }
  }

  getToDate(date) {
    console.log(date);
    if (date == null || date === undefined)
      return null;
    else {
      let dd = date['singleDate'];
      let formatted = dd['formatted'];
      let farr = formatted.split('/');
      let fromDate = farr[2] + '-' + farr[1] + '-' + farr[0] + 'T11:59:59';
      return new Date(fromDate);
    }
  }

  loadInstitute() {
    console.log("Inside Load");
    this.institute = [];
    let obs = this.http.post(environment.apiUrl + 'institute/load-institute', '', this.httpOptions);
    obs.subscribe(
      data => {
        if (data['StatusCode'] == '00') {
          this.institute = data['institute'];
        } else
          console.log('Error Loading Institute::');

        console.log(data);
      },
      error => { console.log(error);}
    );
  }

  report()
  {
    console.log("inside Report");
    this.loading = true;
    this.is.getAmcReport(this.selectedinstitute, this.product, this.paymode, this.validFromDate,
      this.validToDate, this.paidFromDate, this.paidToDate)
      .subscribe(res => {
        this.loading = false;
        console.log(res);
        if (res['StatusCode'] == '00') {
          this.amcList = res['amcList'];
          // if (this.amcList.length == 0)
          //   this.tst.info('No Records Found');
        }
      }, error => { this.loading = false; console.log(error) });
  }
  clear() {
    window.location.reload();
  }
}
