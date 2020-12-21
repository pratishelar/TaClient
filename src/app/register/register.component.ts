import { Component, OnInit } from '@angular/core';
import { AccountService } from '../_services/account.service';
import { Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';

@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.css'],
})
export class RegisterComponent implements OnInit {
  model: any = {};
  validationErrors: string[] = [];

  constructor(private accountService: AccountService, private router: Router, private toastr: ToastrService) {}

  ngOnInit() {}

  register() {
    this.accountService.register(this.model).subscribe(
      (response) => {
        this.router.navigateByUrl('/dashboard')
        console.log(response);
      },
      (error) => {
        console.log(error);
        this.validationErrors = error;
      }
    );
  }

  cancel() {}
}
