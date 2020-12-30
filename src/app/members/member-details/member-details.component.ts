import {
  Component,
  OnInit,
  ViewChild,
  OnDestroy,
  ElementRef,
  AfterViewChecked,
} from '@angular/core';
import { MembersService } from 'src/app/_services/members.service';
import { ActivatedRoute } from '@angular/router';
import { NgxGalleryOptions } from '@kolkov/ngx-gallery';
import { NgxGalleryImage } from '@kolkov/ngx-gallery';
import { NgxGalleryAnimation } from '@kolkov/ngx-gallery';
import { Message } from 'src/app/_models/message';
import { MessageService } from 'src/app/_services/message.service';
import { NgForm } from '@angular/forms';
import { PresenceService } from 'src/app/_services/presence.service';
import { AccountService } from 'src/app/_services/account.service';
import { User } from 'src/app/_models/user';
import { take } from 'rxjs/operators';

@Component({
  selector: 'app-member-details',
  templateUrl: './member-details.component.html',
  styleUrls: ['./member-details.component.css'],
})
export class MemberDetailsComponent
  implements OnInit, AfterViewChecked, OnDestroy {
  @ViewChild('messageForm') messageForm: NgForm;
  @ViewChild('commentEl') comment: ElementRef;
  scrolledToBottom = false;

  member: any = {};
  galleryOptions: NgxGalleryOptions[] = [];
  galleryImages: NgxGalleryImage[] = [];
  messages: Message[] = [];
  messageContent: string;
  user: User;

  constructor(
    private memberService: MembersService,
    private route: ActivatedRoute,
    public messageService: MessageService,
    public presence: PresenceService,
    private accountService: AccountService
  ) {
    this.accountService.currentUser$
      .pipe(take(1))
      .subscribe((user) => (this.user = user));
  }

  ngOnInit() {
    this.route.data.subscribe((data) => {
      this.member = data.member;
    });

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
        thumbnailMargin: 20,
      },
      // max-width 400
      {
        breakpoint: 400,
        preview: false,
      },
    ];
    this.galleryImages = this.getImages();

    this.loadMessageThread();
  }

  ngAfterViewChecked() {
    this.scrollToBottom();
  }

  scrollToBottom(): void {
    try {
      // this.myScrollContainer.nativeElement.scrollTop = this.myScrollContainer.nativeElement.scrollHeight;
      if (!this.scrolledToBottom) {
        this.comment.nativeElement.scrollTop = this.comment.nativeElement.scrollHeight;
      }
    } catch (err) {}
  }

  onScroll() {
    this.scrolledToBottom = true;
  }

  getImages(): NgxGalleryImage[] {
    const imagesUrls = [];
    console.log(this.member);
    for (const photo of this.member.photos) {
      imagesUrls.push({
        small: photo?.url,
        medium: photo?.url,
        big: photo?.url,
      });
    }
    console.log(imagesUrls);
    return imagesUrls;
  }

  loadMessageThread() {
    console.log(this.user);
    console.log(this.member.username);
    this.messageService.createHubConnection(this.user, this.member.username);
  }

  ngOnDestroy(): void {
    this.messageService.stopHubConnection();
  }

  sendMessage() {
    this.messageService
      .sendMessage(
        this.route.snapshot.paramMap.get('username')!,
        this.messageContent
      )
      .then((message) => {
        this.messageForm.reset();

        this.scrolledToBottom = false;
        this.scrollToBottom();
      });
  }

  deleteMessage(id: number) {
    this.messageService.deleteMessage(id).subscribe(() => {
      this.messages.splice(
        this.messages.findIndex((m) => m.id === id),
        1
      );
    });
  }
}
