export class Ship {
  name: string;
  coordinates: string;
  indexes: Array<any>;
  missile_resistance: number;
  shots_received: number;
  destroyed: boolean;

  constructor(name: string, coordinates: string, indexes: Array<any>, missile_resistance: number, shots_received: number, destroyed: boolean) {
    this.name = name;
    this.coordinates = coordinates;
    this.indexes = indexes;
    this.missile_resistance = missile_resistance;
    this.shots_received = shots_received;
    this.destroyed = destroyed;
  }
}
