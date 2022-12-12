export class TeamSetting {
    id: number = 0;
    teamId: number = 0;
    adminCanCreateTasks: boolean = false;
    adminCanModifyOthersTasks: boolean = false;
    membersCanCreateTasks: boolean = false;
    membersCanCloseTaskOfOwn: boolean = false;
    membersCanViewOthersTasks: boolean = false;
    membersCanCommentOthersTasks: boolean = false;
    viewerCanCommentTasks: boolean = false;
    lastUpdatedBy: string;
    lastupdatedatetime: Date;
}