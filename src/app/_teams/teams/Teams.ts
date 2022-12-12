export class Teams {
    id: number = 0;
    name: string = '';
    description: string;
    category: string = '';
    status: string = 'Created';
    workflows: string;
    opentasks: number;
    colorcode: string = '#00D4D4';
    leadName: string;
    leadEmail: string;
    createddatetime: Date;
}