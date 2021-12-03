export class Square {
  position: string;
  index: number;
  is_ship: boolean;
  clicked: boolean;
  action: string;
  style: string;

  constructor(position: string, index: number, is_ship: boolean, clicked: boolean, action: string, style: string) {
    this.position = position;
    this.index = index;
    this.is_ship = is_ship;
    this.clicked = clicked;
    this.action = action;
    this.style = style;
  }
}
