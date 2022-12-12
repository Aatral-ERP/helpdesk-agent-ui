import { Component, OnInit } from '@angular/core';
import { ToastrService } from 'ngx-toastr';
import Swal from 'sweetalert2';
import { InstituteService } from 'src/app/_services/institute.service';

@Component({
  selector: 'app-change-password',
  templateUrl: './change-password.component.html',
  styleUrls: ['./change-password.component.css']
})
export class ChangePasswordComponent implements OnInit {

  old_password = '';
  new_password = '';
  confirm_password = '';
  constructor(private is: InstituteService, private tst: ToastrService) { }

  ngOnInit() {
  }

  clear() {
    window.location.reload();
  }
  changePassword() {
    this.is.changePassword(this.old_password, this.new_password,).subscribe(res => {
      console.log(res);
      if (res['StatusCode'] == '00') {
        Swal.fire('', res['StatusDesc']);
      }
      else {
        Swal.fire('', res['StatusDesc'], 'warning');
      }
    })
  }

  logout() {
    localStorage.clear();
    window.location.href = "./";
  }

}
