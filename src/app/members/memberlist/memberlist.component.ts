import { Component, OnInit } from '@angular/core';
import { member } from 'src/app/_models/member';
import { MembersService } from 'src/app/_services/members.service';
import { Observable } from 'rxjs';
import { Pagination } from 'src/app/_models/pagination';
import { UserParams } from 'src/app/_models/userParams';
import { AccountService } from 'src/app/_services/account.service';
import { User } from 'src/app/_models/user';
import { take } from 'rxjs/operators';
import { PresenceService } from 'src/app/_services/presence.service';

@Component({
  selector: 'app-memberlist',
  templateUrl: './memberlist.component.html',
  styleUrls: ['./memberlist.component.css'],
})
export class MemberlistComponent implements OnInit {
  members: member[] = [];
  pagination: Pagination;
  userParams: UserParams;
  user: User;

  constructor(
    private memberService: MembersService, private presence: PresenceService
  ) {
    this.userParams = this.memberService.getUserParamas();
  }

  ngOnInit(): void {
    this.loadMembers();
    console.log(this.presence.onlineUsers$);
  }

  loadMembers() {
    this.memberService.setUserParamas(this.userParams);
    this.memberService.getMembers(this.userParams).subscribe((members) => {
      this.members = members.result;
      this.pagination = members.pagination;
    });
  }

  pageChanged(event: any) {
    this.userParams.pageNumber = event.page;
    this.memberService.setUserParamas(this.userParams);
    this.loadMembers();
  }

  resetFilters(){
    this.userParams = this.memberService.resetUserParams();
    this.loadMembers();
  }


}
