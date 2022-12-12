import { Component, OnInit } from '@angular/core';
import { IDropdownSettings } from 'ng-multiselect-dropdown';
import { InstituteService } from 'src/app/_services/institute.service';
import { TicketService } from 'src/app/_services/ticket.service';
import { SalesService } from 'src/app/_services/sales.service';

@Component({
  selector: 'app-instcontact-report',
  templateUrl: './instcontact-report.component.html',
  styleUrls: ['./instcontact-report.component.css']
})
export class InstcontactReportComponent implements OnInit {
  _institutes = [];
  _selectedInstitute = [];
  dropdownList = [];
  rowData = [];
  contactDetails: any[];
  showGrid = false;

  loading = false;

  constructor(private ss: SalesService, private is: InstituteService) { }

  _instituteDropdownSettings: IDropdownSettings = {
    singleSelection: true,
    idField: 'instituteId',
    textField: 'instituteName',
    itemsShowLimit: 10,
    allowSearchFilter: true,
    closeDropDownOnSelection: true
  };
  ngOnInit() {
    this.loadInstituteDetails();
  }

  loadInstituteDetails() {
    this.ss.getSalesNeededData(['institutes']).subscribe(res => {
      console.log(res);
      this._institutes = res['Institutes'];
    })
  }

  columnDefs = [
    {
      headerName: 'Institute', field: 'instituteName', filter: true, minWidth: 150, width: 250, cellRenderer: (data) => {
        return `<a href="/institute/institute-detail?iid=${data.data.institute.instituteId}" target="_blank"> ${data.data.institute.instituteName} </a>`;
      }
    },
    { headerName: 'FirstName', field: 'firstName', filter: true, minWidth: 100, width: 120 },
    { headerName: 'LastName', field: 'lastName', filter: true, minWidth: 100, width: 130 },
    { headerName: 'PhoneNumber', field: 'phone', filter: true, minWidth: 90, width: 110 },
    { headerName: 'Email ID', field: 'emailId', filter: true, minWidth: 180, width: 200 },
    { headerName: 'Address1', field: 'street1', filter: true, minWidth: 120, width: 150 },
    { headerName: 'Address2', field: 'street2', filter: true, minWidth: 120, width: 150 },
    { headerName: 'City', field: 'city', filter: true, minWidth: 100, width: 120 },
    { headerName: 'State', field: 'state', filter: true, minWidth: 100, width: 110 },
    { headerName: 'Country', field: 'country', filter: true, minWidth: 80, width: 100 },
    { headerName: 'PinCode', field: 'zipcode', filter: true, minWidth: 80, width: 100 }
  ];

  _search_instContactfilters = {
    institutes: [],
    firstName: '',
    phone: '',
    emailId: '',
    city: '',
    isBlocked: '',
    atlemailId: '',
    atlphoneNumber: '',
  }

  search() {
    console.log("inside Report");
    this.loading = true;
    this.is.getInstContact(this._search_instContactfilters).subscribe(res => {
      this.loading = false;
      console.log(res);
      this.contactDetails = new Array();
      this.contactDetails = res['contactDetails'];
      this.rowData = [];
      this.showGrid = false;

      this.contactDetails.forEach(contdetails => {
        let _rowData: any = {};
        _rowData.instituteName = contdetails.institutes.instituteName;
        _rowData.institute = contdetails.institutes;
        _rowData.firstName = contdetails.instituteContact.firstName;
        _rowData.lastName = contdetails.instituteContact.lastName;
        _rowData.emailId = contdetails.instituteContact.emailId;
        _rowData.phone = contdetails.instituteContact.phone;
        _rowData.street1 = contdetails.instituteContact.street1;
        _rowData.street2 = contdetails.instituteContact.street2;
        _rowData.city = contdetails.instituteContact.city;
        _rowData.state = contdetails.instituteContact.state;
        _rowData.country = contdetails.instituteContact.country;
        _rowData.zipcode = contdetails.instituteContact.zipcode;
        console.log(_rowData);
        this.rowData.push(_rowData);
      })
      this.showGrid = true;
    }, error => this.loading = false);
  }

  clear() {
    this._search_instContactfilters = {
      institutes: [],
      firstName: '',
      phone: '',
      emailId: '',
      city: '',
      isBlocked: '',
      atlemailId: '',
      atlphoneNumber: '',
    }
  }

}
