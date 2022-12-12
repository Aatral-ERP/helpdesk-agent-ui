export class RoleMaster {
    public id: number = 0;
    public name: string = '';
    public institute: string = 'No Access';
    public product: string = 'No Access';
    public supplier: string = 'No Access';

    public leadManagement: string = 'No Access';
    public leadManagementAdmin: boolean = false;

    public sales: string = 'No Access';
    public salesAdmin: boolean = false;

    public purchaseInput: string = 'No Access';
    public accounting: string = 'No Access';
    public hr: string = 'No Access';
    public admin: string = 'No Access';

    public tickets: string = 'No Access';
    public ticketsAdmin: boolean = false;

    public reports: string = 'No Access';
    public defaultDashboard: string = 'No Access';

    public createdBy: string = '';
    public modifiedBy: string = '';
    public createddatetime: string;
    public lastupdatedatetime: string;

}