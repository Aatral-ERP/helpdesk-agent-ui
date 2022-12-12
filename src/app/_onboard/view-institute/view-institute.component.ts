import { Component, OnInit } from '@angular/core';
import { IDropdownSettings } from 'ng-multiselect-dropdown';
import { AgentService } from 'src/app/_services/agent.service';
import { InstituteService } from 'src/app/_services/institute.service';
import { TicketService } from 'src/app/_services/ticket.service';

@Component({
  selector: 'app-view-institute',
  templateUrl: './view-institute.component.html',
  styleUrls: ['./view-institute.component.css']
})
export class ViewInstituteComponent implements OnInit {
  institutionList = [];
  instituteTypeList = [];
  serviceTypeList = [];
  instituteAllList = [];
  _institutes = [];
  _selectedInstitute = [];
  dropdownList = [];
  rowData = [];
  instReport: any[];
  showGrid = false;
  instituteDetails: any[];

  private gridApi;
  private gridColumnApi;

  constructor(private as: AgentService, private is: InstituteService, private ts: TicketService) { }

  _instituteDropdownSettings: IDropdownSettings = {
    singleSelection: true,
    idField: 'instituteId',
    textField: 'instituteName',
    itemsShowLimit: 10,
    allowSearchFilter: true,
    closeDropDownOnSelection: true
  };

  ngOnInit(): void {
    this.loadInstituteDetails();
    this.loadInstituteName();
  }

  loadInstituteDetails() {
    this.as.loadInstituteDetails().subscribe(res => {
      console.log(res);
      this.instituteTypeList = res['instituteTypeList'];
      this.serviceTypeList = res['serviceTypeList'];
      this.instituteAllList = res['instituteAllList'];

    })
  }

  loadInstituteName() {
    this.ts.getTicketsReportData().subscribe(res => {
      console.log(res);
      this._institutes = res['Institutes'];
    })
  }

  columnDefs = [
    {
      headerName: 'Institute', field: 'institute', sortable: true, filter: true, minWidth: 150, width: 250, cellRenderer: (data) => {
        return `<a href="/institute/institute-detail?iid=${data.data.instituteId}" target="_blank"> ${data.value} </a>`;
      }
    },
    {
      headerName: 'Short-Term', field: 'shortTerm', sortable: true, filter: true, minWidth: 80, width: 120
    },
    {
      headerName: 'Institute Type', field: 'instituteType', sortable: true, filter: true, minWidth: 150, width: 250
    },
    {
      headerName: 'PhoneNumber', field: 'phone', sortable: true, filter: true, minWidth: 110, width: 120
    },
    {
      headerName: 'Email ID', field: 'emailId', sortable: true, filter: true, minWidth: 180, width: 200
    },
    {
      headerName: 'Atl.PhoneNumber', field: 'alternatePhone', sortable: true, filter: true, minWidth: 120, width: 120
    },
    {
      headerName: 'Atl.Email ID', field: 'alternateEmailId', sortable: true, filter: true, minWidth: 180, width: 200
    },
    {
      headerName: 'Service Under', field: 'serviceUnder', sortable: true, filter: true, minWidth: 120, width: 150
    },
    {
      headerName: 'Address1', field: 'street1', sortable: true, filter: true, minWidth: 120, width: 150
    },
    {
      headerName: 'Address2', field: 'street2', sortable: true, filter: true, minWidth: 120, width: 150
    },
    {
      headerName: 'City', field: 'city', sortable: true, filter: true, minWidth: 100, width: 120
    },
    {
      headerName: 'State', field: 'state', sortable: true, filter: true, minWidth: 100, width: 110
    },
    {
      headerName: 'Country', field: 'country', sortable: true, filter: true, minWidth: 80, width: 100
    },
    {
      headerName: 'PinCode', field: 'zipcode', sortable: true, filter: true, minWidth: 80, width: 100
    },
    {
      headerName: 'GST No', field: 'gstno', filter: true, minWidth: 80, width: 100
    },
    {
      headerName: 'Key.Information', field: 'keyInfo', filter: true, minWidth: 80, width: 100
    },
    {
      headerName: 'Remarks', field: 'remarks', filter: true, minWidth: 80, width: 100
    },
    {
      headerName: 'ProjectManager EmailID', field: 'projectManager', filter: true, minWidth: 150, width: 150
    }
  ];

  _search_instfilters = {
    institutes: [],
    instituteId: '',
    instituteType: '',
    phone: '',
    emailId: '',
    city: '',
    alternateEmailId: '',
    alternatePhone: '',
    shortTerm:'',
  }

  search() {
    console.log("inside Report");
    this.is.instituteReport(this._search_instfilters).subscribe(res => {
      console.log(res);
      this.instReport = new Array();
      this.instReport = res['instReport'];
      this.rowData = [];
      this.showGrid = false;

      this.instReport.forEach(instrep => {

        let _rowData: any = {};
        _rowData.instituteId = instrep.instituteId;
        _rowData.institute = instrep.instituteName;
        _rowData.instituteType = instrep.instituteType;
        _rowData.street1 = instrep.street1;
        _rowData.street2 = instrep.street2;
        _rowData.city = instrep.city;
        _rowData.state = instrep.state;
        _rowData.country = instrep.country;
        _rowData.zipcode = instrep.zipcode;
        _rowData.emailId = instrep.emailId;
        _rowData.phone = instrep.phone;
        _rowData.alternateEmailId = instrep.alternateEmailId;
        _rowData.alternatePhone = instrep.alternatePhone;
        _rowData.serviceUnder = instrep.serviceUnder;
        _rowData.projectManager = instrep.agents;
        _rowData.keyInfo = instrep.keyInfo;
        _rowData.remarks = instrep.remarks;
        _rowData.gstno = instrep.gstno;
        _rowData.shortTerm=instrep.shortTerm;
        this.rowData.push(_rowData);
      })
      this.showGrid = true;
    });
  }

  clear() {
    window.location.reload();
  }

  onGridSelectionChanged() {
    var selectedRows = this.gridApi.getSelectedRows();
    // console.log(selectedRows);
  }

  onGridReady(params) {
    this.gridApi = params.api;
    this.gridColumnApi = params.columnApi;
  }

  onBtnExport() {
    var params = { fileName: 'Institute Report Export' };
    this.gridApi.exportDataAsCsv(params);
  }
}
