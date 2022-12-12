import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import Swal from 'sweetalert2';
import { InstituteService } from 'src/app/_services/institute.service';

@Component({
  selector: 'app-all-contacts',
  templateUrl: './all-contacts.component.html',
  styleUrls: ['./all-contacts.component.css']
})
export class AllContactsComponent implements OnInit {

  constructor(private is: InstituteService,private route: Router) { }
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
}
