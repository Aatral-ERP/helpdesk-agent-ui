export class AgentLedger {

    public id: number = 0;
    public agentEmailId = '';
    public subject = '';
    public journal = '';
    public notes = '';
    public expenseId: number;
    public credit: number = 0;
    public debit: number = 0;
    public balance: number = 0;
    public filename: string = '';
    public paymentDate: Date = new Date();
    public createddatetime: Date;

}