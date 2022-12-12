import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-whatsapp-text',
  templateUrl: './whatsapp-text.component.html',
  styleUrls: ['./whatsapp-text.component.css']
})
export class WhatsappTextComponent implements OnInit {

  constructor() { }

   loading = true;
    ngOnInit() {
    this.loading=true;
    this.whatsAppRedirect();
  }

  whatsAppRedirect()
  {
    window.location.href ='https://wa.me/919841601907?text=Hi';
  }

}
