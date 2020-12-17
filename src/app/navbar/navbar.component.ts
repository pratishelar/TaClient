import { Component, OnInit } from '@angular/core';
import { AccountService } from '../_services/account.service';
import { Observable } from 'rxjs';
import { User } from '../_models/user';
import { Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';

@Component({
  selector: 'app-navbar',
  templateUrl: './navbar.component.html',
  styleUrls: ['./navbar.component.css'],
})
export class NavbarComponent implements OnInit {
  model: any = {};
  user:any ={};

  constructor(
    public accountservice: AccountService,
    private router: Router,
    private toastr: ToastrService
  ) {}

  ngOnInit(): void {
   this.getcurrentUser();
  }

  logout() {
    this.router.navigateByUrl('/');
    this.accountservice.logout();
  }

  getcurrentUser() {
    this.accountservice.currentUser$.subscribe(
      (user) => {
        this.user = user;
        console.log(this.user);
      },
      (error) => {
        console.log(error);
      }
    );
  }
}
