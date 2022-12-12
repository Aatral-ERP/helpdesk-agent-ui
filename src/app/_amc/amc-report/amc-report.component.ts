import { Component, OnInit } from '@angular/core';
import { environment } from 'src/environments/environment';
import { HttpClient } from '@angular/common/http';
import { InstituteService } from 'src/app/_services/institute.service';
import { IAngularMyDpOptions, IMyDefaultMonth } from 'angular-mydatepicker';
import { ToastrService } from 'ngx-toastr';

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
  selector: 'app-amc-report',
  templateUrl: './amc-report.component.html',
  styleUrls: ['./amc-report.component.css']
})
export class AmcReportComponent implements OnInit {


  constructor(private http: HttpClient, private is: InstituteService, private tst: ToastrService) { }
  institue: Array<any> = [];
  selectedinstitute = '';
  selectedproduct = '';
  paymode = '';
  validFromDate = '';
  validToDate = '';
  paidFromDate = '';
  paidToDate = '';
  institute: any = [];
  loading = false;
  amcList = [];
  product = "";



  ngOnInit() {
    this.loadInstitute();
  }

  loadInstitute() {
    console.log("Inside Load");
    this.institute = [];
    let obs = this.http.post(environment.apiUrl + 'institute/load-institute', '');
    obs.subscribe(
      data => {
        if (data['StatusCode'] == '00') {
          this.institute = data['institute'];
        } else
          console.log('Error Loading Institute::');

        console.log(data);
      },
      error => { console.log(error); }
    );
  }

  instChanged() {
    let obs = this.http.post(environment.apiUrl + 'institute/get-institute-products', { institute: { instituteId: this.selectedinstitute } });
    obs.subscribe(
      data => {
        if (data['StatusCode'] == '00') {
          this.product = data['InstituteProducts'];
        } else
          console.log('Error Loading Product::');
      },
      error => { console.log(error); }
    );
  }

  getDateAsString(date) {
    console.log(date);
    if (date == null || date === undefined || date == '')
      return '';
    else {
      let dd = date['singleDate'];
      return this.formatDate(dd['jsDate']);
    }
  }

  formatDate(date) {
    var d = new Date(date),
      month = '' + (d.getMonth() + 1),
      day = '' + d.getDate(),
      year = d.getFullYear();

    if (month.length < 2)
      month = '0' + month;
    if (day.length < 2)
      day = '0' + day;

    return [year, month, day].join('-');
  }


  getFromDate(date) {
    console.log(date);
    if (date == null || date === undefined || date == '')
      return null;
    else {
      let dd = date['singleDate'];
      return dd['jsDate'];
    }
  }

  getToDate(date) {
    console.log(date);
    if (date == null || date === undefined || date == '')
      return null;
    else {
      let dd = date['singleDate'];
      let formatted = dd['formatted'];
      let farr = formatted.split('/');
      let fromDate = farr[2] + '-' + farr[1] + '-' + farr[0] + 'T11:59:59';
      return new Date(fromDate);
    }
  }

  public myDatePickerOptions: IAngularMyDpOptions = {
    dateRange: false,
    dateFormat: 'dd/mm/yyyy',
  };

  public defMonth: IMyDefaultMonth = {
    defMonth: ''
  };


  report() {
    console.log("inside Report");
    this.loading = true;
    this.is.getAmcReport(this.selectedinstitute, this.product, this.paymode,
      this.getDateAsString(this.validFromDate),
      this.getDateAsString(this.validToDate),
      this.getDateAsString(this.paidFromDate),
      this.getDateAsString(this.paidToDate))
      .subscribe(res => {
        this.loading = false;
        console.log(res);
        if (res['StatusCode'] == '00') {
          console.log(res['amcList']);
          this.amcList = res['amcList'];
          if (this.amcList.length == 0)
            this.tst.info('No Records Found');
        }
      }, error => { this.loading = false; console.log(error) });
  }
  clear() {
    window.location.reload();
  }

}
