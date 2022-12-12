import { Component, OnInit, Input, Output } from '@angular/core';
import { EventEmitter } from '@angular/core';

@Component({
  selector: 'app-pagination',
  templateUrl: './pagination.component.html',
  styleUrls: ['./pagination.component.css']
})
export class PaginationComponent implements OnInit {

  constructor() { }

  @Input() setCount: number = 0;
  @Input() perPage: number = 0;
  @Input() currentPage: number = 1;
  @Output() page = new EventEmitter();
  pageNos = [];
  totalPages: number = 0;

  paginate() {
    console.log(this.setCount, this.perPage, this.currentPage);
    let sc = +this.setCount;
    let pp = +this.perPage;
    this.totalPages = Math.ceil(sc / pp);
    let l1 = this.currentPage - 1, l2 = this.currentPage - 2, l3 = this.currentPage - 3;
    let r1 = this.currentPage + 1, r2 = this.currentPage + 2, r3 = this.currentPage + 3;
    this.pageNos = [];
    for (let i = 1; i <= this.totalPages; i++) {
      // console.log(i, i == l1 || i == l2 || i == l3 || i == r1 || i == r2 || i == r3 || i == this.currentPage)
      let show = false;
      if (i == l1 || i == l2 || i == l3 || i == r1 || i == r2 || i == r3 || i == this.currentPage)
        show = true;

      this.pageNos.push({ pageNo: i, show: show });
    }
  }


  emitPageNoChange(pageNo) {
    this.page.emit(pageNo);
    this.paginate();
  }

  ngOnInit(): void {
    this.paginate();
  }

}
