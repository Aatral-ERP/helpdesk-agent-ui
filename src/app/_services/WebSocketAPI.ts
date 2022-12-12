import * as Stomp from 'stompjs';
import * as SockJS from 'sockjs-client';
import { ChatComponent } from '../chat/chat.component';

export class WebSocketAPI {
    webSocketEndPoint: string = 'http://localhost:9090/autolib-api/ws';
    topic: string = "/topic/greetings/"+this.getChatID();
    chatid = '';
    stompClient: any;
    chatComponent: ChatComponent;
    constructor(chatComponent: ChatComponent){
        this.chatComponent = chatComponent;
    }
    _connect() {
        console.log("Initialize WebSocket Connection");
        let ws = new SockJS(this.webSocketEndPoint);
        this.stompClient = Stomp.over(ws);
        const _this = this;
        _this.stompClient.connect({}, function (frame) {
            _this.stompClient.subscribe(_this.topic, function (sdkEvent) {
                _this.onMessageReceived(sdkEvent);
            });
            //_this.stompClient.reconnect_delay = 2000;
        }, this.errorCallBack);
    };

    _disconnect() {
        if (this.stompClient !== null) {
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
    _send(message) {
        console.log("calling logout api via web socket");
        this.stompClient.send("/app/hello/"+this.getChatID(), {}, JSON.stringify(message));
    }

    onMessageReceived(message) {
        console.log("Message Recieved from Server :: " + JSON.stringify(message.body));
        this.chatComponent.handleMessage(JSON.parse(message.body));
    }

    getChatID():String{
        
        let url_string = window.location.href;
        let url = new URL(url_string);
        let _chatid = url.searchParams.get("chatid");
        console.log(_chatid , url.searchParams.get("chatidsssss"));

        return _chatid;
    }
}