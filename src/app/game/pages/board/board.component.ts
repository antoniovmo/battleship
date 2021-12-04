import {AfterViewInit, Component, OnInit} from '@angular/core';
import {ActivatedRoute, Router} from "@angular/router";

// Services
import {GameBoardService} from "../../../services/game-board.service";
import {AuthenticationService} from "../../../services/authentication.service";
import {DatabaseService} from "../../../services/database.service";
import {GameRecordsService} from "../../../services/game-records.service";

// Classes
import {Square} from "../../../classes/square";
import {Subscription} from "rxjs";
import {Record} from "../../../classes/record";


@Component({
  selector: 'app-board',
  templateUrl: './board.component.html',
  styleUrls: ['./board.component.css']
})
export class BoardComponent implements OnInit {

  // Missiles counter
  m_missiles!: number;
  m_backup_missiles!: number;
  subscription!: Subscription;

  // Destroyed ships counter
  m_destroyed_ships = 0;

  // Global messages to keeping posted the player
  m_message!: string;
  m_type_message = false;

  // Status to know if the game is over
  m_is_end_game = false;

  m_game_record!: Record;
  m_start_game = new Date();
  m_game_difficulty!: string;

  constructor( private databaseService: DatabaseService,
               public gameBoardService: GameBoardService,
               public grService: GameRecordsService,
               public route: ActivatedRoute,
               private router: Router,
               private authService: AuthenticationService) {
    // Check params to know difficulty
    this.route.params.subscribe(parameter => {
      this.m_game_difficulty = parameter['difficulty']
      if ( this.m_game_difficulty == 'easy')
        this.m_missiles = 1000
      if ( this.m_game_difficulty == 'medium')
        this.m_missiles = 100
      if ( this.m_game_difficulty == 'hard')
        this.m_missiles = 50
      if ( this.m_game_difficulty == 'personalized')
        this.m_missiles = this.gameBoardService.m_missiles_difficulty
      //this.subscription = this.gameBoardService.m_missiles_difficulty.subscribe((r_missiles_number : any) => this.m_missiles = r_missiles_number)
    });

    // Just in case he/she wants to play again
    this.m_backup_missiles = this.m_missiles
  }

  ngOnInit(): void {

    // Just checking if someone start without missiles
    if (this.m_missiles == 0) {
      this.router.navigate(['game/difficulty']);
    } else {
      this.gameBoardService.create_board()

      this.gameBoardService.m_array_default_ships.forEach((r_ship: any) => {
        this.gameBoardService.generate_random_ships(r_ship)
      })
    }
  }

  ngAfterViewInit(): void {
  }

  ngOnDestroy() {
    this.initialize_variables()
    this.gameBoardService.clean_board()
    // this.subscription.unsubscribe();
  }

  launch_missile(clicked_square: Square) {
    if (!this.m_is_end_game) {
      if (clicked_square.is_ship) {
        if (!clicked_square.clicked) {
          this.successful_missile(clicked_square)
        }
      } else {
        if (!clicked_square.clicked) {
          this.failed_missile(clicked_square)
        }
      }
    }
  }

  successful_missile( selected_square: Square) {
    // Change message
    this.m_type_message = true
    this.m_message = `Great, you hit a ship on ${selected_square.position}`
    // Add ng-class style to mark clicked position
    selected_square.action = 'successful-shot'
    // Change the state to know if it has already been clicked
    selected_square.clicked = true;

    this.check_destroyed_ships(selected_square.position)

    // Call function to check
    this.check_end_game()
  }

  failed_missile(temp_square: any) {

    this.m_type_message = false
    this.m_message = `Damn it, you missed that shot on ${temp_square.position}, try again`

    // Add ng-class style
    temp_square.action = 'missed-shot'

    // Change the state to know if it has already been selected
    temp_square.clicked = true;

    // Call function to check
    this.check_end_game()
  }

  check_destroyed_ships( r_position: string ) {

    // Find the index of enemy ship in the array
    let m_index = this.gameBoardService.m_array_ships.findIndex( r_ship => r_ship.coordinates.includes(r_position));

    // Saving enemy ship to change data
    let m_enemy_ship = this.gameBoardService.m_array_ships[m_index]

    // Increase shots received counter
    m_enemy_ship.shots_received++

    // Check if it's the same number to change destroyed status
    if (m_enemy_ship.missile_resistance == m_enemy_ship.shots_received)
      m_enemy_ship.destroyed = true

    if (m_enemy_ship.destroyed) {
      this.m_destroyed_ships++

      m_enemy_ship.indexes.forEach( r_index => {
        let temp_square = this.gameBoardService.m_array_squares[r_index - 1]
        // Assign the style to show the destroyed ship
        temp_square.action = temp_square.action.concat(' ', temp_square.style)
      })

      // Change message
      this.m_message = `Yeah!, you sunk a ${m_enemy_ship.name}`
    }
  }

  check_end_game() {

    // Subtract available missiles to launch
    this.m_missiles--

    if ( this.m_destroyed_ships == 10 ) {
      this.m_is_end_game = true
      this.m_type_message = true
      this.m_message = `Congratulations you've won`


      let temp_missiles
      if (this.m_game_difficulty == 'easy') {
        temp_missiles = 'Infinite'
      } else {
        temp_missiles = this.m_missiles
      }
      this.m_game_record = new Record(this.authService.m_uid, this.m_destroyed_ships, temp_missiles,  this.m_game_difficulty, false, this.databaseService.create_date(this.m_start_game), this.databaseService.create_date(new Date()))

      this.grService.save_data(this.m_game_record)
    }

    // Game over
    if (this.m_missiles == 0 && this.m_destroyed_ships < 10 ) {
      this.m_is_end_game = true
      this.m_type_message = false
      this.m_message = 'Game Over'

      this.gameBoardService.m_array_ships.forEach( r_ship => {
        r_ship.indexes.forEach(r_index => {
          let temp_square = this.gameBoardService.m_array_squares[r_index - 1]
          temp_square.action = temp_square.action.concat(' ', temp_square.style)
        })
      })


      this.m_game_record = new Record(this.authService.m_uid, this.m_destroyed_ships,this.m_missiles,  this.m_game_difficulty, true, this.databaseService.create_date(this.m_start_game), this.databaseService.create_date(new Date()))

      this.grService.save_data(this.m_game_record)
    }
  }

  play_again() {
    // Create new squares and ships
    this.gameBoardService.play_again()

    // Initialize every variable
    this.initialize_variables()
  }

  initialize_variables () {
    // Initialize every variable
    this.m_message = ''
    this.m_is_end_game = false
    this.m_destroyed_ships = 0
    this.m_missiles = this.m_backup_missiles
  }
}
