import { Component, OnInit } from '@angular/core';
import { InstituteService } from 'src/app/_services/institute.service';
import Swal from 'sweetalert2';
import * as XLSX from 'xlsx';

type AOA = any[][];

@Component({
  selector: 'app-institute-datachange-import',
  templateUrl: './institute-datachange-import.component.html',
  styleUrls: ['./institute-datachange-import.component.css']
})
export class InstituteDatachangeImportComponent implements OnInit {

  constructor(private is: InstituteService) { }

  loading = false;
  institute=[];
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

  UpdateInstitutes(){
    this.loading = true;
    console.log(this.data);

    this.data.map(res=>{
      
      if(res[1]===undefined)
      {
        res[1]="";
      }
      if(res[2]===undefined)
      {
        res[2]="";
      }
      if(res[3]===undefined)
      {
        res[3]="";
      }
      if(res[4]===undefined)
      {
        res[4]="";
      }
      if(res[5]===undefined)
      {
        res[5]="";
      }
      if(res[6]===undefined)
      {
        res[6]="";
      }
      if(res[7]===undefined)
      {
        res[7]="";
      }
      if(res[8]===undefined)
      {
        res[8]="";
      }
      if(res[9]===undefined)
      {
        res[9]="";
      }
      if(res[10]===undefined)
      {
        res[10]="";
      }
      if(res[11]===undefined)
      {
        res[11]="";
      }
      if(res[12]===undefined)
      {
        res[12]="";
      }
      if(res[13]===undefined)
      {
        res[13]="";
      }
      if(res[14]===undefined)
      {
        res[14]="";
      }
      if(res[15]===undefined)
      {
        res[15]="";
      }
      if(res[16]===undefined)
      {
        res[16]="";
      }
      if(res[17]===undefined)
      {
        res[17]="";
      }
      this.institute.push({ instituteName: res[0],shortTerm: res[1], instituteType: res[2],phone: res[3], emailId: res[4],  alternatePhone: res[5],
      alternateEmailId: res[6], serviceUnder: res[7],street1: res[8], street2: res[9], city: res[10],
      state: res[11],country: res[12], zipcode: res[13],gstno: res[14],keyInfo: res[15], remarks: res[16],agents: res[17], });
       })
     
    
    this.is.updateInstituteImport(this.institute).subscribe(res => {
      this.loading = false;
      console.log(res);
      if (res['StatusCode'] == '00')
      Swal.fire('', res['StatusDesc']);
  
    else
      Swal.fire('', res['StatusDesc'], 'warning');
      })
  }

  clear(){
    window.location.reload();
  }
}


