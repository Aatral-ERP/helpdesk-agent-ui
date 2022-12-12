import { Component, OnInit, Input } from '@angular/core';
import { BillAttachment } from '../bills/Bill';
import { PurchaseInputService } from 'src/app/_services/purchase-input.service';
import { HttpEventType, HttpResponse } from '@angular/common/http';
import { saveAs } from "file-saver";

@Component({
  selector: 'app-bill-attachment',
  templateUrl: './bill-attachment.component.html',
  styleUrls: ['./bill-attachment.component.css']
})
export class BillAttachmentComponent implements OnInit {

  constructor(private pis: PurchaseInputService) { }

  @Input("BillAttachment") att: BillAttachment;
  downloading = false;
  downloadingPercent = 0;
  ngOnInit() {
  }

  viewAttachment() {

    if (!this.att.filetype.includes('image/')) {
      this.downloadNoteAttachment();
    } else {
      this.pis.getBillAttachment(this.att).subscribe(res => {
        let billAttach: BillAttachment = res['BillAttachment'];
        if (res['StatusCode'] == '00') {

          var image = new Image();
          image.src = "data:" + billAttach.filetype + ";base64," + billAttach.file;

          var w = window.open("");
          w.document.write(image.outerHTML);
        }
      })
    }
  }

  downloadNoteAttachment() {

    // this.downloaded = false;
    this.downloading = true;
    this.downloadingPercent = 0;

    this.pis.downloadNoteAttachmentProgress(this.att).subscribe(res => {

      if (res.type === HttpEventType.DownloadProgress) {
        console.log(res);
        // This is an download progress event. Compute and show the % done:
        const percentDone = Math.round(100 * res.loaded / res.total);
        this.downloadingPercent = percentDone;
        console.log(`File is ${percentDone}% downloaded.`);
      } else if (res instanceof HttpResponse) {
        console.log(res);

        // this.downloaded = true;
        this.downloading = false;
        this.downloadingPercent = 0;

        console.log('File is completely downloaded!');
        saveAs(res.body, this.att.filename);
      }

      // saveAs(res, contents);
    },
      err => {
        alert("Problem while downloading the file.");
        console.error(err);
      });
  }



}
