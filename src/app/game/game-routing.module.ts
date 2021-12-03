import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

// Components
import {HomeComponent} from "./pages/home/home.component";
import {SettingsComponent} from "./pages/settings/settings.component";
import {RecordsComponent} from "./pages/records/records.component";
import {DifficultyComponent} from "./pages/difficulty/difficulty.component";
import {BoardComponent} from "./pages/board/board.component";
import {GameGuard} from "../guards/game.guard";


const routes: Routes = [
  {
    path: '',
    canActivate: [GameGuard],
    children: [
      {
        path: 'home',
        component: HomeComponent
      },
      {
        path: 'difficulty',
        component: DifficultyComponent
      },
      {
        path: 'records',
        component: RecordsComponent
      },
      {
        path: 'settings',
        component: SettingsComponent
      },
      {
        path: 'board/:difficulty',
        component: BoardComponent
      },
      {
        path: '**',
        redirectTo: 'home'
      }
    ]
  }
];


@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class GameRoutingModule { }
