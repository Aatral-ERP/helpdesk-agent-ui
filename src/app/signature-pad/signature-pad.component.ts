import { Component, OnInit, ViewChild } from '@angular/core';
import { SignaturePad } from 'angular2-signaturepad';

@Component({
  selector: 'app-signature-pad',
  templateUrl: './signature-pad.component.html',
  styleUrls: ['./signature-pad.component.css']
})
export class SignaturePadComponent implements OnInit {
  
  title = 'Angular signature example';
  signatureImg: string;
 // @ViewChild(SignaturePad) signaturePad: SignaturePad;

 signaturePad: SignaturePad;
  signaturePadOptions: Object = { 
    'minWidth': 2,
    'canvasWidth': 700,
    'canvasHeight': 300
  };

  ngOnInit() {
  }
  

  constructor() { }

  ngAfterViewInit() {
    // this.signaturePad is now available
    this.signaturePad.set('minWidth', 2); 
    this.signaturePad.clear(); 
  }

  drawComplete() {
    console.log(this.signaturePad.toDataURL());
  }

  drawStart() {
    console.log('begin drawing');
  }

  clearSignature() {
    this.signaturePad.clear();
  }

  savePad() {
    const base64Data = this.signaturePad.toDataURL();
    this.signatureImg = base64Data;
  }

}