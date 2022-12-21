import { Teams } from "../teams/Teams";

export class Task {
    taskId: number = 0;
    teamId: number;
    instituteId: number;
    instituteName: string = '';
    subject: string = '';
    subtasks: string;
    description: string = '';
    status: string = 'To Do';
    assignee: string = '';
    reporter: string = '';
    priority: string = 'Not Preferred';
    dueDateTime: Date;
    label: string = '';
    files: string;
    watchers: string;
    createdBy: string;
    lastUpdatedBy: string;
    createddatetime: Date;
    lastupdatedatetime: Date;

}