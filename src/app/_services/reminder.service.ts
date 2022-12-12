import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';
import { environment } from 'src/environments/environment';
import Swal from 'sweetalert2';
import { Reminder } from '../_reminders/create-reminder/Reminder';
import { AuthService } from './auth.service';

@Injectable({
  providedIn: 'root'
})
export class ReminderService {

  constructor(public auth: AuthService, private http: HttpClient) { }

  private remindersObs$: BehaviorSubject<Array<Reminder>> = new BehaviorSubject(null);

  getProfileObs(): Observable<Array<Reminder>> {
    return this.remindersObs$.asObservable();
  }
  setProfileObs(reminders: Array<Reminder>) {
    this.remindersObs$.next(reminders);
  }

  saveReminder(reminders: Array<Reminder>) {
    return this.http.post(environment.apiUrl + 'reminders/add-reminders', { reminders });
  }

  getReminders(recurringId) {
    return this.http.get(environment.apiUrl + 'reminders/get-reminders/' + recurringId);
  }

  loadReminderNotificationData() {

    let _filters = {
      agentEmailId: this.auth.getLoginEmailId(),
      eventDateTimeFrom: null,
      eventDateTimeTo: null
    }

    this.searchReminders(_filters).subscribe(resp => {
      if (resp['StatusCode'] == '00') {
        if (resp['Reminders']) {
          this.setProfileObs(resp['Reminders']);

          let reminders: Array<Reminder> = resp['Reminders'];

          setInterval(() => {
            let date = new Date();
            console.log(date);
            reminders
              .filter(rem => new Date(rem.eventDateTime).getFullYear() == date.getFullYear())
              .filter(rem => new Date(rem.eventDateTime).getMonth() == date.getMonth())
              .filter(rem => new Date(rem.eventDateTime).getDate() == date.getDate())
              .filter(rem => new Date(rem.eventDateTime).getHours() == date.getHours())
              .filter(rem => new Date(rem.eventDateTime).getMinutes() == date.getMinutes())
              .forEach(rem => {
                console.log(rem);
                Swal.fire({
                  title: rem.subject,
                  text: rem.description,
                  icon: 'info',
                  showCancelButton: false,
                  confirmButtonColor: '#3085d6',
                  cancelButtonColor: '#d33',
                  confirmButtonText: 'Ok'
                })
              })

          }, 60000);

        }
      }
    })
  }

  searchReminders(filters) {
    return this.http.post(environment.apiUrl + 'reminders/search-reminders', filters);
  }

  deleteReminders(reminders) {
    return this.http.post(environment.apiUrl + 'reminders/delete-reminders', { reminders });
  }

  editReminders(reminders) {
    return this.http.post(environment.apiUrl + 'reminders/edit-reminders', { reminders });
  }


}
