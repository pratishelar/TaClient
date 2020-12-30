import { Component, OnInit } from '@angular/core';
import { AccountService } from './_services/account.service';
import { User } from './_models/user';
import { NgxSpinnerModule } from 'ngx-spinner';
import { PresenceService } from './_services/presence.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css'],
})
export class AppComponent implements OnInit {
  title = 'client';

  ngOnInit(): void {
    this.setCurrentUser();
  }

  constructor(private accountService: AccountService, private presense: PresenceService) {}

  setCurrentUser() {
    const user: User = JSON.parse(localStorage.getItem('user')!);
    if (user) {
      this.accountService.setCurrentUser(user);
      this.presense.createHubConnection(user);
    }
  }
}
