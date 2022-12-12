import { Component, OnInit } from '@angular/core';
import { AgentService } from '../_services/agent.service';
import Swal from 'sweetalert2';
import { InfoDetails } from './infoDetails';
import { IDropdownSettings } from 'ng-multiselect-dropdown';
import { SalesService } from '../_services/sales.service';
import { InstituteService } from '../_services/institute.service';

@Component({
  selector: 'app-info-details',
  templateUrl: './info-details.component.html',
  styleUrls: ['./info-details.component.css']
})
export class InfoDetailsComponent implements OnInit {

  infoDetails: InfoDetails = new InfoDetails()

  loading = false;
  logoLoading = false;
  _agents = [];
  showEmailError = false;
  showNumberError = false;
  showGstError = false;
  showLandNumberError = false;

  _selected_agent: any = [];

  selectedFile = null;
  roundSealLoading = null;
  fullSealLoading = null;

  _AgentsDropdownSettings: IDropdownSettings = {
    singleSelection: true,
    idField: 'emailId',
    textField: 'firstName',
    itemsShowLimit: 10,
    allowSearchFilter: true,
    closeDropDownOnSelection: true
  };

  constructor(private as: AgentService, private ss: SalesService, private is: InstituteService) { }

  ngOnInit() {
    this.getInfo();
  }

  loadNeededDetails() {
    this.ss.getSalesNeededData(['agents']).subscribe(res => {
      console.log(res);
      this._agents = res['Agents'];
      this._agents.filter(agent => agent.emailId == this.infoDetails.signatureAgent).forEach(agent => {
        this._selected_agent = [{ emailId: agent.emailId, firstName: agent.firstName }];
      })
    })
  }

  getInfo() {
    this.loading = true;
    this.as.getInfoDetails(1).subscribe(res => {
      this.loading = false;
      this.infoDetails = res['infoDetails'];
      localStorage.setItem('infoDetails', JSON.stringify(this.infoDetails));
      this.loadNeededDetails();
    }, error => this.loading = false);
  }

  saveInfo() {
    !(this.is.validateEmail(this.infoDetails.cmpEmail)) ? this.showEmailError = true : this.showEmailError = false;
    !(this.is.validatePhoneNumber(this.infoDetails.cmpPhone)) ? this.showNumberError = true : this.showNumberError = false;
    // !(this.is.validateLandLine(this.infoDetails.cmpLandLine)) ? this.showLandNumberError = true : this.showLandNumberError = false;
    !(this.is.validateGstNumber(this.infoDetails.gstNo)) ? this.showGstError = true : this.showGstError = false;

    if (this.showEmailError || this.showNumberError || this.showGstError || this.showLandNumberError) {
      return;
    } else {
      this.loading = true;
      if (this._selected_agent.length > 0) {
        this.infoDetails.signatureAgent = this._selected_agent[0].emailId;
      }
      this.as.saveInfoDetails(this.infoDetails).subscribe(
        res => {
          this.loading = false;
          if (res['StatusCode'] == "00") {
            Swal.fire('Update Successfully', '', "success");
            this.infoDetails = res['infoDetails'];
          }
          else
            Swal.fire(res['StatusDesc'], "warning");
        }
      )
    }
  }

  saveLogo() {
    this.logoLoading = true;
    this.as.saveLogo(this.selectedFile).subscribe(
      res => {
        console.log(res);
        this.logoLoading = false;
        let infoDetails = res['infoDetail'];

        if (res['StatusCode'] == '00') {
          this.infoDetails.cmpLogo = infoDetails.cmpLogo;
        } else
          Swal.fire('', res['StatusDesc'], "warning");
      }
    )
  }

  public fileChange(event) {
    console.log(event);

    this.selectedFile = event.target.files[0];
    this.saveLogo();
  }

  preventMobile(event) {
    let value = this.infoDetails.cmpPhone;
    if (value.length >= 11) {
      event.preventDefault()
      this.infoDetails.cmpPhone = value.toString().substring(0, 11);
    }
  }

  saveRoundSeal(event) {
    let selectedFile = event.target.files[0];
    this.roundSealLoading = true;
    this.as.saveRoundSeal(selectedFile).subscribe(res => {
      this.roundSealLoading = false;

      let infoDetails = res['infoDetail'];

      if (res['StatusCode'] == '00') {
        this.infoDetails.roundSeal = infoDetails.roundSeal;
      } else
        Swal.fire('', res['StatusDesc'], "warning");
    }, error => { this.roundSealLoading = false; })
  }

  saveFullSeal(event) {
    let selectedFile = event.target.files[0];
    this.fullSealLoading = true;
    this.as.saveFullSeal(selectedFile).subscribe(res => {
      this.fullSealLoading = false;

      let infoDetails = res['infoDetail'];

      if (res['StatusCode'] == '00') {
        this.infoDetails.fullSeal = infoDetails.fullSeal;
      } else
        Swal.fire('', res['StatusDesc'], "warning");
    }, error => { this.fullSealLoading = false; })
  }

}

