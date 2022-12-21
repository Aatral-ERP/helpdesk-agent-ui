import { Component, OnInit } from '@angular/core';
import { LatterpadDeal } from './LetterpadDeal';
import { IDropdownSettings } from 'ng-multiselect-dropdown';
import { Institute } from 'src/app/_onboard/inst-registration/institute';
import { SalesService } from 'src/app/_services/sales.service';
import { IAngularMyDpOptions } from 'angular-mydatepicker';
import { TicketService } from 'src/app/_services/ticket.service';
import { MatSnackBar } from '@angular/material';
import { AuthService } from 'src/app/_services/auth.service';
import { environment } from 'src/environments/environment';
import { InstituteService } from 'src/app/_services/institute.service';
import { ActivatedRoute } from '@angular/router';
import Swal from 'sweetalert2';
declare var $: any;

@Component({
  selector: 'app-create-letterpad',
  templateUrl: './create-letterpad.component.html',
  styleUrls: ['./create-letterpad.component.css']
})
export class CreateLetterpadComponent implements OnInit {

  constructor(private ss: SalesService,private ts: TicketService, private snackbar: MatSnackBar, private auth: AuthService, private is: InstituteService,private actRoute: ActivatedRoute)
   {
    this.actRoute.queryParams.subscribe(params => {
      console.log(params);

      if (params['edit']) {
       // if (params['edit'] == 1 && params['did']) {
        //  this._mode = 'Edit';
          this.editLetterPad(params['edit']);
      //  }
      }

      if (params['copy']) {
        // if (params['edit'] == 1 && params['did']) {
         //  this._mode = 'Edit';
           this.copyLetterpad(params['copy']);
       //  }
       }
    })

   }

  _institutes: Array<Institute> = [];
  _selectedInstitute = [];

  showPDFTemplateOptions = false;
  generatingLetterpadPDF = false;
  generatingLetterpadPDF1 = false;
  showDelete = false;
  showCopyLetterpad = false;

  addRoundSeal = true;
  addFullSeal = true;
  addSign = true;
  addLetterHead = true;
  addLogo = true;

  shareWhatsappText = '';
  shareWhatsappTo = '+91';
  showAddNewEmail = false;
  


  exportType = "PDF";
  designation = this.auth.getLoginAgentDesignation();
  generatingPDF = false;

  ngOnInit() {
    this.loadInstituteDetails();
  }

  loading = false;

  saving = false;

  public myDatePickerOptions: IAngularMyDpOptions = {
    dateRange: false,
    dateFormat: 'dd/mm/yyyy',
    closeSelectorOnDateSelect: true
  };

  letterpad: LatterpadDeal = new LatterpadDeal();


 

  
  _instituteDropdownSettings: IDropdownSettings = {
    singleSelection: true,
    idField: 'instituteId',
    textField: 'instituteName',
    itemsShowLimit: 10,
    allowSearchFilter: true,
    closeDropDownOnSelection: true
  };

  loadInstituteDetails() {
    this.ss.getSalesNeededData(['institutes', 'products', 'info_min', 'state_tin']).subscribe(res => {
      this._institutes = res['Institutes'];


     console.log( this._institutes);


      //this.filterProduct('');

      console.log('Institute:::::::',this._selectedInstitute[0]);

      console.log('Length:::::::',this._selectedInstitute.length);
      

      if (this._selectedInstitute.length > 0) {
        this._institutes
          .filter(inst => inst.instituteId == this._selectedInstitute[0].instituteId)
          .forEach(inst => {
            this.letterpad.institute = inst;
           console.log(inst);
           console.log(this.letterpad.institute);
            
            this._selectedInstitute = [];
            this._selectedInstitute.push(inst);

            console.log('===========' ,this._selectedInstitute.push(inst));
            this.copyBillingAddressFromInstitute();
            this.copyShippingAddressFromBillingAddress();
            console.log(inst, this._selectedInstitute);
          });
      };
    })
  }


  loadAllInstituteContacts(inst) {

    console.log('loadAllInstituteContacts');
    }

  copyBillingAddressFromInstitute() {
    console.log('-----------',this.letterpad.institute);
    this.is.getInstituteDetails({ instituteId: this.letterpad.institute.instituteId }).subscribe(res => {

    console.log(res['Institute']);
    this.letterpad.billingTo = '';
    this.letterpad.billingStreet1 = res['Institute']['street1'];
    this.letterpad.billingStreet2 = res['Institute']['street2'];
    this.letterpad.billingCity = res['Institute']['city'];
    this.letterpad.billingState = res['Institute']['state'];
    this.letterpad.billingCountry = res['Institute']['country'];
    this.letterpad.billingZIPCode = res['Institute']['zipcode'];

    })
    
  }

  copyShippingAddressFromBillingAddress() {

    console.log('copyShippingAddressFromBillingAddress');
   
  }

  decideGSTType() {
    console.log('decideGSTType');
  }



  clearFilters()
  {
    
  }


  saveLetterpad()
{
this.ts.saveLetterpad(this.letterpad).subscribe(res=>{
  if(res['StatusCode']=='00')
  {
    this.letterpad = res['letterpad'];
    this.snackbar.open('Saved Successfully', 'OK');
    this.generatingLetterpadPDF=true;
  }
},error=>{

})
}

viewPDF(id,fileName) {
    let url = environment.apiUrl + 'download/download-lettepad-pdf/view/' + id+ '/' + fileName;
    window.open(url, 'winname', 'directories=no,titlebar=no,toolbar=no,location=no,status=no,menubar=no,scrollbars=no,resizable=no,width=auto,height=auto');
  }
  
  downloadPDF(id,fileName) {
    let url = environment.apiUrl + 'download/download-lettepad-pdf/download/' + id + '/' + fileName;
    window.open(url, '_blank');
  }

  deleteLetterpad(id) {
    this.ts.deleteLetterpad(id).subscribe(res => {
      if (res['StatusCode'] == '00') {
       this. generatingLetterpadPDF1 = true
              this.snackbar.open('Deleted');
              window.location.href = "./sales/letterpad";
      }
    },
    error=>{
      

    })
  }

  
  generateLetterpad(letterpadAll) {
    this. generatingLetterpadPDF1 = true;
    this.ts.generateLetterPad(letterpadAll.id, this.addSign,this.addRoundSeal,this.addFullSeal,this.addLetterHead,this.addLogo,this.designation).subscribe(res => {
      console.log(res);
      if (res['StatusCode'] == '00') {
        this. generatingLetterpadPDF1 = false;
        this.letterpad = res['Letterpad'];
        this.snackbar.open('Generated Successfully', 'OK');
       // window.location.href = "./reports/letterpad";
      }
    },
    error=>{
      this.generatingPDF =false;
    })
  }

 

  editLetterPad(id)
  {
    this.ts.getLetterpad(id).subscribe(res => {
      console.log(res);
      if (res['StatusCode'] == '00') {

        this.letterpad = res['letterpad'];
        this.letterpad.institute = res['institute'];
        this._selectedInstitute = [{ instituteId: this.letterpad.institute.instituteId, instituteName: this.letterpad.institute.instituteName }];

        console.log(this._selectedInstitute);
        this.showDelete =true;

      }

  })
}

copyLetterpad(id)
{

  this.ts.getLetterpad(id).subscribe(res => {
    console.log(res);
    if (res['StatusCode'] == '00') {

      this._selectedInstitute =[];
      this.letterpad = res['letterpad'];
      this.letterpad.id= 0;
      this.generatingLetterpadPDF=false;
      this.showDelete=false;
      this.snackbar.open('Copied Successfully', 'OK');
    
    }

})

}  

shareWhatsApp() {
  let url = `https://wa.me/${this.shareWhatsappTo}?text=${encodeURI(this.shareWhatsappText)}`;
  window.open(url, '_blank');
}

resp(event) {
  console.log(event);
  if (event == 'close' || event == 'success') {
    this.showAddNewEmail = false;
  }
}

openShareWhatsAppModal() {

  let url = environment.apiUrl + 'download/download-lettepad-pdf/view/' + this.letterpad.id + '/' + this.letterpad.fileName;

  this.shareWhatsappText = this.letterpad.subject + '\n' +
    'Letterpad No : ' + this.letterpad.id + '\n\n' +
    'View Letterpad by below url : \n\n ' +
    url + ' \n\n'
    + 'Thanks\n' + this.auth.getLoginAgentFullName();

  console.log(this.shareWhatsappText);

  $(function () {
    $('#whatsappShareModal').appendTo("body").modal('show');
  });
}


letterpadFileUploadChange(file: File) {
  console.log(file);

  if (file.type.toLowerCase() != 'application/pdf') {
    this.snackbar.open('Only PDF file type is valid');
    return false;
  }

  Swal.fire({
    title: 'Are you sure?',
    text: "You want to Upload.",
    icon: 'warning',
    showCancelButton: true,
    confirmButtonColor: '#3085d6',
    cancelButtonColor: '#d33',
    confirmButtonText: 'Yes, Upload!'
  }).then((result) => {
    if (result.value) {
      this.generatingLetterpadPDF = true;
      this.ss.UploadGeneratedLetterPDF(this.letterpad.id, file).subscribe(res => {

        this.generatingLetterpadPDF = false;
        if (res['StatusCode'] == '00') {
          this.letterpad.fileName = res['Letterpad']['fileName'];
          this.snackbar.open('Uploaded Successfully', 'OK');
          if (this.letterpad.fileName.endsWith(".pdf"))
            this.viewPDF(this.letterpad.id,this.letterpad.fileName);
        } else {
          this.snackbar.open('Something went wrong! Try again later', 'OK');
        }
      })
    }
  })
}

}                               