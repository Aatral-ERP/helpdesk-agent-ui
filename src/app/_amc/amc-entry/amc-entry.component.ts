import { Component, OnInit } from '@angular/core';
// import { DateTimeAdapter, OWL_DATE_TIME_FORMATS, OWL_DATE_TIME_LOCALE } from 'ng-pick-datetime';
import Swal from 'sweetalert2';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { environment } from 'src/environments/environment';
import { InstituteService } from 'src/app/_services/institute.service';
import { IAngularMyDpOptions, IMyDefaultMonth } from 'angular-mydatepicker';
import { IDropdownSettings } from 'ng-multiselect-dropdown';
import { ActivatedRoute } from '@angular/router';
import { AMCDetails } from '../amc-entry-edit/AMCDetails';
import { SalesService } from 'src/app/_services/sales.service';
// import { MomentDateTimeAdapter } from 'ng-pick-datetime-moment';

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
  selector: 'app-amc-entry',
  templateUrl: './amc-entry.component.html',
  styleUrls: ['./amc-entry.component.css'],
  providers: [
    // { provide: DateTimeAdapter deps: [OWL_DATE_TIME_LOCALE] },
    // { provide: OWL_DATE_TIME_FORMATS, useValue: MY_CUSTOM_FORMATS }
  ]
})
export class AmcEntryComponent implements OnInit {

  constructor(private is: InstituteService, private http: HttpClient, private actRoute: ActivatedRoute,
    private ss: SalesService) {

    this.actRoute.queryParams.subscribe(params => {
      console.log(params);
      if (params['edit']) {
        if (params['edit'] == 1 && params['aid']) {
          this.ad.id = params['aid'];
          this.loadAMCDetailEdit(params['aid']);
        }
      }
      if (params['paymentid']) {
        this.getAmcPayment(params['paymentid']);
      }
    })
  }

  gstPercent = 18;
  institue: Array<any> = [];
  ad = new AMCDetails();
  loading = false;
  Id = '';
  selectedinstitute = '';
  amcId = '';
  title = '';
  amcAmount = '';
  gst = '';
  totalAmount = '';
  fromDate = '';
  toDate = '';
  paidDate = '';
  invDate = '';
  payMode = '';
  serviceType = '';
  transactionDetails = '';
  description = '';
  createddatetime = '';
  lastupdatedatetime = '';
  institute: any = [];
  product = [];
  productList = [];
  _all_productList = [];
  selectedproduct = '';
  _selectedIns = [];

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
  loadInstitute() {
    console.log("Inside Load");
    this.institute = [];

    this.ss.getSalesNeededData(['institutes']).subscribe(res => {
      if (res['StatusCode'] == '00') {
        this.institute = res['Institutes'];
      }
    }, error => { console.log(error); });
  }

  loadAMCDetailEdit(aid) {
    this.is.getAmcDetails(aid).subscribe(res => {
      console.log(res);
      if (res['StatusCode'] == '00') {
        this.ad = res['AMCdetails'];
        this.ad.fromDateObject = { isRange: false, singleDate: { jsDate: (this.ad.fromDate != null) ? new Date(this.ad.fromDate) : this.ad.fromDate } };
        this.ad.toDateObject = { isRange: false, singleDate: { jsDate: (this.ad.toDate != null) ? new Date(this.ad.toDate) : this.ad.toDate } };
        this.ad.paidDateObject = { isRange: false, singleDate: { jsDate: (this.ad.paidDate != null) ? new Date(this.ad.paidDate) : this.ad.paidDate } };
        this.ad.invDateObject = { isRange: false, singleDate: { jsDate: (this.ad.invDate != null) ? new Date(this.ad.invDate) : this.ad.invDate } };
        this.selectedproduct = this.ad.product;
        this.selectedinstitute = this.ad.institute.instituteId;
        this._selectedIns = [{ instituteId: this.ad.institute.instituteId, instituteName: this.ad.institute.instituteName }]
        this.instChanged();

        console.log("_selectedIns;;;;", this._selectedIns);
      }
    })
  }

  _instituteDropdownSettings: IDropdownSettings = {
    singleSelection: true,
    idField: 'instituteId',
    textField: 'instituteName',
    itemsShowLimit: 10,
    allowSearchFilter: true,
    closeDropDownOnSelection: true
  };

  onSelectInst(event) {
    console.log(event);
    this.selectedinstitute = event.instituteId;
    this.instChanged();
  }

  instChanged() {
    this.product = [];
    this.productList = [];
    let obs = this.http.post(environment.apiUrl + 'institute/get-institute-products', { institute: { instituteId: this.selectedinstitute } });
    obs.subscribe(
      data => {
        if (data['StatusCode'] == '00') {
          this.product = data['InstituteProducts'];
        } else
          console.log('Error Loading Product::');

        console.log(this.product);
        console.log(this.productList);

        this._all_productList.forEach(p => {
          let isIP = false;
          this.product.forEach(ip => {
            if (ip.product.id == p.id) {
              isIP = true;
            }
          });

          // if (!isIP) {
          //   _not_in_inst_prod.push(p);
          // }
        })
        // console.log(_not_in_inst_prod);
        // this.productList = _not_in_inst_prod;
      },
      error => { console.log(error); }
    );
  }

  save() {
    console.log("INSIDE SAVE");

    if (this._selectedIns.length == 0) {
      Swal.fire('', 'Select Institute');
      return;
    }
    if (this.selectedproduct == '' || this.selectedproduct === undefined || this.selectedproduct == null) {
      Swal.fire('', 'Select Product');
      return;
    }
    if (this.ad.amcId == '') {
      Swal.fire('', 'Enter AmcId');
      return;
    }
    if (this.ad.invDate == null || this.ad.invDate == undefined) {
      Swal.fire('', 'Choose Invoice Date');
      return;
    }

    this.loading = true;
    this.ad.institute = this._selectedIns[0];
    this.ad.product = this.selectedproduct;

    this.is.saveAmcDetail(this.ad).subscribe(res => {
      this.loading = false;
      if (res['StatusCode'] == '00') {
        Swal.fire('', res['StatusDesc'], 'success');
        window.location.reload();
      }
      else
        Swal.fire('', res['StatusDesc'], 'warning');
    }, error => { this.loading = false })
  }

  clear() {
    window.location.href = "./institute/amc-entry";
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

  public myDatePickerOptions: IAngularMyDpOptions = {
    dateRange: false,
    dateFormat: 'dd/mm/yyyy',
  };

  public defMonth: IMyDefaultMonth = {
    defMonth: ''
  };

  getAmcPayment(paymentid) {
    this.ss.getAmcPayment(paymentid).subscribe(res => {
      console.log(res);
      //this.ad=res[DealPayment];
      this.ad.amcId = res['Deal']['invoiceNo'];
      this.ad.amcAmount = res['DealPayment']['amount'];
      this.ad.gst = res['DealPayment']['gstAmount'];
      this.ad.totalAmount = res['DealPayment']['totalAmount'];
      this.ad.payMode = res['DealPayment']['mode'];
      this.ad.description = res['DealPayment']['description'];
      this.ad.serviceType = 'AMC';
      this.ad.title = res['DealPayment']['subject'];
      this.ad.transactionDetails = res['DealPayment']['referenceno'];
      this.ad.paymentDate = res['DealPayment']['paymentDate'];
      this.ad.paidDateObject = { isRange: false, singleDate: { jsDate: (this.ad.paymentDate != null) ? new Date(this.ad.paymentDate) : this.ad.paymentDate } };

      this._selectedIns = [{
        instituteId: res['Deal']['institute']['instituteId'], instituteName: res['Deal']['institute']['instituteName']
      }];

      this.selectedinstitute = res['Deal']['institute']['instituteId'];
      this.instChanged();

      if (res['DealProducts']) {
        let prod = Array.from(res['DealProducts'])[0];

        this.selectedproduct = prod['productId'];
      }
    })
  }

  changeAmcAmount() {
    if (this.ad.amcAmount != '') {
      if (this.gstPercent > 0) {
        this.ad.gst = this.ad.amcAmount * (+this.gstPercent / 100);

        this.ad.totalAmount = this.ad.amcAmount + this.ad.gst;
        console.log(this.ad.amcAmount, this.ad.gst, this.totalAmount);
      } else {
        this.ad.totalAmount = this.ad.amcAmount;
      }
    }
  }

  changeGstPercentage() {
    if (this.gstPercent == 0) {
      this.ad.totalAmount = this.ad.amcAmount;
    } else {

      this.ad.gst = this.ad.amcAmount * (+this.gstPercent / 100);
      this.ad.totalAmount = this.ad.amcAmount + this.ad.gst;
      console.log(this.ad.amcAmount, this.ad.gst, this.totalAmount);

    }
  }

  changeTotalAmount() {
    if (this.ad.totalAmount != '') {
      if (this.gstPercent > 0) {
        let totalAmount = this.ad.totalAmount;
        this.ad.gst = ((totalAmount) / (100 + +this.gstPercent)) * +this.gstPercent;
        this.ad.amcAmount = totalAmount - this.ad.gst;

        console.log(totalAmount, this.gstPercent, this.ad.gst, this.ad.amcAmount);

      } else {
        this.ad.amcAmount = this.ad.totalAmount;
      }
    }
  }
}
