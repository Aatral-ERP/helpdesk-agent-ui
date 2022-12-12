import { Component, OnInit } from '@angular/core';
import { InstituteService } from 'src/app/_services/institute.service';
import { environment } from 'src/environments/environment';

@Component({
  selector: 'app-my-bills',
  templateUrl: './my-bills.component.html',
  styleUrls: ['./my-bills.component.css']
})
export class MyBillsComponent implements OnInit {

  constructor(private is: InstituteService) { }
  amcDetails: Array<any> = [];
  ngOnInit() {
    this.getMyBills();
  }

  getMyBills() {
    this.is.getMyBills().subscribe(res => {
      console.log(res);
      this.amcDetails = res['AMCDetails'];
    })
  }

  downloadTicketServiceInvoice(fileName) {
    console.log(fileName);
    window.open(environment.contentPath + '_receipts/' + fileName, '_blank');
  }

}
