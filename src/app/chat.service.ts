import { EventEmitter, Injectable } from '@angular/core';
import { Message } from './message';
import { HubConnection, HubConnectionBuilder } from '@aspnet/signalr';

@Injectable({
  providedIn: 'root'
})
export class ChatService {
  chatServiceURL = 'https://localhost:44385/'; // can be changed if backend runs on different port

  messageReceived = new EventEmitter<Message>();  
  connectionEstablished = new EventEmitter<Boolean>();  
  
  private connectionIsEstablished = false;  
  private _hubConnection!: HubConnection;  
  
  constructor() {  
    this.createConnection();  
    this.registerOnServerEvents();  
    this.startConnection();  
  }  
  
  sendMessage(message: Message) {  
    this._hubConnection.invoke('NewMessage', message);  
    console.log("message is ", message);
  }  
  
  private createConnection() {  
    this._hubConnection = new HubConnectionBuilder()  
    .withUrl(this.chatServiceURL + 'MessageHub')  
    .build();  
    // this._hubConnection = new HubConnectionBuilder()  
    //   .withUrl(window.location.href + 'MessageHub')  
    //   .build();  
      console.log('window.locaion.href', window.location.href);
      console.log("this._hubConnection", this._hubConnection);
  }  
  
  private startConnection(): void {  
    this._hubConnection  
      .start()  
      .then(() => {  
        this.connectionIsEstablished = true;  
        console.log('Hub connection started');  
        this.connectionEstablished.emit(true);  
      })  
      .catch(err => {  
        console.log('Error while establishing connection, retrying...');  
        setTimeout( () => { this.startConnection(); }, 5000);  
      });  
  }  
  
  private registerOnServerEvents(): void {  
    this._hubConnection.on('MessageReceived', (data: any) => {  
      this.messageReceived.emit(data);  
    });  
  }  
}
