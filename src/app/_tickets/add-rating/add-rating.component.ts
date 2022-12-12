import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import { Ticket } from '../tickets/Ticket';
import Swal from 'sweetalert2';
import { TicketService } from 'src/app/_services/ticket.service';
import { Rating } from './Rating';

@Component({
  selector: 'app-add-rating',
  templateUrl: './add-rating.component.html',
  styleUrls: ['./add-rating.component.css']
})
export class AddRatingComponent implements OnInit {

  constructor(private ts: TicketService) {
  }

  @Input() ticket: Ticket;
  rating: Rating = new Rating();
  @Output() result = new EventEmitter();

  ngOnInit() {
    console.log(this.ticket);
    this.rating.ticketId = this.ticket.ticketId;
  }

  addRating() {
    if (this.rating.rating == 0) {
      Swal.fire('', 'Add Rating', 'warning');
      return false;
    } else {
      this.rating.ticketId = this.ticket.ticketId;
      console.log(this.rating)
      this.ts.addRating(this.rating).subscribe(res => {
        console.log(res);
        if (res['StatusCode'] == '00') {
          Swal.fire('', 'Rating Success', 'success');
          this.result.emit('rating_success');
        } else {
          Swal.fire('', 'Failed to Add Rating , Try Later!', 'error');
        }
      })
    }
  }

}
