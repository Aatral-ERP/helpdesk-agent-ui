import { Component, OnInit, TemplateRef, ViewChild } from '@angular/core';
import { LeadManagementService } from '../../_services/lead-management.service';
import { NeededService } from '../../_services/needed.service';
import { Agent } from '../../_profile/agent-profile/Agent';
import { Lead } from './Lead';
import { Product } from '../../_product/Product';
import { TeamsService } from '../../_services/teams.service';
import { NgxFileDropEntry, FileSystemFileEntry } from 'ngx-file-drop';
import { MatBottomSheet, MatBottomSheetRef, MatDialog, MatSnackBar } from '@angular/material';
import { HttpEventType } from '@angular/common/http';
import { ActivatedRoute, Router } from '@angular/router';

import { MomentDateAdapter, MAT_MOMENT_DATE_ADAPTER_OPTIONS } from '@angular/material-moment-adapter';
import { DateAdapter, MAT_DATE_FORMATS, MAT_DATE_LOCALE } from '@angular/material/core';
import { LeadContact } from '../lead-contact/LeadContact';
import { LeadContactCreateComponent } from '../lead-contact/lead-contact-create.component';
import { InstituteService } from 'src/app/_services/institute.service';
import { SalesService } from 'src/app/_services/sales.service';
import { IDropdownSettings } from 'ng-multiselect-dropdown';
import { MailProperties } from 'src/app/_admin/mail-setting-properties/MailProperties';
import { MailService } from 'src/app/_services/mail.service';

interface fileUpload {
  file: any;
  progress: number;
  status: string;
}

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
  selector: 'app-lead-create',
  templateUrl: './lead-create.component.html',
  styleUrls: ['./lead-create.component.css'],
  providers: [
    {
      provide: DateAdapter,
      useClass: MomentDateAdapter,
      deps: [MAT_DATE_LOCALE, MAT_MOMENT_DATE_ADAPTER_OPTIONS]
    },
    { provide: MAT_DATE_FORMATS, useValue: MY_FORMATS },
  ]
})
export class LeadCreateComponent implements OnInit {

  constructor(private lms: LeadManagementService, private needed: NeededService, private ts: TeamsService,
    private snackbar: MatSnackBar, private route: Router, private actRoute: ActivatedRoute,
    public dialog: MatDialog, private ss: SalesService, private is: InstituteService,
    private _bottomSheet: MatBottomSheet) {

    this.actRoute.queryParams.subscribe(params => {
      console.log(params);

      if (params['edit']) {
        if (params['edit'] == 1 && params['lid']) {
          this._mode = 'Edit';
          this.loadLeadForEdit(params['lid']);
        }
      }
    })
  }

  @ViewChild('templateBottomSheet', { static: false }) templateBottomSheet: TemplateRef<any>;
  _bottomSheetRef: MatBottomSheetRef<any>;
  _leadMailSettings: Array<MailProperties> = [];
  _leadMailSettingsLoading = false;
  _institutes = [];
  _selectedInstitute = [];
  dropdownList = [];
  showInstitute = false;

  saving = false;
  loading = false;
  _mode = 'Create';
  leadContacts: Array<LeadContact> = [];
  _agents: Array<Agent> = [];
  _lead_sources: Array<string> = [];
  _industry_types: Array<string> = [];
  _lead_categorys: Array<string> = [];
  _products: Array<Product> = [];
  _states: Array<string> = [];
  _lead_cities: Array<string> = [];
  _lead_countries: Array<string> = [];

  _lead_institutes: Array<string> = [];
  _lead_titles: Array<string> = [];

  _selected_products: Array<string> = [];
  _predefined_lead_sources: Set<string> = new Set(['Advertisement', 'Trade Show', 'Sales Emails', 'Online Store', 'Referral', 'Partner', 'Cold Call', 'Seminar', 'Social Media']);
  directoryName = 'temp-files/' + this.ts.getRandomString(10);
  _productSTR: string = '';
  filesUploaded = 0;

  lead: Lead = new Lead();

  files: Array<fileUpload> = [];

  _errors = {
    owner: '',
    company: '',
    phone: '',
    altPhone: '',
    email: '',
    altEmail: '',
    website: '',
    state: ''
  }

  ngOnInit() {
    this.loading = true;
    this.needed.loadNeeded(['agents_min', 'products_min', 'lead_industry_type', 'lead_categorys', 'lead_mail_setting',
      'lead_sources', 'lead_companies', 'lead_cities', 'lead_countries', 'state_tin', 'lead_institutes', 'lead_titles'])
      .subscribe(resp => {
        this.loading = false;
        if (resp['StatusCode'] == '00') {
          this._agents = resp['agents_min'];
          this._products = resp['products_min'];
          this._lead_categorys = resp['lead_categorys'];
          this._states = resp['StateTinDetails'];
          this._lead_cities = resp['lead_cities'];
          this._lead_countries = resp['lead_countries'];
          this._lead_institutes = resp['lead_institutes'];
          this._lead_titles = resp['lead_titles'];
          this._leadMailSettings = resp['lead_mail_setting'];

          this.setMailSetting(this._leadMailSettings.find(setting => setting.configName == 'Leads'));

          let lead_sources_tmp: Array<string> = resp['lead_sources'];
          lead_sources_tmp.forEach(ls => this._predefined_lead_sources.add(ls))

          this._lead_sources = Array.from(this._predefined_lead_sources);

          this._industry_types = resp['lead_industry_type'];
        }
      }, error => this.loading = false)
    this.loadInstituteDetails();
  }

  loadLeadForEdit(leadId) {

    this.loading = true;
    this.lms.getLead(leadId).subscribe(resp => {
      this.loading = false;
      if (resp['StatusCode'] == "00") {
        if (resp['Lead'] != null) {
          this.lead = resp['Lead'];
          this.leadContacts = resp['LeadContacts'];
        } else {
          this.snackbar.open('Lead not found for id #' + leadId);
        }
      } else if (resp['StatusCode'] == '03') {
        this.snackbar.open(resp['StatusDesc']);
      } else {
        this.snackbar.open('Something went wrong');
      }
    }, error => this.loading = false)
  }

  addContact(contact = new LeadContact()) {
    const dialogRef = this.dialog.open(LeadContactCreateComponent, {
      width: window.innerWidth + 'px',
      minHeight: 'calc(100vh - 90px)',
      height: 'auto',
      data: { leadContact: Object.assign({}, contact) }
    });

    dialogRef.afterClosed().subscribe(result => {
      console.log(result);
      if (result !== undefined && result['action'] == 'Lead Created_Updated') {
        let contact_created_updated = result['LeadContact'];
        let existed_index = this.leadContacts.findIndex(lc => lc.id == contact_created_updated.id);
        if (contact_created_updated['id'] == 0)
          this.leadContacts.push(contact_created_updated);
        else
          this.leadContacts[existed_index] = contact_created_updated;
      }
    });
  }

  saveLead() {

    this.checkOwner(); this.checkCompany(); //this.checkPhone(); this.checkEmail(); this.checkURL();

    if (this._errors.owner || this._errors.company || this._errors.phone || this._errors.email || this._errors.website) {
      this.snackbar.open('Please Check Errors');
      return;
    }

    let fileNames = '';
    if (this.files.length > 0) {
      this.files.forEach(file => {
        fileNames = fileNames + file.file.name + ';';
      });
      this.lead.files = fileNames;
    }
    this.saving = true;
    this.lms.createLead(this.lead, this.leadContacts, this.directoryName).subscribe(resp => {
      this.saving = false;
      if (resp['StatusCode'] == "00") {
        this.snackbar.open('Saved Successfully');
        this.route.navigateByUrl('/lead-management/overview/' + resp['Lead']['id']);
      } else if (resp['StatusCode'] == '03') {
        this.snackbar.open(resp['StatusDesc']);
      } else {
        this.snackbar.open('Something went wrong');
      }
    })
  }

  clear() {
    window.location.href = './lead-management/create';
  }

  productSelected(_event?: string) {
    console.log(_event);
    if (_event !== undefined && _event != null && _event.trim() != '') {

      let prods: Array<string> = this.lead.products.split(';');

      if (prods.find(_prd => _prd == _event) === undefined) {
        if (this.lead.products.length > 0)
          this.lead.products = this.lead.products + ';';

        this.lead.products = this.lead.products + _event;
      }

      this._productSTR = '';
      console.log(":::" + this.lead.products, this._productSTR);
    }
    console.log(this.lead.products);
  }

  removeProduct(_event) {
    let prods: Array<string> = this.lead.products.split(';');
    let _new_prods = [];

    prods.forEach(_prod => {
      if (_prod != _event) {
        _new_prods.push(_prod);
      }
    })

    this.lead.products = '';

    _new_prods.forEach(_prod => {
      if (this.lead.products.length > 0)
        this.lead.products = this.lead.products + ';';

      this.lead.products = this.lead.products + _prod;
    })

    console.log(this.lead.products);
  }

  getProductsAsArray() {
    if (this.lead.products !== undefined && this.lead.products != null && this.lead.products != '')
      return this.lead.products.split(';');
    else
      return [];
  }

  displayNull() {
    this._productSTR = '';
    return null;
  }

  checkOwner() {
    let _owner = this._agents.find(agent => agent.firstName.toLowerCase() + ' ' + agent.lastName.toLowerCase() == this.lead.ownerName.toLowerCase());
    if (_owner === undefined) {
      this._errors.owner = 'Lead Owner is not valid';
    } else {
      this._errors.owner = '';
      this.lead.ownerEmailId = _owner.emailId;
    }
  }

  checkState() {
    // let __state = this._states.find(st => st.toLowerCase() == this.lead.state.toLowerCase());
    // if (__state === undefined) {
    //   this._errors.state = 'State is not valid';
    // } else {
    //   this._errors.state = '';
    //   this.lead.state = __state;
    //}
  }

  checkCompany() {
    if (this.lead.company == '') {
      this._errors.company = 'Company is not valid';
    } else {
      this._errors.company = '';
    }
  }

  checkURL() {
    if (this.lead.website != '') {
      if (!this.lms.util.validateWebsiteURL(this.lead.website))
        this._errors.website = 'Website URL is not valid. (e.g. http://www.google.com)';
      else
        this._errors.website = '';
    } else {
      this._errors.website = '';
    }
  }

  public filesDrop: NgxFileDropEntry[] = [];

  public dropped(files: NgxFileDropEntry[]) {
    console.log(files);

    this.filesDrop = files;
    for (const droppedFile of this.filesDrop) {

      // Is it a file?
      if (droppedFile.fileEntry.isFile) {
        const fileEntry = droppedFile.fileEntry as FileSystemFileEntry;
        fileEntry.file((file: File) => {

          if (file.size > 26214400) {
            this.snackbar.open(`File is exceeds limit 25MB`);
          } else {

            console.log(droppedFile.relativePath, file);

            let _file_upload: fileUpload = {
              file: file,
              progress: 0,
              status: 'uploading'
            }

            this.files.push(_file_upload);

            this.lms.uploadLeadAttachment(file, this.directoryName)
              .subscribe(resp => {
                if (resp.type == HttpEventType.UploadProgress) {
                  _file_upload.progress = Math.round(100 * resp.loaded / resp.total);
                }
                if (resp.type === HttpEventType.Response) {
                  console.log('Upload complete');
                  _file_upload.status = 'Uploaded';
                  this.filesUploaded = this.filesUploaded + 1;
                }
              });
          }
        });
      }
    }
  }


  _instituteDropdownSettings: IDropdownSettings = {
    singleSelection: true,
    idField: 'instituteId',
    textField: 'instituteName',
    itemsShowLimit: 10,
    allowSearchFilter: true,
    closeDropDownOnSelection: true
  };

  loadInstituteDetails() {
    this.ss.getSalesNeededData(['institutes']).subscribe(res => {
      console.log(res);
      this._institutes = res['Institutes'];
      if (this._selectedInstitute.length > 0) {
        this._institutes
          .filter(inst => inst.instituteId === this._selectedInstitute[0].instituteId)
          .forEach(inst => this._selectedInstitute = [{ instituteId: inst.instituteId, instituteName: inst.instituteName }]);
      }
    })
  }

  onSelectInstitute(inst) {
    // this.route.navigateByUrl('/institute/institute-detail?iid=' + inst.instituteId);
    this.is.getInstituteDetails(inst).subscribe(res => {

      console.log(res);

      this.lead.company = res['Institute']['instituteName'];
      this.lead.industryType = res['Institute']['instituteType'];
      this.lead.street = res['Institute']['street1'] + ',' + res['Institute']['street2'];
      this.lead.city = res['Institute']['city'];
      this.lead.state = res['Institute']['state'];
      this.lead.country = res['Institute']['country'];
      this.lead.pincode = res['Institute']['zipcode'];


    })
  }

  openLeadMailSettingSheet() {
    this._bottomSheetRef = this._bottomSheet.open(this.templateBottomSheet);
  }

  closeLeadMailSettingSheet(setting: MailProperties) {
    this._bottomSheetRef.afterDismissed().subscribe(() => {
      console.log('Bottom sheet has been dismissed.', setting);
    });
    this.lead.mailSetting = '#' + setting.id + ' - ' + setting.configName + ' <' + setting.username + '>';
    this._bottomSheet.dismiss();
  }

  setMailSetting(setting: MailProperties) {
    this.lead.mailSetting = '#' + setting.id + ' - ' + setting.configName + ' <' + setting.username + '>';
  }


}
