import { Component, OnInit } from '@angular/core';
import {AuthenticationService} from "../../../services/authentication.service";

@Component({
  selector: 'app-log-in',
  templateUrl: './log-in.component.html',
  styleUrls: ['./log-in.component.css']
})
export class LogInComponent implements OnInit {

  constructor(public authService: AuthenticationService ) { }

  ngOnInit(): void {
  }

  google_login() {
    this.authService.sign_in_google();
  }

}
