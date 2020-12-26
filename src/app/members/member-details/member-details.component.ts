import { Component, OnInit, ViewChild } from '@angular/core';
import { MembersService } from 'src/app/_services/members.service';
import { ActivatedRoute } from '@angular/router';
import { member } from 'src/app/_models/member';
import { NgxGalleryOptions } from '@kolkov/ngx-gallery';
import { NgxGalleryImage } from '@kolkov/ngx-gallery';
import { NgxGalleryAnimation } from '@kolkov/ngx-gallery';
import { Message } from 'src/app/_models/message';
import { MessageService } from 'src/app/_services/message.service';
import { NgForm } from '@angular/forms';

@Component({
  selector: 'app-member-details',
  templateUrl: './member-details.component.html',
  styleUrls: ['./member-details.component.css'],
})
export class MemberDetailsComponent implements OnInit {
  @ViewChild('messageForm') messageForm: NgForm;

  member: any = {};
  galleryOptions: NgxGalleryOptions[] = [];
  galleryImages: NgxGalleryImage[] = [];
  messages: Message[] =[];
  messageContent: string;

  constructor(
    private memberService: MembersService,
    private route: ActivatedRoute,
    private messageService: MessageService
  ) {}

  ngOnInit() {
    this.route.data.subscribe(data => {
      this.member = data.member;
    })
    this.loadMessageThread();

    this.galleryOptions = [
      {
        width: '600px',
        height: '400px',
        imagePercent: 100,
        thumbnailsColumns: 4,
        imageAnimation: NgxGalleryAnimation.Slide,
        preview: false,
      },
      // max-width 800
      {
        breakpoint: 800,
        width: '100%',
        height: '600px',
        imagePercent: 80,
        thumbnailsPercent: 20,
        thumbnailsMargin: 20,
        thumbnailMargin: 20
      },
      // max-width 400
      {
        breakpoint: 400,
        preview: false
      }
    ];
    this.galleryImages = this.getImages();
  }

  getImages(): NgxGalleryImage[] {
    const imagesUrls = [];
    console.log(this.member)
    for (const photo of this.member.photos) {
      imagesUrls.push({
        small: photo?.url,
        medium: photo?.url,
        big: photo?.url,
      });
    }
    console.log(imagesUrls)
    return imagesUrls;
  }

  loadMember() {
    this.memberService
      .getMember(this.route.snapshot.paramMap.get('username')!)
      .subscribe((member) => {
        this.member = member;
        
        console.log(this.member);
      });
  }

  loadMessageThread(){
    this.messageService.getMessageThread(this.route.snapshot.paramMap.get('username')!).subscribe((messages) => {
      this.messages = messages;
    });
  }

  sendMessage(){
    this.messageService.sendMessage(this.route.snapshot.paramMap.get('username')!, this.messageContent).subscribe(message =>{
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
