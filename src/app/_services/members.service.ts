import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import { environment } from 'src/environments/environment';
import { Observable, of } from 'rxjs';
import { member } from '../_models/member';
import { map, take } from 'rxjs/operators';
import { is } from 'date-fns/locale';
import { PaginatedResult } from '../_models/pagination';
import { UserParams } from '../_models/userParams';
import { AccountService } from './account.service';
import { User } from '../_models/user';
import { getPaginationResult, getPaginationHeaders } from './paginationHelper';

@Injectable({
  providedIn: 'root',
})
export class MembersService {
  baseUrl = environment.apiUrl;
  members: member[] = [];
  memberCache = new Map();
  user: User;
  userParams: UserParams;

  constructor(private http: HttpClient,  private accountService: AccountService) {
    this.accountService.currentUser$.pipe(take(1)).subscribe(user => {
      this.user = user;
      this.userParams = new UserParams();
    });
  }

  getUserParamas(){
    return this.userParams;
  }

  setUserParamas(params: UserParams){
     this.userParams = params;
  }

  resetUserParams(){
    this.userParams = new UserParams();
    return this.userParams;
  }

  getMembers(userParams: UserParams) {
    var response = this.memberCache.get(Object.values(userParams).join('-'));

    if (response) {
      return of(response);
    }

    let params = getPaginationHeaders(
      userParams.pageNumber,
      userParams.pageSize
    );
    params = params.append('minAge', userParams.minAge.toString());
    params = params.append('maxAge', userParams.maxAge.toString());
    params = params.append('orderBy', userParams.orderBy);

    return getPaginationResult<member[]>(
      this.baseUrl + 'users',
      params, this.http
    ).pipe(
      map((response) => {
        this.memberCache.set(Object.values(userParams).join('-'), response);
        return response;
      })
    );
  }

  getMember(username: string) {
    const member = [...this.memberCache.values()].reduce(
      (arr, elem) => arr.concat(elem.result),
      []
    )
    .find((member:member) => member.username === username);
    
    if(member){
      return of(member);
    }

    return this.http.get<member>(this.baseUrl + 'users/' + username);
  }

  updateMember(member: member) {
    return this.http.put<member>(this.baseUrl + 'users/', member).pipe(
      map(() => {
        const index = this.members.indexOf(member);
        this.members[index] = member;
      })
    );
  }

  setMainPhoto(photoId: number) {
    return this.http.put(this.baseUrl + 'users/set-main-photo/' + photoId, {});
  }

  deletePhoto(photoId: number) {
    return this.http.delete(this.baseUrl + 'users/delete-photo/' + photoId);
  }
}
