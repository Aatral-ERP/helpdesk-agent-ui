import { AfterViewChecked, AfterViewInit, Component, OnInit, ViewChild } from '@angular/core';
import { Calendar, CalendarOptions, FullCalendarComponent } from '@fullcalendar/angular';
import { TeamsService } from 'src/app/_services/teams.service';
import { Task } from '../task-create/Task';

@Component({
  selector: 'app-calendar',
  templateUrl: './calendar.component.html',
  styleUrls: ['./calendar.component.css']
})
export class CalendarComponent implements OnInit, AfterViewInit {

  @ViewChild('calendar', { static: true }) calendarComponent: FullCalendarComponent;
  calendarAPI: Calendar;
  currentTitle = '';
  events: Array<any> = [];

  constructor(private ts: TeamsService) { }
  loading = false;

  ngOnInit() {
  }

  ngAfterViewInit() {

    console.log(this.calendarComponent.getApi());
    this.currentTitle = this.calendarComponent.getApi().currentData.viewTitle;
    let startDate = this.calendarComponent.getApi().currentData.dateProfile.activeRange.start;
    let endDate = this.calendarComponent.getApi().currentData.dateProfile.activeRange.end;

    this.getMyCalendarTasksEvents(startDate, endDate);
  }

  getMyCalendarTasksEvents(startDate, endDate) {
    let req = { assignee: [this.ts.auth.getLoginEmailId()], createddatetimeFrom: startDate, createddatetimeTo: endDate }

    this.ts.getMyCalendarTasksEvents(req).subscribe(resp => {
      if (resp['StatusCode'] == '00') {
        this.events = [];
        let _tasks: Array<Task> = resp['Tasks'];
        _tasks.forEach(task => {

          let event: any = {
            id: task.taskId,
            title: '#' + task.taskId + '-' + task.subject,
            url: `./teams/view/${task.teamId}/dashboard?action=view-task&action-id=${task.taskId}`,

          }
          if (task.status == 'To Do')
            event.color = 'gray';
          else if (task.status == 'Done')
            event.color = 'green';
          else
            event.color = 'blue';

          if (task.dueDateTime != null)
            event.start = task.dueDateTime;
          else
            event.start = task.createddatetime;

          this.events.push(event);
        });
        this.calendarOptions.events = this.events;
        this.calendarOptions.dayPopoverFormat = { month: 'long', day: 'numeric', year: 'numeric' };
      }
    })
  }

  calendarOptions: CalendarOptions = {
    initialView: 'dayGridMonth',
    headerToolbar: false,
    height: 500,// bind is important!
    events: this.events
  };


  changeCalendarPrevMonth() {
    this.calendarComponent.getApi().prev();
    console.log(this.calendarComponent.getApi());
    this.currentTitle = this.calendarComponent.getApi().currentData.viewTitle;
    let startDate = this.calendarComponent.getApi().currentData.dateProfile.activeRange.start;
    let endDate = this.calendarComponent.getApi().currentData.dateProfile.activeRange.end;

    this.getMyCalendarTasksEvents(startDate, endDate);
  }

  changeCalendarNextMonth() {
    this.calendarComponent.getApi().next();
    console.log(this.calendarComponent.getApi());
    this.currentTitle = this.calendarComponent.getApi().currentData.viewTitle;
    let startDate = this.calendarComponent.getApi().currentData.dateProfile.activeRange.start;
    let endDate = this.calendarComponent.getApi().currentData.dateProfile.activeRange.end;

    this.getMyCalendarTasksEvents(startDate, endDate);
  }

}
