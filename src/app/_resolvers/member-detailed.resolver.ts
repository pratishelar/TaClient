import {
  Resolve,
  ActivatedRouteSnapshot,
  RouterStateSnapshot,
} from '@angular/router';
import { member } from '../_models/member';
import { Injectable } from '@angular/core';
import { MembersService } from '../_services/members.service';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class MemberDetailedResolver implements Resolve<member> {
  constructor(private memberService: MembersService) {}

  resolve(route: ActivatedRouteSnapshot): Observable<member> {
    return this.memberService.getMember(route.paramMap.get('username'));
  }
}
