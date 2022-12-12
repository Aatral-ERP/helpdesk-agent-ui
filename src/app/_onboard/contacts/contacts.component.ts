import { Component, OnInit } from '@angular/core';
import { InstituteService } from 'src/app/_services/institute.service';
import { Router } from '@angular/router';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-contacts',
  templateUrl: './contacts.component.html',
  styleUrls: ['./contacts.component.css']
})
export class ContactsComponent implements OnInit {

  constructor(private is: InstituteService, private route: Router) { }
  instituteContacts = [];
  ngOnInit(): void {
    this.getAllContact();
  }
  getAllContact() {
    this.is.getAllContact().subscribe(res => {
      console.log('InstituteContact::::::', res['InstituteContacts']);
      //console.log('InstituteContact::::::',res['InstituteContact']);
      if (res['StatusCode'] == '00') {
        this.instituteContacts = res['InstituteContacts'];
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
