import { Component, OnInit, ViewChild } from '@angular/core';
import { member } from '../_models/member';
import { Pagination } from '../_models/pagination';
import { UserParams } from '../_models/userParams';
import { User } from '../_models/user';
import { MembersService } from '../_services/members.service';
import { MessageService } from '../_services/message.service';
import { Message } from '../_models/message';
import { NgForm } from '@angular/forms';

@Component({
  selector: 'app-message-chat',
  templateUrl: './message-chat.component.html',
  styleUrls: ['./message-chat.component.css']
})
export class MessageChatComponent implements OnInit {
  @ViewChild('messageForm') messageForm: NgForm;
  
  member;
  members: member[] = [];
  pagination: Pagination;
  userParams: UserParams;
  user: User;
  messages: Message[] =[];
  messageContent: string;
  loading = false;

  constructor(
    private memberService: MembersService, private messageService: MessageService
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
      this.loadMessageThread(this.members[0].username);
      this.pagination = members.pagination;
    });
  }

  pageChanged(event: any) {
    this.userParams.pageNumber = event.page;
    this.memberService.setUserParamas(this.userParams);
    this.loadMembers();
  }

  loadMessageThread(username){
    this.loading = true;
    this.member = username;
    this.messageService.getMessageThread(username).subscribe((messages) => {
      this.messages = messages;
      this.loading = false;
    });
  }

  sendMessage(){
    this.messageService.sendMessage(this.member, this.messageContent).subscribe(message =>{
      this.messages.push(message);
      this.messageForm.reset();
    })
  }

  deleteMessage(id :number){
    this.messageService.deleteMessage(id).subscribe(() => {
      this.messages.splice(this.messages.findIndex(m => m.id === id), 1);
    })
  }

}
