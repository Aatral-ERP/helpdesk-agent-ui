import { Component, OnInit } from '@angular/core';
import { IDropdownSettings } from 'ng-multiselect-dropdown';
import { TicketService } from 'src/app/_services/ticket.service';
import { InstituteService } from 'src/app/_services/institute.service';
import { Contact } from './Contact';
import { ToastrService } from 'ngx-toastr';
import { Router, ActivatedRoute } from '@angular/router';
import Swal from 'sweetalert2';
import { SalesService } from 'src/app/_services/sales.service';
import { AuthService } from 'src/app/_services/auth.service';
import { InvoiceService } from 'src/app/_services/invoice.service';
import { environment } from 'src/environments/environment';
import { MatSnackBar } from '@angular/material';
import { RoleMaster } from 'src/app/_admin/role-create/RoleMaster';

@Component({
  selector: 'app-institute-detail',
  templateUrl: './institute-detail.component.html',
  styleUrls: ['./institute-detail.component.css']
})
export class InstituteDetailComponent implements OnInit {

  constructor(private ts: TicketService, private ss: SalesService, private is: InstituteService,
    public auth: AuthService, private route: Router, private tst: ToastrService,
    private actRoute: ActivatedRoute, private invServ: InvoiceService, private snackbar: MatSnackBar) {
    actRoute.queryParams.subscribe(params => {
      console.log(params);
      if (params['iid']) {
        if (this._institutes.length > 0) {
          this._institutes
            .filter(inst => inst.instituteId === this._selectedInstitute[0].instituteId)
            .forEach(inst => this._selectedInstitute = [{ instituteId: inst.instituteId, instituteName: inst.instituteName }]);
        } else {
          this._selectedInstitute = [{ instituteId: params['iid'], instituteName: '' }];
        }

        this.onSelect(this._selectedInstitute[0]);
      }
    })
  }
  showAddContact = false;
  showEmailError = false;
  showNumberError = false;
  addContact: Contact = new Contact();
  iid = '';
  _institutes = [];
  _selectedInstitute = [];
  dropdownList = [];

  _inst_details: any = {};
  instituteProducts = [];
  instituteContacts = [];
  tickets = [];
  invoices = [];
  role: RoleMaster = this.auth.getLoggedInRole();

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
      if (this._selectedInstitute.length > 0) {
        this._institutes
          .filter(inst => inst.instituteId === this._selectedInstitute[0].instituteId)
          .forEach(inst => this._selectedInstitute = [{ instituteId: inst.instituteId, instituteName: inst.instituteName }]);
      }
    })
  }

  getAllInstitutionTickets(inst) {
    this.ts.getAllInstitutionTickets(inst).subscribe(res => {
      if (res['StatusCode'] == '00') {
        this.tickets = res['Tickets'];
        console.log(this.tickets);
        this.tickets.sort((a, b) => b.ticketId - a.ticketId);
      }
    })
  }

  getInstituteProducts(inst) {
    this.ts.getInstituteProducts(inst).subscribe(res => {
      if (res['StatusCode'] == '00') {
        this.instituteProducts = res['InstituteProducts'];
        console.log(this.instituteProducts);
      }
    })
  }

  getInstitutionDetails(inst) {
    this.is.getInstituteDetails(inst).subscribe(res => {
      console.log(res);
      if (res['StatusCode'] == '00') {
        this._inst_details = res['Institute'];
        console.log(this.instituteProducts);
      }
    })
  }

  getAllInstituteContacts(inst) {
    this.is.getAllInstituteContacts(inst).subscribe(res => {
      console.log(res);
      if (res['StatusCode'] == '00') {
        this.instituteContacts = res['InstituteContacts'];
        console.log(this.instituteProducts);
      }
    })
  }

  loadInvoices(inst) {

    const _search_filters = {
      dealProducts: [],
      institutes: [inst],
      agents: [],
      dealType: '',
      invoiceNo: '',
      invoiceSubject: '',
      invoiceDueDateObject: null,
      invoiceDueDateFrom: null,
      invoiceDueDateTo: null,
      invoiceDateObject: null,
      invoiceDateFrom: null,
      invoiceDateTo: null,
      invoiceStatus: '',
      gstMonth: '',
      gstYear: ''
    }

    this.invServ.loadInvoicesReport(_search_filters).subscribe(res => {
      this.invoices = res['DealInvoices'];
    });
  }

  onSelectInstitute(inst) {
    this.route.navigateByUrl('/institute/institute-detail?iid=' + inst.instituteId);
  }

  onSelect(inst) {
    this.instituteProducts = [];
    this.tickets = [];
    this.addContact.instituteId = inst['instituteId'];
    this.addContact.isBlocked = 0;
    this.getAllInstitutionTickets(inst);
    this.getInstitutionDetails(inst);
    this.getInstituteProducts(inst);
    this.getAllInstituteContacts(inst);
    this.loadInvoices(inst);
  }

  editInstDetails(instituteId) {
    this.route.navigateByUrl('/institute/register?edit=1&iid=' + instituteId);
  }

  deleteInstDetails(instituteId) {

    this.is.getInstitutePreDeleteData({ instituteId: instituteId }).subscribe(resp => {

      if (resp['Counts']['institute_count'] == '1') {

        let _text = '<pre>This Institute contains \r\n'
          + resp['Counts']['institute_products_count'] + ' Service(s) \r\n'
          + resp['Counts']['institute_contact_count'] + ' Contact(s) \r\n'
          + resp['Counts']['amc_details_count'] + ' AMC Detail(s) \r\n'
          + resp['Counts']['deals_count'] + ' Deal(s) \r\n'
          + resp['Counts']['tickets_count'] + ' Ticket(s) \r\n\r\n' + 'This will delete all associated data.</pre>';

        Swal.fire({
          title: 'Are you sure?',
          html: _text,
          icon: 'warning',
          showCancelButton: true,
          confirmButtonColor: '#3085d6',
          cancelButtonColor: '#d33',
          confirmButtonText: 'Yes'
        }).then((result) => {
          if (result.value) {
            this.deleteInstitute(instituteId);
          }
        })

      } else {
        this.tst.info('', 'No Institute Found');
      }

    });
  }

  deleteInstitute(instituteId) {
    this.tst.info('Deleting...');
    this.is.deleteInstitute({ instituteId: instituteId }).subscribe(resp => {
      if (resp['StatusCode'] == '00') {

        Swal.fire({
          title: 'Success',
          html: 'Deleted All Institute Datas successfully.',
          icon: 'success',
          showCancelButton: false,
          confirmButtonColor: '#3085d6',
          confirmButtonText: 'Okay'
        }).then((result) => {
          if (result.value) {
            window.location.href = './institute/institute-detail'
          }
        })

      } else if (resp['StatusCode']) {
        this.tst.show(resp['StatusCode']);
      } else {
        this.tst.show('Something went wrong, Try again later.');
      }
    })
  }

  saveContact() {
    !(this.is.validateEmail(this.addContact.emailId)) ? this.showEmailError = true : this.showEmailError = false;
    !(this.is.validatePhoneNumber(this.addContact.phone)) ? this.showNumberError = true : this.showNumberError = false;

    console.log(this.addContact);
    if (this.addContact.isBlocked == true || this.addContact.isBlocked == 1)
      this.addContact.isBlocked = 1;
    else
      this.addContact.isBlocked = 0;
    if (this.showEmailError || this.showNumberError) {
      return;
    } else {
      this.is.saveContact(this.addContact).subscribe(res => {
        if (res['StatusCode'] == '00') {
          this.getAllInstituteContacts(this._selectedInstitute[0]);
          this.showAddContact = false;
          this.addContact = new Contact();
        } else {
          this.tst.error('', res['StatusDesc']);
        }
      })
    }
  }

  sendDetails() {
    console.log("Inside sendDetails:::");
    !(this.is.validateEmail(this.addContact.emailId)) ? this.showEmailError = true : this.showEmailError = false;
    !(this.is.validatePhoneNumber(this.addContact.phone)) ? this.showNumberError = true : this.showNumberError = false;

    console.log(this.addContact);
    if (this.addContact.isBlocked == true || this.addContact.isBlocked == 1)
      this.addContact.isBlocked = 1;
    else
      this.addContact.isBlocked = 0;

    if (this.showEmailError || this.showNumberError) {
      return;
    } else {
      this.is.sendDetails(this.addContact).subscribe(res => {
        if (res['StatusCode'] == '00') {
          this.getAllInstituteContacts(this._selectedInstitute[0]);
          this.showAddContact = false;
          this.addContact = new Contact();
        } else {
          this.tst.error('', res['StatusDesc']);
        }
      })
    }
  }

  viewSatisfactoryCertificatePDF(invoice) {
    let url = environment.apiUrl + 'download/download-invoice-pdf/view/' + invoice.id + '/' + invoice.satisfactoryCertificate;
    window.open(url, 'winname', 'directories=no,titlebar=no,toolbar=no,location=no,status=no,menubar=no,scrollbars=no,resizable=no,width=auto,height=auto');
  }

  viewWorkCompletionCertificatePDF(invoice) {
    let url = environment.apiUrl + 'download/download-invoice-pdf/view/' + invoice.id + '/' + invoice.workCompletionCertificate;
    window.open(url, 'winname', 'directories=no,titlebar=no,toolbar=no,location=no,status=no,menubar=no,scrollbars=no,resizable=no,width=auto,height=auto');
  }

  downloadWorkCompletionCertificatePDF(invoice) {
    console.log(invoice);
    let url = environment.apiUrl + 'download/download-invoice-pdf/download/' + invoice.id + '/' + invoice.workCompletionCertificate;
    console.log(url);
    window.open(url, '_blank');
  }

  downloadSatisfactoryCertificatePDF(invoice) {
    console.log(invoice);
    let url = environment.apiUrl + 'download/download-invoice-pdf/download/' + invoice.id + '/' + invoice.satisfactoryCertificate;
    console.log(url);
    window.open(url, '_blank');
  }

  satisfactoryFileUploadChange(file: File, invoice) {
    console.log(file);

    Swal.fire({
      title: 'Are you sure?',
      text: "You want to Upload.",
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#3085d6',
      cancelButtonColor: '#d33',
      confirmButtonText: 'Yes, Upload!'
    }).then((result) => {
      if (result.value) {
        this.snackbar.open('Uploading ' + file.name);
        this.invServ.UploadInvoiceSatisfactoyPDF(invoice.id, file).subscribe(res => {
          if (res['StatusCode'] == '00') {
            invoice.satisfactoryCertificate = res['DealInvoice']['satisfactoryCertificate'];
            this.snackbar.open('Uploaded ' + file.name, 'OK');
            if (invoice.satisfactoryCertificate.endsWith(".pdf"))
              this.viewSatisfactoryCertificatePDF(invoice);
          } else {
            this.snackbar.open('Something went wrong! Cannot upload ' + file.name);
          }
        })
      }
    })
  }

  workCompletionFileUploadChange(file: File, invoice) {
    console.log(file);

    Swal.fire({
      title: 'Are you sure?',
      text: "You want to Upload.",
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#3085d6',
      cancelButtonColor: '#d33',
      confirmButtonText: 'Yes, Upload!'
    }).then((result) => {
      if (result.value) {
        this.snackbar.open('Uploading ' + file.name);
        this.invServ.UploadInvoiceWorkCompletionPDF(invoice.id, file).subscribe(res => {
          if (res['StatusCode'] == '00') {
            invoice.workCompletionCertificate = res['DealInvoice']['workCompletionCertificate'];
            this.snackbar.open('Uploaded Successfully', 'OK');
            if (invoice.workCompletionCertificate.endsWith(".pdf"))
              this.viewWorkCompletionCertificatePDF(invoice);
          } else {
            this.snackbar.open('Something went wrong! Cannot upload ' + file.name);
          }
        })
      }
    })
  }

  routeToCreateDeal() {
    this.route.navigate(['/sales/deals/create'], { queryParams: { 'create-institute-deal': 1, iid: this._inst_details.instituteId } })
  }

  editContact(ic) {
    console.log(ic);
    this.showAddContact = true;
    this.addContact = Object.assign({}, ic);
  }
}