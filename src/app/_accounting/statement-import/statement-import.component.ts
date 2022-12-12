import { Component, OnInit,ViewChild, ElementRef } from '@angular/core';
import { NgxFileDropEntry, FileSystemFileEntry, FileSystemDirectoryEntry } from 'ngx-file-drop';
import { AccountingService } from 'src/app/_services/accounting.service';
import * as XLSX from 'xlsx';
import Swal from 'sweetalert2';
// import { Subject } from 'rxjs/Subject';


type AOA = any[][];

@Component({
  selector: 'app-statement-import',
  templateUrl: './statement-import.component.html',
  styleUrls: ['./statement-import.component.css']
})
export class StatementImportComponent implements OnInit {

  constructor(private acs: AccountingService) { }


  files = [];
  debitAmount=0.00;
  creditAmount=0.00;
  totalAmount=0.00;
  transactionDate='';
  description='';
  refNo='';
  loading = false;
  Statement: any[] = [];
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
      // console.log(this.data.indexOf(this.data));
      // const index: number = this.data.indexOf(this.data);
      // if (index == -1) {
      //   console.log("Inside Condtiton");
      //     this.data.splice(index, 1);
      //     console.log(this.data)
      // }      
      var theRemovedElement = this.data.shift(); // theRemovedElement == 1
      console.log(this.data); // [2, 3, 4] 
      // var myJsonString = JSON.stringify(this.data);
      // console.log('JsonData:', myJsonString);
      this.data.map(res => {
        if (res[0] === 'no') {
          console.log(res[0]);
        } else {
          // console.log(res[0]);
          // console.log(res[1]);
          // console.log(res[2]);
          // console.log(res[3]);
        }
      });
    };
    reader.readAsBinaryString(target.files[0]);
  }

  export(): void {
    /* generate worksheet */
    const ws: XLSX.WorkSheet = XLSX.utils.aoa_to_sheet(this.data);

    /* generate workbook and add the worksheet */
    const wb: XLSX.WorkBook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, 'Sheet1');

    /* save to file */
    XLSX.writeFile(wb, this.fileName);
  }

  //File Drop Functions


  public filesDrop: NgxFileDropEntry[] = [];

  public dropped(files: NgxFileDropEntry[]) {
    this.filesDrop = files;
    for (const droppedFile of this.filesDrop) {

      // Is it a file?
      if (droppedFile.fileEntry.isFile) {
        const fileEntry = droppedFile.fileEntry as FileSystemFileEntry;
        fileEntry.file((file: File) => {

          // Here you can access the real file
          console.log(droppedFile.relativePath, file);

          this.files.push(file);

        });
      } else {
        // It was a directory (empty directories are added, otherwise only files)
        const fileEntry = droppedFile.fileEntry as FileSystemDirectoryEntry;
        console.log(droppedFile.relativePath, fileEntry);
      }
    }
  }

    public fileOver(event) {
    console.log(event);
  }

  public fileLeave(event) {
    console.log(event);
  }

  saveStatement(){
    this.loading = true;
    console.log(this.data)
    this.data.map(res=>{
      this.description=res[0];
      this.refNo=res[1];
      this.creditAmount=res[2];
      this.debitAmount=res[3];
      this.totalAmount=res[4];
      this.transactionDate=res[5];

      // let Statement: Array<any> = res;
      //     this.Statement = [];
      
        // res.forEach(count => {
        //  console.log(res);
            this.Statement.push({ description: res[0],refNo: res[1], creditAmount: res[2],debitAmount: res[3], totalAmount: res[4], transactionDate: res[5] });
        // console.log(this.Statement);
        // });
    })
   //  this.acs.saveStatementAccount(this.description,this.creditAmount,this.debitAmount,this.totalAmount,this.transactionDate).subscribe(res => {
      this.acs.saveStatementAccount(this.Statement).subscribe(res => {
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
