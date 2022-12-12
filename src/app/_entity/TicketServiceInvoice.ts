import { Ticket } from '../_tickets/Ticket';
export class TicketServiceInvoice {
    id = 0;
    ticket: Ticket = new Ticket();
    title: any = '';
    invoiceNo: any = '';
    description: any = '';
    amount: any = '';
    gst: any = '';
    totalAmount: any = '';
    invoiceFileName: any = '';
    product: any = '';
    createddatetime: any = '';
    lastupdatedatetime: any = '';
    generatedBy: any = '';

    constructor(ticket, product, generatedBy) {
        this.ticket = ticket;
        this.product = product;
        this.generatedBy = generatedBy;
    }
}