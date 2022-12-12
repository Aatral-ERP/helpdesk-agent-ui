import { DatePipe } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material';
import { AGGridButtonRendererComponent } from 'src/app/_modules/common/ag-grid-button-renderer.component';
import { LeadManagementService } from 'src/app/_services/lead-management.service';
import { NeededService } from 'src/app/_services/needed.service';
import { LeadMailTemplateCreateComponent } from '../lead-mail-template-create/lead-mail-template-create.component';
import { LeadMailTemplate } from '../lead-mail-template-create/LeadMailTemplate';

@Component({
  selector: 'app-lead-mail-templates',
  templateUrl: './lead-mail-templates.component.html',
  styleUrls: ['./lead-mail-templates.component.css']
})
export class LeadMailTemplatesComponent implements OnInit {

  constructor(public dialog: MatDialog, private lms: LeadManagementService,
    private datePipe: DatePipe, private needed: NeededService) {
    this.frameworkComponents = {
      buttonRenderer: AGGridButtonRendererComponent,
    }
  }

  loading = false;
  showFilterScreen = true;
  templates: Array<LeadMailTemplate> = [];
  frameworkComponents: any;

  _lead_categorys: Array<string> = [];
  _industry_types: Array<string> = [];
  _lead_states: Array<string> = [];

  needed_loaded = false;

  _filters = {
    title: '',
    subject: '',
    message: '',
    status: [],
    frequency: [],
    categories: [],
    industryTypes: [],
    states: []
  }

  columnDefs = [
    {
      headerName: '', field: 'id', width: 40,
      cellRenderer: 'buttonRenderer',
      cellRendererParams: {
        onClick: this.openEditTemplateDialog.bind(this),
        label: null
      }
    },
    {
      headerName: '', field: 'id', width: 40,
      cellRenderer: 'buttonRenderer',
      cellRendererParams: {
        onClick: this.openCopyTemplateDialog.bind(this),
        label: null,
        iconURL: "<i class='fa fa-clone text-primary'></i>"
      }
    },
    { headerName: 'Id', field: 'id', sortable: true, filter: true, resizable: true, width: 60 },
    { headerName: 'Title', field: 'title', sortable: true, filter: true, resizable: true, tooltip: (data) => { return data.value } },
    { headerName: 'Subject', field: 'subject', sortable: true, filter: true, resizable: true, tooltip: (data) => { return data.value } },
    { headerName: 'Category', field: 'category', sortable: true, filter: true, resizable: true, tooltip: (data) => { return data.value } },
    { headerName: 'Industry Type', field: 'industryType', sortable: true, filter: true, resizable: true, tooltip: (data) => { return data.value } },
    { headerName: 'State', field: 'state', sortable: true, filter: true, resizable: true, tooltip: (data) => { return data.value } },
    { headerName: 'Status', field: 'status', sortable: true, filter: true, resizable: true, tooltip: (data) => { return data.value } },
    { headerName: 'Frequency', field: 'frequency', sortable: true, filter: true, resizable: true, tooltip: (data) => { return data.value } },
    {
      headerName: 'Enabled', field: 'enabled', width: 100, sortable: true, filter: true, resizable: true, cellRenderer: (data) => {
        if (data.value == true)
          return `<i class="far fa-check-circle text-success"></i>`;
        else
          return `<i class="far fa-times-circle text-danger"></i>`;
      }
    },
    {
      headerName: 'Created Date', field: 'createddatetime', sortable: true, resizable: true, cellRenderer: (data) => {
        return this.datePipe.transform(data.value, 'medium');
      }
    },
    {
      headerName: 'Last Updated Date', field: 'lastupdatedatetime', sortable: true, resizable: true, cellRenderer: (data) => {
        return this.datePipe.transform(data.value, 'medium');
      }
    }
  ];

  ngOnInit() {
    this.loading = true;
    this.needed.loadNeeded(['lead_industry_type', 'lead_categorys', 'lead_states']).subscribe(resp => {
      this.loading = false;
      if (resp['StatusCode'] == '00') {
        this._lead_categorys = resp['lead_categorys'];
        this._industry_types = resp['lead_industry_type'];
        this._lead_states = resp['lead_states'];
        this.needed_loaded = true;
      }
    }, error => this.loading = false);

    this.searchLeadMailTemplates();
  }

  openEditTemplateDialog(data) {
    if (data.rowData) {
      this.openMailTemplateCreate(data.rowData, 'Edit');
    }
  }

  openCopyTemplateDialog(data) {
    if (data.rowData) {
      this.openMailTemplateCreate(data.rowData, 'Copy');
    }
  }

  openMailTemplateCreate(template?: LeadMailTemplate, mode: string = 'Create') {
    console.log(template);
    const dialogRef = this.dialog.open(LeadMailTemplateCreateComponent, {
      width: window.innerWidth + 'px',
      minHeight: 'calc(100vh - 90px)',
      height: 'auto',
      data: {
        mode: mode, template: Object.assign({}, template),
        lead_categorys: this._lead_categorys,
        industry_types: this._industry_types, lead_states: this._lead_states
      }
    });

    dialogRef.afterClosed().subscribe(result => {
      console.log(result);
      if (result === undefined || result == '')
        return;
      console.log("result['action']", result['action']);
      if (result['action'] == 'LeadMailTemplate Updated') {
        this.searchLeadMailTemplates();
      } else if (result['action'] == 'LeadMailTemplate Deleted') {
        this.searchLeadMailTemplates();
      }
    });
  }

  searchLeadMailTemplates() {
    this.loading = true;
    this.lms.searchLeadMailTemplates(this._filters).subscribe(resp => {
      this.loading = false;
      if (resp['StatusCode'] == '00') {
        this.templates = resp['LeadMailTemplates'];
      }
    }, error => this.loading = false)
  }

  clearFilters() {
    this._filters = {
      title: '',
      subject: '',
      message: '',
      status: [],
      frequency: [],
      categories: [],
      industryTypes: [],
      states: []
    }
  }
}
