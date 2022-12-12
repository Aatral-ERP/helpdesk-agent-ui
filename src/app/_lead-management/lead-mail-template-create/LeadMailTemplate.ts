export class LeadMailTemplate {

    id: number = 0;
    title: string = '';
    subject: string = '';
    message: string = '';
    enabled: boolean = true;

    status: string = 'All';
    category: string = 'All';
    industryType: string = 'All';
    state: string = 'All';
    frequency: string = 'Daily';

    createddatetime: Date = null;
    lastupdatedatetime: Date = null;

    _status: Array<string> = [];
    _states: Array<string> = [];
    _industryTypes: Array<string> = [];
    _categories: Array<string> = [];

    files: string = '';

}