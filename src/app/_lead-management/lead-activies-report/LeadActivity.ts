import { Agent } from "src/app/_profile/agent-profile/Agent";
import { Lead } from "../lead-create/Lead";
import { LeadMeeting } from "../lead-meeting/LeadMeeting";

export class LeadActivity {

    lead: Lead = null;
    agent: Agent = null;
    leadMeeting: LeadMeeting = null;
} 