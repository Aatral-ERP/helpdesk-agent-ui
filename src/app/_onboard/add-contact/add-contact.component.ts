import { Component, OnInit } from '@angular/core';
import { ToastrService } from 'ngx-toastr';
import Swal from 'sweetalert2';
import { ActivatedRoute, Router } from '@angular/router';
import { InstituteService } from 'src/app/_services/institute.service';
import { AuthGuardService } from 'src/app/_services/auth-guard.service';


@Component({
  selector: 'app-add-contact',
  templateUrl: './add-contact.component.html',
  styleUrls: ['./add-contact.component.css']
})
export class AddContactComponent implements OnInit {

  id = '';
  instituteId = '0';
  firstName = '';
  lastName = '';
  phone = '';
  emailId = '';
  street1 = '';
  street2 = '';
  city = '';
  state = '';
  country = '';
  zipcode = '';
  isBlocked = 0;

  instituteContacts = [];

  showDelete = false;

  constructor(private is: InstituteService, private tst: ToastrService, private actRoute: ActivatedRoute, private route: Router, private auth: AuthGuardService) {
    this.actRoute.queryParams.subscribe(params => {
      console.log(params);
      if (params['id'] && params['edit'] == '1') {
        this.id = params['id'];
        this.getAllContact();
      }
    })
  }

  ngOnInit() {
  }

  clear() {
    window.location.reload();
  }

  saveContact() {
    let errorText = "";
    if (!this.auth.validateEmail(this.emailId.toString()))
      errorText = errorText + '\rInvalid EmailId';
    if (!this.auth.validatePhoneNumber(this.phone.toString()))
      errorText = errorText + '\rInvalid Phone Number';

    if (errorText.length > 0) {
      this.tst.error(errorText);
      return;
    }
    this.is.saveContact(this.id, this.firstName, this.lastName, this.phone, this.emailId, this.street1, this.street2, this.city, this.state, this.country, this.zipcode, this.isBlocked).subscribe(res => {

      if (res['StatusCode'] == '00') {
        Swal.fire('', res['StatusDesc']);
        this.route.navigate(['/onboard/contacts']);
      }
      else
        Swal.fire('', res['StatusDesc'], 'warning');
    })

  }

  deleteContact() {
    this.is.deleteContact(this.id, this.emailId).subscribe(res => {
      console.log('Response:::::', res);
      if (res['StatusCode'] == '00') {
        Swal.fire('', res['StatusDesc']);
        this.route.navigate(['/onboard/contacts']);
      }
      else
        Swal.fire('', 'Failed', 'warning');
    })
  }

  getAllContact() {
    this.is.getAllContact().subscribe(res => {
      console.log('InstituteContact::::::', res['InstituteContacts']);
      //console.log('InstituteContact::::::',res['InstituteContact']);
      if (res['StatusCode'] == '00') {
        this.instituteContacts = res['InstituteContacts'];

        let ic = this.instituteContacts.find(ic => ic.id == this.id);
        console.log(ic);

        this.id = ic.id;
        this.firstName = ic['firstName'];
        this.lastName = ic['lastName'];
        this.phone = ic['phone'];
        this.emailId = ic['emailId'];
        this.street1 = ic['street1'];
        this.street2 = ic['street2'];
        this.city = ic['city'];
        this.state = ic['state'];
        this.country = ic['country'];
        this.zipcode = ic['zipcode'];
        this.isBlocked = ic['isBlocked'];
      }
      else
        Swal.fire('', 'Failed', 'warning');
    })
  }


  logout() {
    localStorage.clear();
    window.location.href = "./";
  }

}