import { Component, OnInit } from '@angular/core';
import { AddTicket } from './AddTicket';
import { TicketService } from 'src/app/_services/ticket.service';
import { ToastrService } from 'ngx-toastr';
import { Router, ActivatedRoute } from '@angular/router';
import { InstituteService } from 'src/app/_services/institute.service';
import { AuthService } from 'src/app/_services/auth.service';
import { AngularEditorConfig } from '@kolkov/angular-editor';
import { Base64 } from 'js-base64';
import { IDropdownSettings } from 'ng-multiselect-dropdown';
import { Institute } from 'src/app/_onboard/inst-registration/institute';

@Component({
  selector: 'app-add-ticket',
  templateUrl: './add-ticket.component.html',
  styleUrls: ['./add-ticket.component.css']
})
export class AddTicketComponent implements OnInit {
  constructor(private ts: TicketService, private is: InstituteService, private tst: ToastrService,
    private route: Router, public auth: AuthService, private actRoute: ActivatedRoute) {
  }
  ticket: AddTicket = new AddTicket;
  submitInProgress = false;
  selectedinstitute = '';
  _selectedinst = [];
  InstProducts = [];
  institute: Array<Institute> = [];
  files = [];
  gmailTicket: any = null;

  _email_ids: Array<string> = [];
  _updates_email_ids: Array<string> = [];
  _emailUpdates = '';

  loading = false;
  serviceTypeList = [];

  _instituteDropdownSettings: IDropdownSettings = {
    singleSelection: true,
    idField: 'instituteId',
    textField: 'instituteName',
    itemsShowLimit: 10,
    allowSearchFilter: true,
    closeDropDownOnSelection: true
  };

  editorConfig: AngularEditorConfig = {
    editable: true,
    spellcheck: true,
    height: 'auto',
    minHeight: '400',
    maxHeight: 'auto',
    width: 'auto',
    minWidth: '0',
    translate: 'yes',
    enableToolbar: true,
    showToolbar: true,
    placeholder: 'Add Summary about the ticket',
    defaultParagraphSeparator: '',
    defaultFontName: '',
    defaultFontSize: '',
    fonts: [
      { class: 'arial', name: 'Arial' },
      { class: 'times-new-roman', name: 'Times New Roman' },
      { class: 'calibri', name: 'Calibri' },
      { class: 'comic-sans-ms', name: 'Comic Sans MS' }
    ],
    customClasses: [],
    uploadUrl: 'v1/image',
    uploadWithCredentials: false,
    sanitize: true,
    toolbarPosition: 'top',
    toolbarHiddenButtons: [
      [],
      ['insertImage', 'insertVideo', 'insertHorizontalRule', 'backgroundColor', 'textColor',
        'customClasses', 'link', 'unlink',]
    ]
  };
  ngOnInit() {

    this.loadInstitute();
    this.ticket = this.ts.getAddTicketEmptyEntity();
    this.actRoute.queryParams.subscribe(params => {
      console.log(params);
      if (params['edit'] && params['edit'] == 1) {
        if (params['tdtype'] == 'gmailAsTicket') {
          let _gmt: any = JSON.parse(Base64.decode(params['td']));
          this.gmailTicket = _gmt;
          console.log(_gmt);
          this.ticket.subject = _gmt['subject'];
          this.ticket.summary = _gmt['summary'];
          this.ticket.institute = _gmt['institute'];
          this.ticket.instituteId = this.ticket.institute.instituteId;
          this.selectedinstitute = this.ticket.institute.instituteId;
          this.ticket.emailId = _gmt['emailId'];
          this.ticket.emailUpdates = _gmt['emailUpdates'];

          this._selectedinst = [{ instituteId: this.ticket.institute.instituteId, instituteName: this.ticket.institute.instituteName }];
        } else if (params['tdtype'] == 'ticketedit') {
          let _ticket: any = JSON.parse(Base64.decode(params['td']));
          console.log(_ticket);
          this.ticket = _ticket;
          this.ticket.institute = _ticket['institute'];
          this.ticket.instituteId = this.ticket.institute.instituteId;
          this.ticket.product = _ticket.product;
          this.selectedinstitute = this.ticket.institute.instituteId;

          this._selectedinst = [{ instituteId: this.ticket.institute.instituteId, instituteName: this.ticket.institute.instituteName }];
        }
        this.getInstituteProducts();
      }
    })
  }

  loadInstitute() {
    this.loading = true;
    this.institute = [];
    this.ts.getTicketsReportData().subscribe(res => {
      this.loading = false;
      this.institute = res['Institutes'];
      this.serviceTypeList = res['ServiceTypes'];
      let _agents = res['Agents']

      let email_ids: Set<string> = new Set();

      _agents.forEach(agent => {
        if (this.auth.validateEmail(agent.emailId)) {
          email_ids.add(agent.emailId);
        }
      })

      this.institute.forEach(inst => {
        if (this.auth.validateEmail(inst.emailId)) {
          email_ids.add(inst.emailId);
        }
        if (this.auth.validateEmail(inst.alternateEmailId)) {
          email_ids.add(inst.alternateEmailId);
        }
      })

      this._email_ids = Array.from(email_ids);

      console.log(this._email_ids);

      this._selectedinst = [];
      this.institute.filter(inst => inst.instituteId == this.selectedinstitute).forEach(inst => this._selectedinst.push(inst));

    }, error => { console.log(error); this.loading = false; });
  }

  clear() {
    window.location.href = './add-ticket';
  }

  getInstituteProducts() {
    this.institute.forEach(insts => {
      if (insts.instituteId == this.selectedinstitute) {
        this.ticket.institute = insts;
        this.ticket.instituteId = insts['instituteId'];
        this.ticket.instituteName = insts['instituteName'];
        this.ticket.serviceUnder = insts['serviceUnder'];
        this.ticket.emailId = insts['emailId'];
      }
    })

    this.loading = true;
    this.InstProducts = [];
    this.is.getInstituteProducts(this.selectedinstitute).subscribe(res => {
      this.loading = false;
      console.log(res);
      if (res['StatusCode'] == '00') {

        this.InstProducts = res['InstituteProducts'];

        if (this.InstProducts.length > 0) {
          let _i_product = this.InstProducts[0];
          this.ticket.product = _i_product.product.name;
          this.ticket.serviceUnder = _i_product.currentServiceUnder;
          console.log(_i_product);
          console.log(this.ticket);
        }
      }
    }, error => this.loading = false)
  }

  saveGmailAsTicket() {
    console.log(this.ticket);

    if (this.ticket.subject == '') {
      this.tst.info('Subject Cannot be empty');
      return;
    } else if (this.ticket.serviceType == '') {
      this.tst.info('Service Type Cannot be empty');
      return;
    } else if (this.ticket.emailId == '') {
      this.tst.info('Email Id Cannot be empty');
      return;
    }

    let errorText = "";
    if (!this.auth.validateEmail(this.ticket.emailId.toString()))
      errorText = errorText + '\rInvalid EmailId';
    if (errorText.length > 0) {
      this.tst.error(errorText);
      return;
    }
    console.log(this.ticket);

    this.submitInProgress = true;

    let _ticket = Object.assign({}, this.ticket);
    _ticket.subject = Base64.encode(_ticket.subject);
    _ticket.summary = Base64.encode(_ticket.summary);

    let _gmailTicket = Object.assign({}, this.gmailTicket);
    _gmailTicket.summary = Base64.encode(_gmailTicket.summary);

    this.ts.saveGmailAsTicket(_ticket, _gmailTicket).subscribe(res => {
      console.log(res);
      if (res['StatusCode'] == '00') {
        if (this.files.length > 0) {
          this.uploadAttachments(res);
        } else {
          this.submitInProgress = false;
          this.tst.success('Ticket Raised Successfully');
          this.route.navigateByUrl('/view-ticket/' + res['Ticket']['ticketId']);
        }
      } else {
        this.tst.error('Something went wrong');
      }
    });

  }

  EditTicket() {
    console.log(this.ticket);

    if (this.ticket.subject == '') {
      this.tst.info('Subject cannot be empty');
      return;
    } else if (this.ticket.serviceUnder == '') {
      this.tst.info('Service Under cannot be empty');
      return;
    } else if (this.ticket.emailId === undefined || this.ticket.emailId == null || this.ticket.emailId == '') {
      this.tst.info('Email Id cannot be empty');
      return;
    } else if (this.ticket.instituteId == '') {
      this.tst.info('Institute cannot be empty');
      return;
    } else if (this.ticket.product == '') {
      this.tst.info('Product cannot be empty');
      return;
    }

    let errorText = "";
    if (!this.auth.validateEmail(this.ticket.emailId.toString()))
      errorText = errorText + '\rInvalid EmailId';
    if (errorText.length > 0) {
      this.tst.error(errorText);
      return;
    }
    console.log(this.ticket);

    this.submitInProgress = true;

    let _ticket = Object.assign({}, this.ticket);
    _ticket.subject = Base64.encode(_ticket.subject);
    _ticket.summary = Base64.encode(_ticket.summary);

    this.ts.updateTicket(_ticket).subscribe(res => {
      console.log(res);
      if (res['StatusCode'] == '00') {
        if (this.files.length > 0) {
          this.uploadAttachments(res);
        } else {
          this.submitInProgress = false;
          this.tst.success('Ticket Raised Successfully');
          this.route.navigateByUrl('/view-ticket/' + _ticket['ticketId']);
        }
      } else {
        this.tst.error('Something went wrong');
      }
    });

  }

  AddTicket() {
    console.log(this.ticket);

    if (this.ticket.subject == '') {
      this.tst.info('Subject cannot be empty');
      return;
    } else if (this.ticket.serviceUnder == '') {
      this.tst.info('Service Under cannot be empty');
      return;
    } else if (this.ticket.emailId === undefined || this.ticket.emailId == null || this.ticket.emailId == '') {
      this.tst.info('Email Id cannot be empty');
      return;
    } else if (this.ticket.instituteId == '') {
      this.tst.info('Institute cannot be empty');
      return;
    } else if (this.ticket.product == '') {
      this.tst.info('Product cannot be empty');
      return;
    }

    let errorText = "";
    if (!this.auth.validateEmail(this.ticket.emailId.toString()))
      errorText = errorText + '\rInvalid EmailId';
    if (errorText.length > 0) {
      this.tst.error(errorText);
      return;
    }
    console.log(this.ticket);

    this.submitInProgress = true;
    this.ts.AddTicket(this.ticket).subscribe(res => {
      console.log(res);
      if (res['StatusCode'] == '00') {
        if (this.files.length > 0) {
          this.uploadAttachments(res);
        } else {
          this.submitInProgress = false;
          this.tst.success('Ticket Raised Successfully');
          this.route.navigateByUrl('/view-ticket/' + res['Ticket']['ticketId']);
        }
      } else {
        this.tst.error('Something went wrong');
      }
    }, error => this.submitInProgress = false);
  }

  uploadAttachments(res) {
    let successCount = 0; let failedCount = 0;
    this.files.forEach(file => {
      let ticket = res['Ticket']
      // this.ts.AddTicketAttachment(ticket['ticketId'], file).subscribe(rs => {
      //   console.log(rs);
      // });

      this.ts.AddTicketAttachment(ticket.ticketId, file).subscribe(rs => {
        successCount = successCount + 1;
        this.finishAddAttachmentResponse(this.files.length, successCount, failedCount, ticket['ticketId']);
      }, error => {
        failedCount = failedCount + 1;
        this.finishAddAttachmentResponse(this.files.length, successCount, failedCount, ticket['ticketId']);
      });

    })
  }


  finishAddAttachmentResponse(totalCount, successCount, failedCount, ticketId) {
    let successFailedCount = +successCount + +failedCount;
    console.log(totalCount, successCount, failedCount, totalCount == successFailedCount)
    if (totalCount == successFailedCount) {
      this.submitInProgress = false;
      this.tst.success('Ticket Raised Successfully');
      this.route.navigateByUrl('/view-ticket/' + ticketId);
    }
  }

  public fileChange(event) {
    this.files = [];
    console.log(event);
    if (event.target && event.target.files) {
      console.log("Inside Event Target");
      const selectedFile: Array<any> = event.target.files;
      console.log(selectedFile.length);
      selectedFile.forEach(file => {
        this.files.push(file);
      })
    }
    console.log(this.files.length, this.files);
  }

  serviceUnderByProduct() {
    console.log(this.ticket.product);

    this.InstProducts.forEach(ip => {
      if (this.ticket.product == ip.product.name) {
        this.ticket.serviceUnder = ip.currentServiceUnder;
      }
    })
  }

  prepareEmailUpdatesAutoComplete(_event) {
    console.log(_event);
    if (_event != undefined && _event != null && _event != '') {
      this._updates_email_ids = [];
      let _str = new String(_event).split(';')[0];
      console.log(_str);
      this._email_ids.forEach(email => {
        if (email.toLowerCase().includes(_str.toLowerCase())) {
          this._updates_email_ids.push(email);
        }
      })
    }
  }

  updateOptionSelected(_event) {
    console.log(_event);
    this.ticket.emailUpdates = this.ticket.emailUpdates + _event.option.value + ';';
    this._emailUpdates = '';
  }

  onEnterEmailUpdates() {
    console.log(this._emailUpdates);
    if (this.auth.validateEmail(this._emailUpdates)) {
      this.ticket.emailUpdates = this.ticket.emailUpdates + this._emailUpdates + ';';
      this._emailUpdates = '';
      this._updates_email_ids = [];
    }

  }
}
