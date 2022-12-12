import { Component, OnInit, Input } from '@angular/core';
import { SalesService } from 'src/app/_services/sales.service';
import { Note, NoteAttachment, Quotation } from '../../Quotation';
import { Base64 } from 'js-base64';
import { MatSnackBar } from '@angular/material/snack-bar';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-deals-notes',
  templateUrl: './deals-notes.component.html',
  styleUrls: ['./deals-notes.component.css']
})
export class DealsNotesComponent implements OnInit {

  constructor(private ss: SalesService, private _snackBar: MatSnackBar) { }
  showAddNewDiv = false;
  @Input("dealId") dealId: number;
  doc = '';
  docView = false;
  loading = false;
  saving = false;
  notes: Array<Note> = [];
  noteAttachments: Array<NoteAttachment> = [];
  newNote: Note = {
    id: 0,
    dealId: this.dealId,
    noteTitle: '',
    note: '',
    noteby: '',
    editedby: '',
    lastupdatedatetime: null
  };

  newNoteAttachments: Array<NoteAttachment> = [];

  ngOnInit() {
    this.getAllNotes();
  }

  getAllNotes() {
    this.loading = true;
    this.ss.getAllNotes(this.dealId).subscribe(res => {
      this.notes = res['Notes'];
      this.noteAttachments = res['NoteAttachments'];

      this.notes.sort((a, b) => b.id - a.id);
      this.loading = false;
    })
  }

  fileChange(event: FileList) {
    console.log(event);

    for (let i = 0; i < event.length; i++) {

      const file = event[i];
      let noteAttachment: NoteAttachment;
      this.toBase64(file).then((result) => {
        console.log(result);
        let file_as_bas64 = new String(result).split(',')[1];
        noteAttachment = {
          id: 0,
          dealId: this.dealId,
          noteId: 0,
          filename: file.name,
          filetype: file.type,
          file: file_as_bas64,
          size: file.size,
          lastupdatedatetime: null
        };
        console.log(noteAttachment);

        if (this.newNoteAttachments.length < 5)
          this.newNoteAttachments.push(noteAttachment);
      });
    }
  }

  toBase64 = file => new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = () => resolve(reader.result);
    reader.onerror = error => reject(error);
  });

  saveNote() {
    this.newNote.dealId = this.dealId;
    if (this.newNote.noteTitle == '' && this.newNote.note == '' && this.newNoteAttachments.length == 0) {
      this._snackBar.open('Add something to save', '', { duration: 2000 });
      return false;
    }

    this.saving = true;
    this.ss.saveNote(this.newNote, this.newNoteAttachments).subscribe(res => {
      this.saving = false;
      if (res['StatusCode'] == '00') {

        let note = res['Note'];
        let NoteAttachments: Array<NoteAttachment> = res['NoteAttachments'];

        this.notes.push(note);
        this.noteAttachments = this.noteAttachments.concat(NoteAttachments);

        this.newNote = {
          id: 0,
          dealId: this.dealId,
          noteTitle: '',
          note: '',
          noteby: '',
          editedby: '',
          lastupdatedatetime: null
        };

        this.newNoteAttachments = [];
        this.showAddNewDiv = false;
        this.notes.sort((a, b) => b.id - a.id);

      } else {
        this._snackBar.open('Something went wrong!', '', { duration: 2500 });
      }
    }, error => { this.saving = false; })
  }

  deleteNote(note) {

    Swal.fire({
      title: 'Are you sure?',
      text: "You want to delete.",
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#3085d6',
      cancelButtonColor: '#d33',
      confirmButtonText: 'Yes, Delete!'
    }).then((result) => {
      if (result.value) {

        this.ss.deleteNote(note).subscribe(res => {
          if (res['StatusCode'] == '00') {

            for (let i = 0; i < this.notes.length; i++) {
              let __note = this.notes[i];
              if (__note.id === note.id) {
                this.notes.splice(i, 1);
              }
            }
          } else {
            this._snackBar.open('Something went wrong!', '', { duration: 2500 });
          }
        })
      }
    })
  }

  viewAttachment(attachment: NoteAttachment) {
    this.docView = false;
    this.ss.getNoteAttachment(attachment).subscribe(res => {
      let noteAtt: NoteAttachment = res['NoteAttachment'];
      if (res['StatusCode'] == '00') {

        if (noteAtt.filetype.includes('image/')) {

          var image = new Image();
          image.src = "data:" + noteAtt.filetype + ";base64," + noteAtt.file;

          var w = window.open("");
          w.document.write(image.outerHTML);

        } else {

        }
      }
    })
  }

  dataURItoBlob(dataURI) {

    const byteString = window.atob(dataURI);
    const arrayBuffer = new ArrayBuffer(byteString.length);
    const int8Array = new Uint8Array(arrayBuffer);
    for (let i = 0; i < byteString.length; i++) {
      int8Array[i] = byteString.charCodeAt(i);
    }
    const blob = new Blob([int8Array], { type: 'image/png' });
    return blob;
  }

}
