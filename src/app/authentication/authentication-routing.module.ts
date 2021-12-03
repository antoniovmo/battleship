import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

// Components
import {LogInComponent} from "./pages/log-in/log-in.component";

const routes: Routes = [
  {
    path: '',
    children: [
      {
        path: 'log-in',
        component: LogInComponent
      },
      {
        path: '**',
        redirectTo: 'log-in'
      }
    ]
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class AuthenticationRoutingModule { }
