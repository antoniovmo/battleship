import { Component, OnInit } from '@angular/core';

// Services
import {AuthenticationService} from "../../../services/authentication.service";

// RxJS
import {Subscription} from "rxjs";

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css']
})
export class HomeComponent implements OnInit {

  m_subscriptions!: Array<Subscription>;

  constructor( public authService: AuthenticationService) {
    this.m_subscriptions = new Array<Subscription>();

    this.m_subscriptions.push(this.authService.m_user_b_subject.subscribe(r_user =>{
      if(!r_user){
        return;
      }
    }));
  }

  ngOnInit(): void {
  }

  ngOnDestroy(): void {
    this.m_subscriptions.forEach(subscription => {
      subscription.unsubscribe();
    });
  }

}
