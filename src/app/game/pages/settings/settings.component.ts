import { Component, OnInit } from '@angular/core';

// Services
import {AuthenticationService} from "../../../services/authentication.service";
import {Subscription} from "rxjs";

@Component({
  selector: 'app-settings',
  templateUrl: './settings.component.html',
  styleUrls: ['./settings.component.css']
})
export class SettingsComponent implements OnInit {

  m_subscriptions!: Array<Subscription>;

  constructor( public authService: AuthenticationService) {
    this.m_subscriptions = new Array<Subscription>();

    this.m_subscriptions.push(this.authService.m_user_b_subject.subscribe(r_user => {
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
