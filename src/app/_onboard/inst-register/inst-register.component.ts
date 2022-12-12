import { Component, OnInit } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { ToastrService } from 'ngx-toastr';
import { InstituteService } from '../../_services/institute.service';
import { AuthGuardService } from 'src/app/_services/auth-guard.service';

@Component({
  selector: 'app-inst-register',
  templateUrl: './inst-register.component.html',
  styleUrls: ['./inst-register.component.css']
})
export class InstRegisterComponent implements OnInit {
  // atlmobileno ="";
  atlmailid = "";
  gstno = "";
  loading = false;

  institute: any = {};

  constructor(private is: InstituteService, private tst: ToastrService, private auth: AuthGuardService) { }

  ngOnInit() {
    this.getInstituteDetails();
  } 

  getInstituteDetails() {
    this.is.getInstituteDetails().subscribe(res => {
      if (res['StatusCode'] == '00')
        this.institute = res['Institute']
    });
  }

  save() {
    // let errorText = "";
    // if (!this.auth.validateEmail(this.institute.alternateEmailId.toString()))
    //   errorText = errorText + '\rInvalid Alt. EmailId';
    // if (!this.auth.validatePhoneNumber(this.institute.alternatePhone.toString()))
    //   errorText = errorText + '\rInvalid Alt. Phone Number';

    // if (errorText.length > 0) {
    //   this.tst.error(errorText);
    //   return;
    // }

    this.is.editInstituteDetails(this.institute)
      .subscribe(res => {
        this.loading = false;
        console.log(res);
        if (res['StatusCode'] == '00') {
          console.log('Inside If');
          this.tst.success('Details Updated!!!');
        }
        else if (res['StatusCode'] == '03') {
          this.tst.info(res['StatusDesc']);
        } else {
          this.tst.error('Failed to update, Try later.')
        }
      }, error => { this.loading = false; console.log(error) });
  }

  clear() {
    window.location.href = '/register';
  }

  logout() {
    localStorage.clear();
    window.location.href = "./";
  }

}
