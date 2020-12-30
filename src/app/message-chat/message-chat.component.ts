import { Component, OnInit, ViewChild, ElementRef } from '@angular/core';
import { member } from '../_models/member';
import { Pagination } from '../_models/pagination';
import { UserParams } from '../_models/userParams';
import { User } from '../_models/user';
import { MembersService } from '../_services/members.service';
import { MessageService } from '../_services/message.service';
import { Message } from '../_models/message';
import { NgForm } from '@angular/forms';
import { PresenceService } from '../_services/presence.service';
import { AccountService } from '../_services/account.service';
import { ActivatedRoute } from '@angular/router';
import { take } from 'rxjs/operators';

@Component({
  selector: 'app-message-chat',
  templateUrl: './message-chat.component.html',
  styleUrls: ['./message-chat.component.css'],
})
export class MessageChatComponent implements OnInit {
  @ViewChild('messageForm') messageForm: NgForm;
  @ViewChild('commentEl') comment: ElementRef;
  scrolledToBottom = false;

  member;
  members: member[] = [];
  pagination: Pagination;
  userParams: UserParams;
  user: User;
  public isClicked = [];
  

  messageContent: string;
  selectedItem;

  constructor(
    private memberService: MembersService,
    public messageService: MessageService,
    public presence: PresenceService,
    private accountService: AccountService,
    private route: ActivatedRoute
  ) {
    this.userParams = this.memberService.getUserParamas();

    this.accountService.currentUser$
      .pipe(take(1))
      .subscribe((user) => (this.user = user));
  }

  ngOnInit(): void {
    this.loadMembers();
  }

  ngAfterViewChecked() {
    this.scrollToBottom();
  }

  ngOnDestroy(): void {
    this.messageService.stopHubConnection();
  }

  listClick(event, newValue) {
    console.log(newValue);
    this.selectedItem = newValue;  // don't forget to update the model here
    // ... do other stuff here ...
}

  scrollToBottom(): void {
    try {
      if (!this.scrolledToBottom) {
        this.comment.nativeElement.scrollTop = this.comment.nativeElement.scrollHeight;
      }
    } catch (err) {}
  }

  onScroll() {
    this.scrolledToBottom = true;
  }

  loadMembers() {
    this.memberService.setUserParamas(this.userParams);
    this.memberService.getMembers(this.userParams).subscribe((members) => {
      this.members = members.result;
      this.loadMessageThread(this.members[0].username)
      this.pagination = members.pagination;
    });
  }

  pageChanged(event: any) {
    this.userParams.pageNumber = event.page;
    this.memberService.setUserParamas(this.userParams);
    this.loadMembers();
  }

  loadMessageThread(memberUsername) {
    this.messageService.stopHubConnection();
    this.member= "";
    this.member = memberUsername;

    this.messageService.createHubConnection(this.user, this.member);
    console.log(this.messageService.messageThread$);
  }



  sendMessage() {
    this.messageService
      .sendMessage(this.member, this.messageContent)
      .then((message) => {
        this.messageForm.reset();

        this.scrolledToBottom = false;
        this.scrollToBottom();
      });
  }

  deleteMessage(id: number) {
    this.messageService.deleteMessage(id).subscribe(() => {
      
    });
  }
}
