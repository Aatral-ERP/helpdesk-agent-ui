import { Component, OnInit } from '@angular/core';
import { ChatService } from '../_services/chat.service';
import { ToastrService } from 'ngx-toastr';
import { faSearch } from '@fortawesome/free-solid-svg-icons';

@Component({
  selector: 'app-chat-settings',
  templateUrl: './chat-settings.component.html',
  styleUrls: ['./chat-settings.component.css']
})
export class ChatSettingsComponent implements OnInit {

  faSearch = faSearch;
  ChatSettings = [];
  selectedUser = [];
  loadStats = true;
  loading = false;
  constructor(private cs: ChatService, private tst: ToastrService) { }

  ngOnInit(): void {
    this.loadUserDetails();
  }
  loadUserDetails() {
    this.loading = true;
    this.cs.getChatSettings().subscribe(res => {
      this.ChatSettings = res['ChatSettings'];
      console.log(this.ChatSettings);
      this.loading = false;
    }, error => { console.error(error); this.loading = false; });
  }
  save() {

    console.log(this.ChatSettings);
    this.loading = true;
    this.cs.getSaveDetails(this.ChatSettings).subscribe(res => {
      this.loading = false;
      if (res['StatusCode'] == '00') {
        this.loadUserDetails();
        this.tst.success('Saved Successfully');
      } else if (res['StatusCode'] == '02') {
        this.tst.error(res['StatusDesc']);
      } else if (res['StatusCode']) {
        this.tst.info(res['StatusDesc']);
      } else {
        this.tst.error('Something went wrong');
      }
    }, error => { this.loading = false; console.log(error) });
  }

  userSelectionEmitted(event) {
    console.log('inside setting ts');
    this.selectedUser = event;
    console.log(this.selectedUser);
    this.loadStats = false;
    this.save();
  }
}

