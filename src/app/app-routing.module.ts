import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

const routes: Routes = [
  {
    path: 'authentication',
    loadChildren: () => import('./authentication/authentication.module').then( m => m.AuthenticationModule )
  },
  {
    path: 'game',
    loadChildren: () => import('./game/game.module').then( m => m.GameModule )
  },
  {
    path: '**',
    redirectTo: 'game'
  }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
