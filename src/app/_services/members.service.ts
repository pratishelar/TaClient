import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { environment } from 'src/environments/environment';
import { Observable, of } from 'rxjs';
import { member } from '../_models/member';
import { map } from 'rxjs/operators';
import { is } from 'date-fns/locale';

@Injectable({
  providedIn: 'root',
})
export class MembersService {
  baseUrl = environment.apiUrl;
  members: member[] = [];

  constructor(private http: HttpClient) {}

  getMembers() {
    if (this.members.length > 0) return of(this.members);
    return this.http.get<member[]>(this.baseUrl + 'users').pipe(
      map((members: member[]) => {
        this.members = members;
        return members;
      })
    );
  }

  getMember(username: string) {
    const member = this.members.find((x) => x.username === username);
    if (member !== undefined) return of(member);
    return this.http.get<member>(this.baseUrl + 'users/' + username);
  }

  updateMember(member: member) {
    return this.http.put<member>(this.baseUrl + 'users/', member).pipe(
      map(() => {
        const index = this.members.indexOf(member);
        this.members[index] = member;
      })
    )
  }

  setMainPhoto(photoId:number){
    return this.http.put(this.baseUrl + 'users/set-main-photo/' + photoId, {});
  }

  deletePhoto(photoId:number){
    return this.http.delete(this.baseUrl + 'users/delete-photo/' + photoId);
  }
}
