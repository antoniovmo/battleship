// Modules
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

// Components
import { GameRoutingModule } from './game-routing.module';
import {HomeComponent} from "./pages/home/home.component";
import {SettingsComponent} from "./pages/settings/settings.component";
import {FormsModule, ReactiveFormsModule} from "@angular/forms";
import { RecordsComponent } from './pages/records/records.component';
import { DifficultyComponent } from './pages/difficulty/difficulty.component';
import { BoardComponent } from './pages/board/board.component';


@NgModule({
  declarations: [
    HomeComponent,
    SettingsComponent,
    RecordsComponent,
    DifficultyComponent,
    BoardComponent
  ],
  imports: [
    CommonModule,
    GameRoutingModule,
    FormsModule,
    ReactiveFormsModule,
  ]
})
export class GameModule { }
