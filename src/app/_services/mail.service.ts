import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from 'src/environments/environment';
import { MailProperties } from '../_admin/mail-setting-properties/MailProperties';

@Injectable({
    providedIn: 'root'
})
export class MailService {

    constructor(private http: HttpClient) { };

    getMailSettingProperties(configFor) {
        return this.http.get(environment.apiUrl + 'mail/get-mail-properties/' + configFor);
    }

    saveMailProperties(property: MailProperties) {
        return this.http.post(environment.apiUrl + 'mail/save-mail-properties', property);
    }

    deleteMailProperty(property: MailProperties) {
        return this.http.post(environment.apiUrl + 'mail/delete-mail-properties', property);
    }

    sendTestMail(configName: string, mailTo: string) {
        return this.http.post(environment.apiUrl + 'mail/send-test-mail', { configName, mailTo });
    }

}
