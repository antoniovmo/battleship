export class Record {
    player: string;
    destroyed_ships: number;
    leftover_missiles: any;
    difficulty: string;
    game_over: boolean;
    start_time: any;
    end_time: any;

    constructor(player: string, destroyed_ships: number, leftover_missiles: any, difficulty: string, game_over: boolean, start_time: any, end_time: any) {
        this.player = player;
        this.destroyed_ships = destroyed_ships;
        this.leftover_missiles = leftover_missiles;
        this.difficulty = difficulty;
        this.game_over = game_over;
        this.start_time = start_time;
        this.end_time = end_time;
    }
}
