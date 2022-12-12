import { Injectable } from '@angular/core';
import { LoginService } from './login.service';
import { UtilService } from './util.service';
import { HttpClient } from '@angular/common/http';

@Injectable({
  providedIn: 'root'
})
export class ChatService {
  
  constructor(private ls: LoginService, private util: UtilService, private http: HttpClient) { }

  
  getChatSettings() {
    let request = { ChannelName: "WEB" };
    console.log(request);
    return this.http.post(this.util.getBaseURL() + 'chat/getChatSettings', request);
  }

  getSaveDetails(chatSettings){
    let request = { ChannelName: "WEB" , ChatSettings : chatSettings };
    console.log(request);
    return this.http.post(this.util.getBaseURL() + 'chat/saveChatSettings', request);

  }

  getMessages(user_email_id , lastid = 0) {

    let chat_id = '';
    let chat_id2 = '';

      chat_id = user_email_id+'||'+ 'agent';
      chat_id2 = 'agent'+'||'+ user_email_id;

    let request = {
      ChannelName: "WEB", chat_id: chat_id, lastid: lastid,chat_id2:chat_id2
    }
    console.log(request);
    return this.http.post(this.util.getBaseURL() + 'chat/getMessages', request);
  }

  getRecentMessageMembers(agent_email_id) {
    let request = {
      ChannelName: "WEB",
     agent_email_id: agent_email_id
    }
    return this.http.post(this.util.getBaseURL() + 'chat/getRecentMessageMembers', request);
  }
  getUnreadCount(chatEmployeeId){
    return this.http.get(this.util.getBaseURL() + 'chat/getUnreadMessageCount/'+chatEmployeeId);
  }
  
}
