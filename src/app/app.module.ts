import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { HttpClientModule, HTTP_INTERCEPTORS } from '@angular/common/http';
import { FormsModule } from '@angular/forms';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { NavbarComponent } from './navbar/navbar.component';

import { HomeComponent } from './home/home.component';
import { RegisterComponent } from './register/register.component';
import { MemberlistComponent } from './members/memberlist/memberlist.component';
import { CreateTaComponent } from './create-ta/create-ta.component';
import { LoginComponent } from './login/login.component';
import { ProfileComponent } from './profile/profile.component';
import { DashboardComponent } from './dashboard/dashboard.component';
import { SharedModule } from './_modules/shared.module';
import { TestErrorsComponent } from './errors/test-errors/test-errors.component';
import { ErrorInterceptor } from './_interceptors/error.interceptor';
import { NotFoundComponent } from './errors/not-found/not-found.component';
import { ServerErrorComponent } from './errors/server-error/server-error.component';
import { FooterComponent } from './footer/footer.component';
import { JwtInterceptor } from './_interceptors/jwt.interceptor';
import { CommonModule } from '@angular/common';
import { MemberDetailsComponent } from './members/member-details/member-details.component';
import { NgxGalleryModule } from '@kolkov/ngx-gallery';
import { NgxChartsModule } from '@swimlane/ngx-charts';
import { CalendarModule, DateAdapter } from 'angular-calendar';
import { adapterFactory } from 'angular-calendar/date-adapters/date-fns';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { FlatpickrModule } from 'angularx-flatpickr';
import { NgxSpinnerModule } from "ngx-spinner";
import { LoadingInterceptor } from './_interceptors/loading.interceptor';
import { FileUploadModule} from 'ng2-file-upload';
import { MessageComponent } from './message/message.component';
import { MessageChatComponent } from './message-chat/message-chat.component';


@NgModule({
  declarations: [			
    AppComponent,
    NavbarComponent,
    HomeComponent,
    RegisterComponent,
    MemberlistComponent,
    CreateTaComponent,
      LoginComponent,
      ProfileComponent,
      DashboardComponent,
      TestErrorsComponent,
      NotFoundComponent,
      ServerErrorComponent,
      FooterComponent,
      MemberDetailsComponent,
      MessageComponent,
      MessageChatComponent,
   ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    HttpClientModule,
    BrowserAnimationsModule,
    FormsModule,
    SharedModule,
    CommonModule,
    FlatpickrModule.forRoot(),
    NgxGalleryModule,
    NgxChartsModule,
    CalendarModule.forRoot({ provide: DateAdapter, useFactory: adapterFactory }),
    NgbModule,
    NgxSpinnerModule,
    FileUploadModule
  ],
  exports:[
    NgxChartsModule,
    NgxSpinnerModule
  ],
  providers: [
    { provide: HTTP_INTERCEPTORS, useClass: ErrorInterceptor, multi: true},
    { provide: HTTP_INTERCEPTORS, useClass: JwtInterceptor, multi: true },
    { provide: HTTP_INTERCEPTORS, useClass: LoadingInterceptor, multi: true }
],
  bootstrap: [AppComponent],
})
export class AppModule {}
