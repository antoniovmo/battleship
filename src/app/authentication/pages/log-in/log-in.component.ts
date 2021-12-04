import { Component, OnInit } from '@angular/core';
import {AuthenticationService} from "../../../services/authentication.service";
import {FormControl, FormGroup, Validators} from "@angular/forms";

@Component({
  selector: 'app-log-in',
  templateUrl: './log-in.component.html',
  styleUrls: ['./log-in.component.css']
})
export class LogInComponent implements OnInit {

  m_action = false;
  m_error = '';

  m_form_login = new FormGroup({
    m_email: new FormControl('', Validators.required),
    m_password: new FormControl('',Validators.required)
  });

  constructor(public authService: AuthenticationService ) { }

  ngOnInit(): void {
  }

  change_action() {
    this.m_action = !this.m_action
  }

  auth_with_password(form: any) {
    if (this.m_action)
      this.authService.register_with_email(form.m_email, form.m_password).then(r => this.m_error = r);
    else
      this.authService.log_in_email(form.m_email, form.m_password).then(r => this.m_error = r);

  }

  google_login() {
    this.authService.log_in_google();
  }

}
