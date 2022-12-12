import { Component, OnInit, Input } from '@angular/core';
import { ViewContact } from './ViewContact';
import Swal from 'sweetalert2';
import { Router } from '@angular/router';
import { InstituteService } from 'src/app/_services/institute.service';

@Component({
  selector: 'app-view-contacts',
  templateUrl: './view-contacts.component.html',
  styleUrls: ['./view-contacts.component.css']
})
export class ViewContactsComponent implements OnInit {
  @Input() viewContact: ViewContact;
  phone = '';
  instituteContacts = [];

  constructor(private is: InstituteService, private route: Router) { }
  ngOnInit(): void {
    this.getAllContact();
  }

  deleteContact(id, emailId) {
    this.is.deleteContact(id, emailId).subscribe(res => {
      console.log('Response:::::', res);
      if (res['StatusCode'] == '00') {
        Swal.fire('', res['StatusDesc']);
      }
      else {
        Swal.fire('', 'Failed', 'warning');
      }

      this.getAllContact();
    })
  }

  getAllContact() {
    this.is.getAllContact().subscribe(res => {
      console.log('InstituteContact::::::', res['InstituteContacts']);
      if (res['StatusCode'] == '00') {
        this.instituteContacts = res['InstituteContacts'];
      }
      else
        Swal.fire('', 'Failed', 'warning');
    })
  }


  editContact(id) {
    this.route.navigate(['/onboard/sub-contact'], { queryParams: { id: id, edit: 1 } });

  }


}
