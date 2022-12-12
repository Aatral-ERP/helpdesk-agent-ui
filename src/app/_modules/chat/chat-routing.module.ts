import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { RoleGuardService } from 'src/app/_services/role-guard.service';
import { ChatComponent } from '../../chat/chat.component';
import { ChatSettingsComponent } from '../../chat-settings/chat-settings.component';
import { WhatsappTextComponent } from '../../whatsapp-text/whatsapp-text.component';



const routes: Routes = [
  {path: 'chatpage', component: ChatComponent, canActivate: [RoleGuardService]},
  {path: 'whatsapp', component: WhatsappTextComponent, canActivate: [RoleGuardService]},
  {path: 'chat-settings', component: ChatSettingsComponent, canActivate: [RoleGuardService]},
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class ChatRoutingModule { }
