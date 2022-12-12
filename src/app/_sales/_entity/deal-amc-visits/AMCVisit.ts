export class AMCVisit {
    id: number = 0;
    dealId: number = 0;
    ticketId: number = 0;
    agentEmailId: string;
    visitDate: Date = new Date();
    status: String = 'Created';
    subject: String = '';
    description: String;
    createddatetime: Date;
}