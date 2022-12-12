import { Component, OnInit, Input } from '@angular/core';
import { Rating } from '../add-rating/Rating';

@Component({
  selector: 'app-view-rating',
  templateUrl: './view-rating.component.html',
  styleUrls: ['./view-rating.component.css']
})
export class ViewRatingComponent implements OnInit {

  constructor() { }

  @Input() rating: Rating;

  ngOnInit() {
    console.log(this.rating);
  }

}
