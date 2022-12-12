export class TeamPushNotifySetting {
    id: number = 0;
    teamId: number;
    action: string;
    lead: boolean;
    reporter: boolean;
    assignee: boolean;
    institute: boolean;
    watchers: boolean;
    viewers: boolean;
    lastUpdatedBy: string;
    lastupdatedatetime: Date;
}