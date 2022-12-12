import { Component, OnInit } from '@angular/core';
import Swal from 'sweetalert2';
import { AgentService } from 'src/app/_services/agent.service';
import { ActivatedRoute, Router } from '@angular/router';
import { InstituteService } from 'src/app/_services/institute.service';
import { Institute } from './institute';
import { SalesService } from 'src/app/_services/sales.service';
import { IDropdownSettings } from 'ng-multiselect-dropdown';
import { environment } from 'src/environments/environment';
import { MatSnackBar } from '@angular/material';
import { LeadManagementService } from 'src/app/_services/lead-management.service';
import { Lead } from 'src/app/_lead-management/lead-create/Lead';
declare var $: any;

@Component({
  selector: 'app-inst-registration',
  templateUrl: './inst-registration.component.html',
  styleUrls: ['./inst-registration.component.css']
})
export class InstRegistrationComponent implements OnInit {
  logoLoading = false;
  logoDiv = false;
  loading = false;
  loading_address = false;
  _address = [];
  logo = null;
  constructor(private as: AgentService, private is: InstituteService, private snackbar: MatSnackBar,
    private ss: SalesService, private route: Router, private actRoute: ActivatedRoute,
    private lms: LeadManagementService) {
    actRoute.queryParams.subscribe(params => {
      // console.log(params);
      if (params['edit'] == '1') {
        if (params['iid'] && params['iid'].toString() != '') {
          this.getInstitutionDetails(params['iid']);
        } else {
          this.loadNeeded();
        }
      } else if (params['prefill-from-lead'] == '1') {
        if (params['lid'] && params['lid'].toString() != '') {
          this.getPrefillFromLead(params['lid']);
        } else {
          this.loadNeeded();
        }
      } else {
        this.loadNeeded();
      }
    })
  }

  institutes: Array<Institute> = [];

  inst: Institute = new Institute();

  emptydata = [];
  _inst_data = [];
  _agents: Array<any> = [];
  agents: Array<any> = [];
  showInstExistsError = false;
  showEmailError = false;
  showAltEmailError = false;
  showNumberError = false;
  showAltNumberError = false;
  showGstError = false;
  showPinError = false;
  selectedFile = null;

  _AgentsDropdownSettings: IDropdownSettings = {
    singleSelection: false,
    idField: 'emailId',
    textField: 'name',
    itemsShowLimit: 10,
    allowSearchFilter: true,
    closeDropDownOnSelection: true
  };

  instituteTypes = [
    'Arts And Science College',
    'B.Ed.Colleges',
    'Engineering College',
    'Industry',
    'Law College',
    'Management Institutions',
    'Medical Institution',
    'Multinational - Software Companies',
    'Oversees',
    'Polytechnic College',
    'Public Libraries',
    'R&D Institutions',
    'School',
    'Special Institutions',
    'Speical Library',
    'University',
  ];

  stateData = [];

  ngOnInit() {
  }

  loadNeeded() {
    this.ss.getSalesNeededData(['institutes', 'institutes_types', 'agents', 'state_tin']).subscribe(res => {
      this._agents = res['Agents'];
      this.institutes = res['Institutes'];
      this.instituteTypes = res['InstitutesTypes'];
      let _stateData: Array<any> = res['StateTinDetails'];
      _stateData.forEach(state => this.stateData.push(state['stateName']));
      this.institutes.forEach(inst => { this._inst_data.push(inst.instituteName) });
      let _temp_agents = [];
      this._agents.forEach(agent => {
        agent.name = agent.firstName + " <" + agent.emailId + ">";
        this.agents
          .filter(_agnt => _agnt.emailId == agent.emailId)
          .forEach(_agnt => { _temp_agents.push({ emailId: agent.emailId, name: agent.name }); console.log(_agnt); });
      });

      this.agents = _temp_agents;
    });
  }

  save() {
    console.log(this.agents);
    this.inst.agents = '';
    this.agents.forEach(agent => this.inst.agents = agent.emailId + ';' + this.inst.agents)
    console.log(this.inst.agents);

    let _inst = this.institutes.find(inst => inst.instituteName.toLowerCase() == this.inst.instituteName.toLowerCase());

    (this.inst.instituteId == '0' && _inst !== undefined) ? this.showInstExistsError = true : this.showInstExistsError = false;
    !(this.is.validateEmail(this.inst.emailId)) ? this.showEmailError = true : this.showEmailError = false;
    !(this.is.validateEmail(this.inst.alternateEmailId)) ? this.showAltEmailError = true : this.showAltEmailError = false;
    !(this.is.validatePhoneNumber(this.inst.phone)) ? this.showNumberError = true : this.showNumberError = false;
    // !(this.is.validatePhoneNumber(this.inst.alternatePhone)) ? this.showAltNumberError = true : this.showAltNumberError = false;
    !(this.is.validateGstNumber(this.inst.gstno)) ? this.showGstError = true : this.showGstError = false;
    // !(this.is.validatePinCode(this.inst.zipcode)) ? this.showPinError = true : this.showPinError = false;

    if (this.showInstExistsError || this.showEmailError || this.showNumberError || this.showAltNumberError || this.showAltEmailError || this.showGstError || this.showPinError) {
      this.snackbar.open('Please check errors..');
      return;
    } else {

      this.as.saveInstitute(this.inst).subscribe(res => {
        if (res['StatusCode'] == '00') {
          Swal.fire('', res['StatusDesc'], "success");
          this.inst.instituteId = res['Institute']['instituteId'];
          this.logoDiv = true;
          this.route.navigateByUrl('/institute/institute-detail?iid=' + this.inst.instituteId);
        } else
          Swal.fire('', res['StatusDesc'], 'warning');
      })
    }
  }

  preventMobile(event) {
    let value = this.inst.alternatePhone;
    if (value >= 11) {
      event.preventDefault()
      this.inst.alternatePhone = parseInt(value.toString().substring(0, 10));
    }
  }

  getImageURL() {
    if (this.inst.logourl != null && this.inst.logourl != '')
      return environment.apiUrl + 'download/institute-logo/' + this.inst.logourl;
    else
      return 'assets/images/No-image.png';
  }

  getInstitutionDetails(iid) {
    this.is.getInstituteDetails({ instituteId: iid }).subscribe(res => {
      this.logoDiv = true;
      this.loadNeeded();
      if (res['StatusCode'] == '00') {
        this.inst = res['Institute'];

        let emails: Array<string> = this.inst.agents.split(';');
        this.agents = [];
        emails.filter(email => email.trim().length > 0).forEach(email => { this.agents.push({ emailId: email, name: email }) });

        console.log(this.agents);
      }
    })
  }

  getPrefillFromLead(leadId) {
    this.lms.getLead(leadId).subscribe(resp => {
      this.loading = false;
      this.loadNeeded();
      if (resp['StatusCode'] == "00") {
        if (resp['Lead'] != null) {
          let _lead: Lead = resp['Lead'];

          this.inst.instituteId = "0";
          this.inst.instituteName = _lead.company;
          this.inst.instituteType = _lead.industryType;
          this.inst.street1 = _lead.street;
          this.inst.city = _lead.city;
          this.inst.state = _lead.state;
          this.inst.country = _lead.country;
          this.inst.zipcode = _lead.pincode;
          this.inst.phone = _lead.phone;
          this.inst.alternatePhone = _lead.alternatePhone;
          this.inst.emailId = _lead.email;
          this.inst.alternateEmailId = _lead.alternateEmail;

        } else {
          this.snackbar.open('Lead not found for id #' + leadId);
        }
      } else if (resp['StatusCode'] == '03') {
        this.snackbar.open(resp['StatusDesc']);
      } else {
        this.snackbar.open('Something went wrong, Cannot get Lead Info.');
      }
    }, error => this.loading = false)
  }

  clear() {
    window.location.href = '/institute/register';
  }

  public fileChange(event) {
    console.log(event);

    this.selectedFile = event.target.files[0];
    this.saveLogo();
  }

  fillAddress(addr) {
    this.inst.street1 = addr.Name + ', ' + addr.Division;
    this.inst.street2 = addr.Taluk;
    this.inst.city = addr.District;
    this.inst.state = addr.State;
    this.inst.country = addr.Country;

    $(function () {
      $('#addressModal').appendTo("body").modal('hide');
    });
  }

  openfetchAddressModal() {

    if (this.inst.zipcode == '') {
      alert('Enter Pin Code');
      return;
    }

    this._address = [];
    this.loading_address = true;
    this.is.loadAddressFromPincode(this.inst.zipcode).subscribe(resp => {
      this.loading_address = false;
      if (resp['StatusCode'] == '00') {
        if (resp['HttpResponse']) {
          if (resp['HttpResponse']['PostOffice']) {
            this._address = resp['HttpResponse']['PostOffice'];
          }
        }
      }
    }, error => this.loading_address = false);

    $(function () {
      $('#addressModal').appendTo("body").modal('show');
    });
  }

  saveLogo() {
    this.logoLoading = true;
    this.is.saveInstituteLogo(this.selectedFile, this.inst.instituteId).subscribe(
      res => {
        console.log(res);
        this.logoLoading = false;
        this.inst = res['Institute'];

        if (res['StatusCode'] == '00') {
          this.logoLoading = false;
          this.logo = res['logo'];
          window.location.reload();
          //this.route.navigateByUrl('/institute/institute-detail?iid=' + res['Institute']['instituteId']);
        } else
          Swal.fire('', res['StatusDesc'], "warning");
        this.logoLoading = false;
      }
    )
  }
}
