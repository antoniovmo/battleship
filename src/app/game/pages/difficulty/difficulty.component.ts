import { Component, OnInit } from '@angular/core';
import {Router} from "@angular/router";

// RxJS
import {Subscription} from "rxjs";

// Services
import {GameBoardService} from "../../../services/game-board.service";

// Forms
import {FormControl, FormGroup, Validators} from "@angular/forms";

@Component({
  selector: 'app-difficulty',
  templateUrl: './difficulty.component.html',
  styleUrls: ['./difficulty.component.css']
})
export class DifficultyComponent implements OnInit {

  m_array_difficulties = ['easy', 'medium', 'hard', 'personalized']
  m_show_input = false

  m_form_difficulty = new FormGroup({
    m_number_missiles: new FormControl('', Validators.required)
  });

  constructor(  private gameBoardService: GameBoardService, private router: Router ) { }

  ngOnInit(): void { }

  select_difficulty( temp_difficulty: string) {

    if (temp_difficulty == 'personalized' || temp_difficulty == 'hide') {
      this.m_array_difficulties[3] = `${temp_difficulty == 'personalized' ? 'hide' : 'personalized'}`
      this.m_show_input = !this.m_show_input
    } else {
      this.router.navigate([`game/board/${temp_difficulty}`]);
    }
  }

  select_missiles(form: any) {

    // this.gameBoardService.assign_personalized_difficulty(form.m_number_missiles)
    this.gameBoardService.m_missiles_difficulty = form.m_number_missiles

    this.router.navigate(['game/board/personalized']);
  }
}
