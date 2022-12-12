import { Component, OnInit, Input } from '@angular/core';
import { NoteAttachment } from '../../Quotation';
import { SalesService } from 'src/app/_services/sales.service';
import { HttpEventType, HttpResponse } from '@angular/common/http';
import { saveAs } from "file-saver";

@Component({
  selector: 'app-note-attachment',
  templateUrl: './note-attachment.component.html',
  styleUrls: ['./note-attachment.component.css']
})
export class NoteAttachmentComponent implements OnInit {

  constructor(private ss: SalesService) { }

  @Input("NoteAttachment") att: NoteAttachment;
  downloading = false;
  downloadingPercent = 0;
  ngOnInit() {
  }

  viewAttachment() {

    if (!this.att.filetype.includes('image/')) {
      this.downloadNoteAttachment();
    } else {
      this.ss.getNoteAttachment(this.att).subscribe(res => {
        let noteAtt: NoteAttachment = res['NoteAttachment'];
        if (res['StatusCode'] == '00') {

          var image = new Image();
          image.src = "data:" + noteAtt.filetype + ";base64," + noteAtt.file;

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

    this.ss.downloadNoteAttachmentProgress(this.att).subscribe(res => {

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
