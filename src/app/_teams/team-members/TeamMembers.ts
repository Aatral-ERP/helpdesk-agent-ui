export class TeamMembers {
    id: number;
    teamId: number;
    memberEmailId: string;
    memberRole: string;
    createddatetime: string;
    openTasks: number = 0;
    closedTasks: number = 0;
    rating: number = 0;
}