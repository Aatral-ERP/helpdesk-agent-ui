import { Component, OnInit, OnDestroy, ElementRef, ViewChild } from '@angular/core';

// import { BehaviorSubject} from 'rxjs';
import * as Stomp from 'stompjs';
import * as SockJS from 'sockjs-client';
import { faPaperPlane } from '@fortawesome/free-solid-svg-icons';

import { Message } from './Message';
import { ToastrService } from 'ngx-toastr';
import { UtilService } from '../_services/util.service';
import { WebSocketAPI } from '../_services/WebSocketAPI';
import { ChatService } from '../_services/chat.service';
import { AuthService } from '../_services/auth.service';
declare var $: any;
declare var jQuery: any;



@Component({
  selector: 'app-chat',
  templateUrl: './chat.component.html',
  styleUrls: ['./chat.component.css']
})
export class ChatComponent implements OnInit, OnDestroy {

  faPaperPlane = faPaperPlane;
  webSocketAPI: WebSocketAPI;
  greeting: any;
  str: string;
  AgentDetails = null;

  photo = null;
  agentName = '';
  employeeId = '';

  agent_email_id = '';

  msgPojo: Message = new Message();
  user_email_id = '';
  messages: Array<Message> = [];
  Messages: Array<Message> = [];
  active_chat: any = {};
  ChatSettings: Array<any> = [];
  RecentMessageMembers: Array<any> = [];

  loading = true;

  msg: Array<any> = [];
  activeEmployeeId = '';
  isAgent = false;


  private myScrollContainer: ElementRef;

  constructor(private util: UtilService, private cs: ChatService, private tst: ToastrService, public auth: AuthService) {

    setInterval(() => {
      if (this.stompClient === undefined || this.stompClient === null) {
        console.log("socket connected::" + this.stompClient);
        this._connect();
      } else {
        try {
          let stomp = JSON.parse(JSON.stringify(this.stompClient));
          console.log("socket connected::" + stomp['connected']);
          if (stomp['connected'] == false)
            this._connect();
        } catch (error) {
          console.log(error);
        }
      }
    }, 5000);

    if (localStorage.getItem('photo')) {
      let photo = localStorage.getItem('photo');
      if (photo !== undefined && photo !== null && photo != '') {
        $('#profilePhoto').attr('src', `data:image/png;base64,${photo}`);
        this.photo = 'data:image/png;base64,' + photo;
      }
    }
  }

  ngOnDestroy() {
    this.disconnect();
  }

  ngOnInit() {
    //this.getRecentMessageMembers();
    this.auth.getAgentDetailsObs().subscribe(ad => this.AgentDetails = ad);
    this.photo = this.AgentDetails.photo;
    this.agentName = this.AgentDetails.firstName;
    this.employeeId = this.AgentDetails.employeeId;
    this.agent_email_id = this.AgentDetails.emailId;

  }

  getRecentMessageMembers() {
    this.cs.getRecentMessageMembers(this.agent_email_id).subscribe(res => {
      console.log(res);
      if (res['RecentMessageMembers']) {
        this.RecentMessageMembers = res['RecentMessageMembers'];
      };
      this.sortRecentMessageMembers();
    });
  }

  sortRecentMessageMembers() {
    // console.log("Before Sort:::",this.RecentMessageMembers);
    this.RecentMessageMembers.sort((a, b) => b.lastmsgid - a.lastmsgid);
    // console.log("After Sort::::",this.RecentMessageMembers);
  }

  getPhotoUrl(photo) {
    if (photo !== undefined && photo !== null && photo != '') {
      $('#profilePhoto').attr('src', `data:image/png;base64,${photo}`);
      return 'data:image/png;base64,' + photo;
    } else {
      return 'https://ptetutorials.com/images/user-profile.png';
    }
  }

  connect() {
    this._connect();
  }

  disconnect() {
    this._disconnect();
  }

  sendMessage() {
    if (this.str == '')
      return;
    let str = this.str;
    this.str = '';
    this._send(str,);
  }

  handleMessage(message) {
    console.log(message);
    this.greeting = message;
  }

  //  WebSocket Config

  webSocketEndPoint: string = this.util.getBaseURL() + 'ws';
  topic: string = "/topic/greetings/";
  chatid = '';
  stompClient: any;
  // public _message = new BehaviorSubject<any>([]);


  _connect() {
    console.log("Initialize WebSocket Connection");
    // this.stompClient = undefined;
    console.log(this.stompClient);

    if (this.stompClient === undefined || this.stompClient['connected'] == false) {
      let ws = new SockJS(this.webSocketEndPoint);
      this.stompClient = Stomp.over(ws);
      const _this = this;
      console.log("Inside stompClient connect");
      _this.stompClient.connect({}, function (frame) {
        _this.stompClient.subscribe(_this.topic + _this.agent_email_id, function (sdkEvent) {
          _this.onMessageReceived(sdkEvent);
        });

        _this.getRecentMessageMembers();
        //_this.stompClient.reconnect_delay = 2000;

      }, this.errorCallBack);
    }
  };

  _disconnect() {
    if (this.stompClient !== null && this.stompClient !== undefined) {
      this.stompClient.disconnect();
    }
    console.log("Disconnected");
  }

  // on error, schedule a reconnection attempt
  errorCallBack(error) {
    console.log("errorCallBack -> " + error)
    setTimeout(() => {
      this._connect();
    }, 5000);
  }

  /**
   * Send message to sever via web socket
   * @param {*} message 
   */

  _send(str) {

    let _message_to_send = {
      chatId: this.getChatID(this.activeEmployeeId),
      agentMailId: this.agent_email_id,
      userMailId: this.activeEmployeeId,
      adminMemberCode: this.getAdminMemberCode(this.active_chat.agent_email_id),
      message: str,
      messageBy: this.agent_email_id,
      messageByName: this.agentName,
      userEmployeeId: this.activeEmployeeId,
      agentEmployeeId: this.employeeId,
      chatEmployeeId: this.activeEmployeeId


    };
    console.log(_message_to_send);
    let stomp = JSON.parse(JSON.stringify(this.stompClient));
    if (this.stompClient === null || this.stompClient === undefined) {
      this._connect();
    } else if (!stomp.connected) {
      this._connect();
    }
    this.stompClient.send("/app/hello/" + this.user_email_id, {}, JSON.stringify(_message_to_send));
  }


  onMessageReceived(message) {
    let _new_message = JSON.parse(message.body);
    console.log(_new_message);
    this.pushMessageToLocalStorage(_new_message);
    if (_new_message.messageBy != this.agent_email_id) {
      this.tst.success(_new_message.message, _new_message.messageBy, {
        positionClass: 'toast-bottom-right',
      });
    }

    //for Rearranging Recent MessageMembers
    let _member_available_in_recent = false;
    this.RecentMessageMembers.forEach(mm => {
      console.log(mm.chat_id, "  ", _new_message.chatId, mm.chat_id == _new_message.chatId)
      if (mm.chat_id == _new_message.chatId) {
        _member_available_in_recent = true;
        console.log(mm);
        mm.last_message = _new_message.message;
        mm.last_message_datetime = _new_message.messageDateTime;
        mm.last_message_by = _new_message.messageBy;
        mm.lastmsgid = _new_message.id;

        if (_new_message.messageBy != this.employeeId) {
          if (this.active_chat.chat_id != _new_message.chatId)
            mm.is_read = 0;
        }
        console.log(mm);
      }
    });
    this.sortRecentMessageMembers();
    console.log("_member_available_in_recent::::" + _member_available_in_recent);
    if (!_member_available_in_recent) {
      console.log("_member_not_available_in_recent Calling this.getRecentMessageMembers()")
      this.getRecentMessageMembers();
    }
  }

  getChatID(activeChatAgentId): String {

    let chat_id = '';
    chat_id = 'agent' + '||' + activeChatAgentId;
    return chat_id;
  }

  getAdminMemberCode(activeChatAgentId): String {
    let adminEmloyeeId = '';
    adminEmloyeeId = this.employeeId;

    return adminEmloyeeId;
  }

  changeActiveChat(user_email_id) {
    console.log(this.user_email_id);
    this.active_chat = this.active_chat;
    this.messages = [];

    this.activeEmployeeId = user_email_id;
    this.cs.getMessages(user_email_id, this.getLastMsgId()).subscribe(res => {
      console.log(res);
      this.isAgent = true;
      this.Messages = res['Messages'];
      this.user_email_id = user_email_id;
      console.log('*******', this.user_email_id);
      if (res['Messages']) {
        let chatId = this.getChatID(user_email_id);
        localStorage.setItem(chatId + '', JSON.stringify(res['Messages']));
        this.loadMessageFromLocalStorage();
      }
    });

    this.RecentMessageMembers.forEach(mm => {
      let _is_read: String = new String(mm.is_read);
      console.log(mm.agent_email_id, _is_read, _is_read.includes('0'));
      if (mm.agent_email_id == this.active_chat['agent_email_id']) {
        mm.unread_messages = false;
        mm.is_read = '1';
      }
    });

    setTimeout(() => {
      this.scrollToBottom();
    }, 500)
  }

  getLastMsgId() {
    let lastMsgId = 0;
    if (this.messages.length > 0) {
      let lastMessage: {} = this.messages[0];
      lastMsgId = lastMessage['id'];
    }
    return lastMsgId;
  }

  loadOldMessages() {
    this.cs.getMessages(this.active_chat['user_email_id'], this.getLastMsgId()).subscribe(res => {
      console.log(res);
      let _messages: Array<any> = [];
      let _oldMessages: Array<any> = res['Messages'];
      if (_oldMessages.length > 0) {
        let chatId = this.getChatID(this.active_chat['agent_email_id']);
        if (localStorage.getItem(chatId + '')) {
          _messages = _messages.concat(Array.from(JSON.parse(localStorage.getItem(chatId + ''))));
        }
        _messages = _messages.concat(Array.from(JSON.parse(JSON.stringify(res['Messages']))));
        console.log(_messages);
        localStorage.setItem(chatId + '', JSON.stringify(_messages));
        this.loadMessageFromLocalStorage();
      } else {
        this.tst.info('No More messages.');
      }
    });
  }

  loadMessageFromLocalStorage() {
    let _messages = [];
    let ChatId = this.getChatID(this.user_email_id) + '';
    if (localStorage.getItem(ChatId)) {
      _messages = JSON.parse(localStorage.getItem(ChatId));
    }
    this.messages = _messages;
    this.messages.sort((a, b) => {
      return a.id - b.id;
    });

  }

  pushMessageToLocalStorage(message) {
    let _messages = [];
    let alreadyMsgAvailable = false;
    if (localStorage.getItem(message['chatId'])) {
      _messages = JSON.parse(localStorage.getItem(message['chatId']));
      let _new_message_id = message['id'];

      _messages.forEach(msg => {
        // console.log(msg['id'] , _new_message_id , msg['id'] == _new_message_id);
        if (msg['id'] == _new_message_id)
          alreadyMsgAvailable = true;
      });
    }
    if (!alreadyMsgAvailable) {
      _messages.push(message);
    }

    localStorage.setItem(message['chatId'], JSON.stringify(_messages));


    setTimeout(() => {
      this.scrollToBottom();
    }, 500)
    this.loadMessageFromLocalStorage();

  }

  scrollToBottom(): void {
    console.log("scroll to end")
    try {
      this.myScrollContainer.nativeElement.scrollTop = this.myScrollContainer.nativeElement.scrollHeight;
    } catch (err) { }
  }


  toUnicode(text) {
    console.log(unescape(text));
    return unescape(text);
  }


}