import { Component, OnInit } from '@angular/core';
import { AgentService } from 'src/app/_services/agent.service';
import { Agent } from './Agent';
import { AuthService } from 'src/app/_services/auth.service';
import { MatSnackBar } from '@angular/material/snack-bar';

@Component({
  selector: 'app-agent-profile',
  templateUrl: './agent-profile.component.html',
  styleUrls: ['./agent-profile.component.css']
})
export class AgentProfileComponent implements OnInit {

  constructor(private as: AgentService, private auth: AuthService, private snackbar: MatSnackBar) { }

  agent: Agent = new Agent();
  loading = false;
  photoLoading = false;
  signatureLoading = false;
  selectFile = null;
  selectSignature = null;


  ngOnInit() {
    this.getAgentDetails(this.auth.getAgentDetails().employeeId);
  }

  fileChange(event) {
    this.selectFile = event.target.files[0];
    this.saveProfilePhoto();
  }

  fileChangeSignature(event) {
    this.selectSignature = event.target.files[0];
    this.saveSignature();
  }

  saveProfilePhoto() {
    this.photoLoading = true;
    this.as.saveProfilePhoto(this.selectFile, this.agent.employeeId).subscribe(res => {
      this.photoLoading = false;

      if (res['StatusCode'] == '00') {
        console.log(res['agent']);
        let profile = res['agent'];
        this.agent.photo = profile.photo;
        if (this.auth.getLoginEmailId() == this.agent.emailId)
          this.auth.updatePhotoLocal(this.agent.photo);
        this.snackbar.open('Profile Photo Updated Successfully');
      } else {
        this.snackbar.open('Something went wrong');
      }
    }, error => { this.photoLoading = false; })
  }

  saveSignature() {
    this.signatureLoading = true;
    this.as.saveSignature(this.selectSignature, this.agent.employeeId).subscribe(res => {
      this.signatureLoading = false;
      if (res['StatusCode'] == '00') {
        console.log(res['agent']);
        let profile = res['agent'];
        this.agent.signature = profile.signature;
        this.snackbar.open('Signature Photo Updated Successfully');
      } else {
        this.snackbar.open('Something went wrong');
      }
    }, error => { this.signatureLoading = false; })
  }


  getAgentDetails(aid) {
    this.as.getAgentDetails(aid).subscribe(res => {
      if (res['StatusCode'] == '00') {
        console.log(":::Inside Agent Details:::");

        this.agent = res['Agent'];

        this.agent.dateOfJoiningObject = { isRange: false, singleDate: { jsDate: (this.agent.dateOfJoining != null) ? new Date(this.agent.dateOfJoining) : this.agent.dateOfJoining } };


        if (this.auth.getLoginEmailId() == this.agent.emailId)
          this.auth.updatePhotoLocal(this.agent.photo);

      }
    })
  }

}
