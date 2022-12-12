import { Component, OnInit } from '@angular/core';
import { AgentService } from 'src/app/_services/agent.service';
import { InstituteService } from 'src/app/_services/institute.service';
import { environment } from 'src/environments/environment';
import Swal from 'sweetalert2';
import * as XLSX from 'xlsx';

type AOA = any[][];

@Component({
  selector: 'app-institute-import',
  templateUrl: './institute-import.component.html',
  styleUrls: ['./institute-import.component.css']
})
export class InstituteImportComponent implements OnInit {

  constructor(private is: InstituteService,private as: AgentService) { }

  files = [];
  instituteName='';
  instituteType='';
  gstNo='';
  address1='';
  address2='';
  city='';
  state='';
  pincode='';
  country='';
  phoneNo='';
  emailId='';
  atlPhoneNo='';
  atlEmailId='';
  keyInfo='';
  remarks='';
  projectManager='';
  shortTerm='';

  loading = false;
  filename='BankStatement Template.xlsx';
  institute: any[] = [];
  ngOnInit() {
  }
  
  title = 'sampleApp';
  public fileString;

  changeListener($event): void {
    this.readThis($event.target);
  }

  readThis(inputValue: any): void {
    var file: File = inputValue.files[0];
    var reader = new FileReader();
    reader.onload = function (e) {
    var texto = reader.result;
    var temp = texto.toString().split(',')[1];
    console.log(temp);
    }
   reader.readAsDataURL(file);
  }

  //data: AOA = [[1, 2], [3, 4]];
  data: AOA = [[],[]];
  wopts: XLSX.WritingOptions = { bookType: 'xlsx', type: 'array' };
  fileName: string = 'SheetJS.xlsx';

  onFileChange(evt: any) {
    /* wire up file reader */
    const target: DataTransfer = <DataTransfer>evt.target;
    if (target.files.length !== 1) throw new Error('Cannot use multiple files');
    const reader: FileReader = new FileReader();
    reader.onload = (e: any) => {
      /* read workbook */
      const bstr: string = e.target.result;
      const wb: XLSX.WorkBook = XLSX.read(bstr, { type: 'binary' });

      /* grab first sheet */
      const wsname: string = wb.SheetNames[0];
      const ws: XLSX.WorkSheet = wb.Sheets[wsname];

      /* save data */
      this.data = <AOA>XLSX.utils.sheet_to_json(ws, { header: 1 });
      console.log('data:', this.data);

      var theRemovedElement = this.data.shift(); // theRemovedElement == 1
      console.log(this.data); // [2, 3, 4] 
  
      this.data.map(res => {
        if (res[0] === 'no') {
          console.log(res[0]);
        } else {
        
        }
      });
    };
    reader.readAsBinaryString(target.files[0]);
  }

  saveInstitutes(){
  this.loading = true;
    console.log(this.data)
    // for (let i = 0; i < this.data.length; i++) {
    //   console.log(this.data[i]);
     // this.institute=this.data[i];

   
     this.data.map(res=>{
      this.institute.push({ instituteId:0, instituteName: res[0],shortTerm:res[1],instituteType: res[2], gstno: res[3],street1: res[4], street2: res[5], city: res[6],
      state: res[7],country: res[8], zipcode: res[9],phone: res[10], emailId: res[11], alternatePhone: res[12],
      alternateEmailId: res[13],keyInfo: res[14], remarks: res[15],agents: res[16],serviceUnder:"ServiceCall" });
       })
   
    //  this.institute.push({ instituteName: this.data[i][0],instituteType: this.data[i][1], gstNo: this.data[i][2],address1: this.data[i][3], address2: this.data[i][4], city: this.data[i][5],
    //  state: this.data[i][6],country: this.data[i][7], pincode: this.data[i][8],phoneNo: this.data[i][9], emailId: this.data[i][10], atlphoneNo: this.data[i][11],
    //  atlEmailId: this.data[i][12],keyInfo: this.data[i][13], remarks: this.data[i][14],projectManager: this.data[i][15] });
    
    this.is.saveInstituteImport(this.institute).subscribe(res => {
    this.loading = false;
    console.log(res);
    if (res['StatusCode'] == '00')
    Swal.fire('', res['StatusDesc']);

  else
    Swal.fire('', res['StatusDesc'], 'warning');
    })
  }
  //}

  clear(){
    window.location.reload();
  }

}
