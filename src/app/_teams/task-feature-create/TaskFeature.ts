export class TaskFeature {
    featureId: number = 0;
    teamId: number;
    name: string = '';
    description: string = '';
    startDate: Date;
    endDate: Date;
    progress: string = '0-0-0';
    priority: string = 'Not Preferred';
    assignee: string = '';
    status: string = 'To Do';
    reporter: string = '';
    files: string = '';
    createddatetime: Date;
    lastupdatedatetime: Date;
}
