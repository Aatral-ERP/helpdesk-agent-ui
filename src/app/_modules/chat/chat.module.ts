import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { ChatRoutingModule } from './chat-routing.module';
import { ChatComponent } from '../../chat/chat.component';
import { ChatSettingsComponent } from '../../chat-settings/chat-settings.component';
import { WhatsappTextComponent } from '../../whatsapp-text/whatsapp-text.component';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import { FormsModule } from '@angular/forms';


@NgModule({
  declarations: [ChatComponent, ChatSettingsComponent, WhatsappTextComponent],
  imports: [
    CommonModule,
    ChatRoutingModule,
    FontAwesomeModule,
    FormsModule
  ]
})
export class ChatModule { }
