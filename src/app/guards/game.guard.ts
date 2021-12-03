import { Injectable } from '@angular/core';
import { ActivatedRouteSnapshot, CanActivate, Router, RouterStateSnapshot, UrlTree } from '@angular/router';

// RxJS
import { Observable } from 'rxjs';

// Services
import {AuthenticationService} from "../services/authentication.service";


@Injectable({
  providedIn: 'root'
})
export class GameGuard implements CanActivate {

  constructor(private authService: AuthenticationService, private route: Router){}


  canActivate(
    route: ActivatedRouteSnapshot,
    state: RouterStateSnapshot): Observable<boolean | UrlTree> | Promise<boolean | UrlTree> | boolean | UrlTree {

      return new Observable<boolean>(observable =>{
        this.authService.m_user_b_subject.subscribe((user : any ) => {
          if(!user){
            return;
          }

          if(user){
            observable.next(true);
          } else {
            this.route.navigate(['authentication/log-in']);
            observable.next(false);
          }
        });
      });
  }
  
}
