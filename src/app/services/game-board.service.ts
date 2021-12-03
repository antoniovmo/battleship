import { Injectable } from '@angular/core';

// Classes
import { Ship} from '../classes/ship';
import { Square} from '../classes/square';

// Local JSON data
import Ships from '../../assets/jsons/ships.json';

// Rxjs
import {BehaviorSubject} from "rxjs";

@Injectable({
  providedIn: 'root'
})
export class GameBoardService {

  // Size of the board
  m_width_size = 10;

  // Array to put the squares on the board
  m_array_squares: Square[] = [];

  // Array to assign positions and show in board
  m_array_alphabet: string[] = ['A', 'B', 'C', 'D', 'E', 'F', 'G', 'H', 'I', 'J'];

  // Array to save enemy ships
  m_array_ships: Ship[] = [];

  // Array with de default ships from local JSON
  m_array_default_ships = Ships;

  m_missiles_difficulty = 0;
  /*
  private difficulty_source = new BehaviorSubject(0);
  m_missiles_difficulty = this.difficulty_source.asObservable();
  */

  constructor() { }

  /*
  assign_personalized_difficulty(r_missiles: number) {
    this.difficulty_source.next(r_missiles)
  }
  */

  // Create board and assign positions
  create_board() {

    // Counter to know the position by index
    let temp_index = 0

    for (let i = 0; i < this.m_width_size; i++) {
      for (let j = 0; j < this.m_width_size; j++) {
        temp_index++
        this.m_array_squares.push(
          new Square(`${this.m_array_alphabet[i]}-${j + 1}`, temp_index ,false,false,'', ''))
      }
    }
  }

  clean_board() {
    this.m_array_squares = []
    this.m_array_ships = []
  }
  // Choose random positions to assign ships in the board
  generate_random_ships( default_data_ship: any) {

    // Temporal arrays
    let r_array_positions: any[] = []
    let r_array_indexes: any[] = []


    let random_coords = Math.floor(Math.random() * default_data_ship.coordinates.length)
    let current_coords = default_data_ship.coordinates[random_coords]

    // Variables to style and directions
    let temp_direction = 0
    let temp_direction_style = ''
    let temp_complete_style = ''

    // Check if it'll be horizontal
    if (random_coords === 0) {
      temp_direction = 1
      temp_direction_style = 'ship horizontal '
    }

    // Check if it'll be vertical
    if (random_coords === 1) {
      temp_direction = 10
      temp_direction_style = 'ship vertical '
    }

    let random_start = Math.abs(Math.floor(Math.random() * this.m_array_squares.length - (default_data_ship.coordinates[0].length * temp_direction)))

    // Check if is taken or not => return boolean
    let position_is_taken = current_coords.some(
      (index: any) => this.m_array_squares[random_start + index].is_ship)

    // Check if is in edge for avoid wrong positions => return boolean
    let position_is_right_edge = current_coords.forEach(
      (index: any) => (random_start + index) % this.m_width_size === this.m_width_size - 1)

    // Check if is in edge for avoid wrong positions => return boolean
    let position_is_left_edge = current_coords.some(
      (index: any) => (random_start + index) % this.m_width_size === 0)

    // If it's good assign position to ship
    if (!position_is_taken && !position_is_right_edge && !position_is_left_edge) {
      current_coords.forEach((r_value: any, index: number) => {

        // Temporal variable to know where the ship start and when ends
        let temp_position_style = ''

        // Check if is the first
        if (index === 0) {
          temp_position_style = 'start'
        }

        // Check if is the last
        if (index == current_coords.length - 1) {
          temp_position_style = 'end'
        }

        // Check if is both
        if (index === 0 && index == current_coords.length - 1) {
          temp_position_style = 'start end'
        }

        // Check position for the ship
        this.m_array_squares[random_start + r_value].is_ship = true

        // Save styles in a variable
        temp_complete_style = temp_direction_style + temp_position_style
        this.m_array_squares[random_start + r_value].style = temp_complete_style

        // Saving position and indexes in array to know where the ships are
        r_array_positions.push(this.m_array_squares[random_start + r_value].position)
        r_array_indexes.push(this.m_array_squares[random_start + r_value].index)

      })

      // Saving enemy ships in array
      this.m_array_ships.push( new Ship( default_data_ship.name, r_array_positions.join(),r_array_indexes, current_coords.length,0,false))

    } else {

      // Repeat process
      this.generate_random_ships(default_data_ship)
    }
  }

  play_again() {

    this.m_array_squares = []
    this.m_array_ships = []

    this.create_board()

    this.m_array_default_ships.forEach((r_ship: any) => {
      this.generate_random_ships(r_ship)
    })
  }
}
