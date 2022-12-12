export class TaskFeature {
    featureId: number;
    teamId: number;
    name: string = '';
    description: string = '';
    startDate: Date;
    endDate: Date;
    progress: string = '0-0-0';
    priority: string = '';
    assignee: string = '';
    status: string = 'To Do';
    reporter: string = '';
    files: string = '';
    createddatetime: Date;
    lastupdatedatetime: Date;
}