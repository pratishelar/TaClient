import { Component, OnInit } from '@angular/core';
import { member } from 'src/app/_models/member';
import { MembersService } from 'src/app/_services/members.service';
import { Observable } from 'rxjs';
import { Pagination } from 'src/app/_models/pagination';
import { UserParams } from 'src/app/_models/userParams';
import { AccountService } from 'src/app/_services/account.service';
import { User } from 'src/app/_models/user';
import { take } from 'rxjs/operators';

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
    private memberService: MembersService
  ) {
    this.userParams = this.memberService.getUserParamas();
  }

  ngOnInit(): void {
    this.loadMembers();
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
