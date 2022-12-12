import { DatePipe } from '@angular/common';


export class AddWorkingDay {

    constructor(private date: Date) {
        this.workingDate = this.date;
        this.weekday = new Date(this.workingDate).toLocaleString('en-us', { weekday: 'long' });
        let datePipe = new DatePipe('en-us');
        this.shortdate = datePipe.transform(this.workingDate, 'dd/MM/yyyy');
    }

    public id = 0;
    public workingDate = new Date();
    public weekday = '';
    public createddatetime: any;
    public shortdate = '';

}