
import { Institute } from 'src/app/_onboard/inst-registration/institute';
import { Agent } from 'src/app/_profile/agent-profile/Agent';

export class SiteAttendance {
    public agent: Agent;
    createddatetime: Date;
    endTime: Date;
    id: number;
    institute: Institute;
    lastupdatedatetime: Date;
    startlatitude: any;
    startlongitude: any;
    endlatitude: any;
    endlongitude: any;
    startTime: Date;
}