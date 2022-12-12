import { Component, OnInit } from '@angular/core';
import { AgentService } from 'src/app/_services/agent.service';
import { Agent } from './Agent';
import { AuthService } from 'src/app/_services/auth.service';
import { MatSnackBar } from '@angular/material/snack-bar';
import { ActivatedRoute, Router } from '@angular/router';
import { environment } from 'src/environments/environment';

@Component({
  selector: 'app-agent-profile',
  templateUrl: './agent-profile.component.html',
  styleUrls: ['./agent-profile.component.css']
})
export class AgentProfileComponent implements OnInit {

  constructor(private as: AgentService, private auth: AuthService, private snackbar: MatSnackBar,
    private route: Router, private actRoutor: ActivatedRoute) {

    this.actRoutor.params.subscribe(params => {


      console.log(params);

      if (this.actRoutor.snapshot.params['tab'] == 'details')
        this.tab = 0;
      else if (this.actRoutor.snapshot.params['tab'] == 'apply-leave')
        this.tab = 1;
      else if (this.actRoutor.snapshot.params['tab'] == 'applied-leave')
        this.tab = 2;
      else
        this.tab = 0;
    })
  }

  agent: Agent = new Agent();

  photo_url = 'assets/images/No-image.png';
  signature_url = 'assets/images/No-image.png';

  loading = false;
  photoLoading = false;
  signatureLoading = false;
  selectFile = null;
  selectSignature = null;
  tab = 0;

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
        let profile = res['agent'];
        this.agent.photo = profile.photo;
        this.agent.photoFileName = null;
        this.agent.photoFileName = profile.photoFileName;

        if (profile.photoFileName !== undefined && profile.photoFileName != null && profile.photoFileName != '')
          this.photo_url = environment.apiUrl + '/download/profile-photos/' + profile.photoFileName;
        else
          this.photo_url = 'assets/images/No-image.png';

        if (this.auth.getLoginEmailId() == this.agent.emailId)
          this.auth.updatePhotoLocal(this.agent.photo, this.agent.photoFileName);

        this.snackbar.open('Profile Photo Updated Successfully');

        window.location.reload();
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
        this.agent.signatureFileName = profile.signatureFileName;

        if (profile.signatureFileName !== undefined && profile.signatureFileName != null && profile.signatureFileName != '')
          this.signature_url = environment.apiUrl + '/download/profile-signature/' + profile.signatureFileName;
        else
          this.signature_url = 'assets/images/No-image.png';

        this.snackbar.open('Signature Photo Updated Successfully');
        window.location.reload();
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

        if (this.agent.photoFileName !== undefined && this.agent.photoFileName != null && this.agent.photoFileName != '')
          this.photo_url = environment.apiUrl + '/download/profile-photos/' + this.agent.photoFileName;
        else
          this.photo_url = 'assets/images/No-image.png';

        if (this.agent.signatureFileName !== undefined && this.agent.signatureFileName != null && this.agent.signatureFileName != '')
          this.signature_url = environment.apiUrl + '/download/profile-signature/' + this.agent.signatureFileName;
        else
          this.signature_url = 'assets/images/No-image.png';


        this.agent.dateOfJoiningObject = { isRange: false, singleDate: { jsDate: (this.agent.dateOfJoining != null) ? new Date(this.agent.dateOfJoining) : this.agent.dateOfJoining } };

        if (this.auth.getLoginEmailId() == this.agent.emailId)
          this.auth.updatePhotoLocal(this.agent.photo, this.agent.photoFileName);

      }
    })
  }

  tabChange(event) {
    console.log(event);

    if (event.index == 0)
      this.route.navigate(['/profile/overview/details']);
    else if (event.index == 1)
      this.route.navigate(['/profile/overview/apply-leave']);
    else if (event.index == 2)
      this.route.navigate(['/profile/overview/applied-leave']);
    else
      this.route.navigate(['/profile/overview/details']);
  }

}
