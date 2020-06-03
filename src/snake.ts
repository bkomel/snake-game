
const PLAYGROUND_SIZE = 20;
const MARKED_FIELD = "black";
const UNMARKED_FIELD = "silver";
const HEAD_FIELD = "blue";
const INITIAL_SNAKE_LENGTH: number = 3;
export const UP = "UP";
export const DOWN = "DOWN";
export const LEFT = "LEFT";
export const RIGHT = "RIGHT";

type DirectionsType = "UP" | "DOWN" | "LEFT" | "RIGHT" | "NONE";

interface ICoordinates {
  x: number
  y: number
}

class Coordinates implements ICoordinates {

  private _x: number;
  private _y: number;

  constructor(x: number=0, y: number=0) {
    this._x = x;
    this._y = y;
  }

  get x () {
    return this._x;
  }

  set x (x: number) {
    this._x = x;
  }

  get y () {
    return this._y;
  }

  set y (y: number) {
    this._y = y;
  }
  
}

interface IField {
  coordinates: Coordinates
}

interface ISnakeBodyField extends IField {
  direction: DirectionsType
  bodyType: any
}

class SnakeBodyField implements ISnakeBodyField {

  private _coordinates: Coordinates;
  private _bodyType: any;
  private _direction: DirectionsType;

  constructor (
    coordinates: Coordinates = new Coordinates(),
    bodyType: any = null,
    direction: DirectionsType = "NONE"
  ) {

  }

  get coordinates () {
    return this._coordinates;
  }

  get bodyType () {
    return this._bodyType;
  }

  get direction () {
    return this._direction;
  }

}

interface IFoodField {
  coordinates: Coordinates
  foodType: any
}

class FoodField implements IFoodField {

  private _coordinates: Coordinates
  private _foodType: any

  constructor (
    coordinates: ICoordinates,
    foodType: any
  ) {}

  get coordinates () {
    return this._coordinates;
  }

  get foodType () {
    return this._foodType;
  }
}

class Field {

  private _x: number;
  private _y: number;
  private _direction: DirectionsType;

  constructor (x: number = 0, y: number = 0, direction: DirectionsType=RIGHT) {
    this._x = x;
    this._y = y;
    this._direction = direction;
  }

  get x () {
    return this._x;
  }

  get y () {
    return this._y;
  }

  get direction () {
    return this._direction;
  }

}

export class Snake {

  private _length: number = INITIAL_SNAKE_LENGTH;
  private _direction: DirectionsType = <DirectionsType>[UP, DOWN, LEFT, RIGHT][Math.floor(Math.random()*4)];
  private _headPosition: Field = new Field(
    Math.floor( Math.random() * (PLAYGROUND_SIZE - 2*this._length) + this._length ),
    Math.floor( Math.random() * (PLAYGROUND_SIZE - 2*this._length) + this._length ),
    this._direction
  );
  private _headPosition2: SnakeBodyField = new SnakeBodyField(
    new Coordinates(
      Math.floor( Math.random() * (PLAYGROUND_SIZE - 2*this._length) + this._length ),
      Math.floor( Math.random() * (PLAYGROUND_SIZE - 2*this._length) + this._length )
    ), HEAD_FIELD
  )
  private _tailPosition: Field;

  get length() {
    return this._length;
  }

  set length(length: number) {
    this._length = length;
  }

  get headPosition () {
    return this._headPosition;
  }

  set headPosition (headPosition: Field) { 
    this._headPosition = headPosition;
  }

  get tailPosition () {
    return this._tailPosition;
  }

  set tailPosition (field: Field) {
    this._tailPosition = field;
  }

  get direction () {
    return this._direction;
  }

  set direction (direction) {
    this._direction = direction;
  }

}

interface IPlayground {
  //
}

export class Playground {

  private _playgroundSize: number = PLAYGROUND_SIZE;
  private _playgroundDiv: any = document.getElementById('playground');
  private _fields = Array(20).fill(0).map(() => { return Array(20).fill(0)});
  private _snake: Snake;
  private _table: HTMLElement;

  constructor(snake: Snake) {
    this._snake = snake;
    console.log(this._fields);
  }

  get snake () {
    return this._snake;
  }

  drawPlayground() {
    this._table = document.createElement('table');
    const tableBody = document.createElement('tbody');
    for (const row in this._fields) {
      const tableRow = document.createElement('tr');
      for (const col in this._fields[row]) {
        const tableData = document.createElement('td');
        tableData.setAttribute("style", "height: 20px; width: 20px; background-color: silver;");
        tableData.setAttribute("id", col+"-"+row);
        tableRow.appendChild(tableData);
      }
      tableBody.appendChild(tableRow);
    }
    this._table.appendChild(tableBody);
    this._table.setAttribute("style", "margin: 0 auto; border: 2px solid");
    this._playgroundDiv.appendChild(this._table);
  }

  resetPlayground() {
    this._snake = new Snake();
    this._fields = Array(20).fill(0).map(() => { return Array(20).fill(0)});
    this._table.remove();
    this.drawPlayground();
    this.drawSnake();
  }

  markField(field: Field, type: string) {
    document.getElementById(field.x.toString() + "-" + field.y.toString())
    .setAttribute("style", `height: 20px; width: 20px; background-color: ${type}`);
  }

  drawSnake() {
    // head
    const headPosition = this._snake.headPosition;
    this.markField(headPosition, HEAD_FIELD);
    this._fields[headPosition.y][headPosition.x] = this._snake.direction;

    // body & tail
    let shiftX, shiftY, field;
    for (let i = 1; i < this._snake.length; i++) {
      [shiftX, shiftY] = this.getCoordinateShiftFunctions(this._snake.direction, true, i);
      field = new Field( shiftX(headPosition.x), shiftY(headPosition.y), this._snake.direction );
      this.markField(field, MARKED_FIELD);
      this._fields[field.y][field.x] = this._snake.direction;
    }
    this._snake.tailPosition = field;
  }

  flashTableBorder() {
    let i = 5;
    let interval = setInterval(() => {
      console.log('intervalll');
      if (i%2) {
        this._table.setAttribute("style", "margin: 0 auto; border: 2px solid red");
      } else {
        this._table.setAttribute("style", "margin: 0 auto; border: 2px solid");
      }
      if (i<0) {
        this._table.setAttribute("style", "margin: 0 auto; border: 2px solid");
        clearInterval(interval);
      }
      i--;
    }, 300)
  }

  drawFood() {
    //
  }

  getCoordinateShiftFunctions(direction: DirectionsType, negative: boolean=false, shift: number=1): any[] {
    shift = negative ? -1 * shift: shift;
    if (direction === LEFT || direction === RIGHT) {
      return [
        direction === LEFT ? (x: number) => { return x - shift }: (x: number) => { return x + shift },
        (y: number) => { return y }
      ]
    } else if (direction === UP || direction === DOWN) {
      return [
        (x: number) => { return x },
        direction === UP ? (y: number) => { return y - shift }: (y: number) => { return y + shift }
      ]
    }
  }

  moveSnake() {
    // unmarkTailPosition if tail is not on the food point
    // find new TailPosition
    // setTailPosition
    // find new HeadPosition
    // setHeadPosition
    // markHeadPosition

    // checkConstraints
    // checkFood

    // moveTail
    const tailPosition = this._snake.tailPosition;
    this._fields[tailPosition.y][tailPosition.x] = 0; // get tail position and unmark it, leave no traces behind
    let [shiftX, shiftY] = this.getCoordinateShiftFunctions(tailPosition.direction); 
    let [newX, newY] = [shiftX(tailPosition.x), shiftY(tailPosition.y)];
    this._snake.tailPosition = new Field(newX, newY, this._fields[newY][newX]) // getShift functions, new coordinates, make nes tail Position
 
    // moveHead
    const headPosition = this._snake.headPosition;
    this._fields[headPosition.y][headPosition.x] = this._snake.direction;
    [shiftX, shiftY] = this.getCoordinateShiftFunctions(this._snake.direction);
    [newX, newY] = [shiftX(headPosition.x), shiftY(headPosition.y)];
    this.checkBorders(newX, newY);
    this._snake.headPosition = new Field(newX, newY, this._snake.direction);
    this.markField(tailPosition, UNMARKED_FIELD);
    this.markField(headPosition, MARKED_FIELD);
    this.markField(this._snake.headPosition, HEAD_FIELD);
  }

  checkBorders(x:number , y: number) {
    if (x < 0 || x > this._playgroundSize-1 || y < 0 || y > this._playgroundSize-1) {
      throw new Error("Out of borders");
    }
  }

}

const TIME_SLICE_PERIOD: number = 90;

export class GameRunner {

  private _timeSlicePeriod: number = TIME_SLICE_PERIOD; // miliseconds
  private _gameRunning: boolean = false;
  private _playground: Playground;

  constructor (playground: Playground) {
    this._playground = playground;
  }

  start() {
    this.enableSnakeControls();
    this._gameRunning = true;
  }

  pause() {
    this.disableSnakeControls();
    this._gameRunning = false;
  }

  reset() {
    this._playground.resetPlayground();
    this.enableGameControls();
  }

  gameover() {
    this.disableGameControls();
    this.disableSnakeControls();
    this._gameRunning = false;
    setTimeout(() => {
      this.reset();
    }, 2000);
    this._playground.flashTableBorder();
  }

  spaceKeyListener = (ev: KeyboardEvent) => {
    switch(ev.keyCode) {
      case 32: {
        if (this.gameRunning) {
          this.pause();
        } else {
          this.start();
        }
      }
    }
  }

  controlKeysListener = (ev: KeyboardEvent) => {
    switch(ev.keyCode) {
      case 105: {
        this._playground.snake.direction = UP;
        break;
      }
      case 107: {
        this._playground.snake.direction = DOWN;
        break;
      }
      case 106: {
        this._playground.snake.direction = LEFT;
        break;
      }
      case 108: {
        this._playground.snake.direction = RIGHT;
        break;
      }
    }
  }

  enableGameControls () {
    document.addEventListener('keypress', this.spaceKeyListener);
  }

  disableGameControls () {
    document.removeEventListener('keypress', this.spaceKeyListener);
  }

  enableSnakeControls () {
    document.addEventListener('keypress', this.controlKeysListener);
  }

  disableSnakeControls () {
    document.removeEventListener('keypress', this.controlKeysListener);
  }

  get timeSlicePeriod() {
    return this._timeSlicePeriod;
  }

  get gameRunning () {
    return this._gameRunning;
  }

  timeSlice (): any {
    if (this._gameRunning) {
      try {
        this._playground.moveSnake()
      } catch (error) {
        this.gameover();
      }
    }
  }

}
