
const PLAYGROUND_SIZE = 20;
const MARKED_FIELD = "height: 20px; width: 20px; background-color: #777; border-radius: 4px";
const UNMARKED_FIELD = "height: 20px; width: 20px; background-color: silver;";
const HEAD_FIELD = "height: 20px; width: 20px; background-color: black; border-radius: 4px";
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

class Field implements IField {

  private _coordinates: Coordinates;

  constructor (coordinates: Coordinates=new Coordinates()) {
    this._coordinates = coordinates;
  }

  get coordinates () {
    return this._coordinates;
  }

}

interface ISnakeBodyField extends IField {
  direction: DirectionsType
  bodyType: any
}

class SnakeBodyField extends Field implements ISnakeBodyField {

  private _bodyType: any;
  private _direction: DirectionsType;

  constructor (
    coordinates: Coordinates = new Coordinates(),
    bodyType: any = null,
    direction: DirectionsType = "NONE"
  ) {
    super(coordinates);
    this._bodyType = bodyType;
    this._direction = direction;
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

interface ISnake {
  length: number
  direction: DirectionsType
  headPosition: SnakeBodyField
}

export class Snake implements ISnake{

  private _length: number = INITIAL_SNAKE_LENGTH;
  private _direction: DirectionsType = <DirectionsType>[UP, DOWN, LEFT, RIGHT][Math.floor(Math.random()*4)];
  private _headPosition: SnakeBodyField = new SnakeBodyField(
    new Coordinates(
      Math.floor( Math.random() * (PLAYGROUND_SIZE - 2*this._length) + this._length ),
      Math.floor( Math.random() * (PLAYGROUND_SIZE - 2*this._length) + this._length )
    ), HEAD_FIELD
  )
  private _tailPosition: SnakeBodyField;

  get length() {
    return this._length;
  }

  set length(length: number) {
    this._length = length;
  }

  get headPosition () {
    return this._headPosition;
  }

  set headPosition (headPosition: SnakeBodyField) { 
    this._headPosition = headPosition;
  }

  get tailPosition () {
    return this._tailPosition;
  }

  set tailPosition (field: SnakeBodyField) {
    this._tailPosition = field;
  }

  get direction () {
    return this._direction;
  }

  set direction (direction: DirectionsType) {
    this._direction = direction;
  }

}

interface IPlayground {
  //
}

export class Playground {

  private _playgroundSize: number = PLAYGROUND_SIZE;
  private _playgroundDiv: any = document.getElementById('playground');
  private _fields: (SnakeBodyField | Field) [][];
  private _snake: Snake;
  private _table: HTMLElement;

  constructor(snake: Snake) {
    this._snake = snake;
    this._fields = this.initializeFields();
    console.log(this._fields);
  }

  get snake () {
    return this._snake;
  }

  private initializeFields () {
    return Array(20).fill(0)
    .map((row,i) => {
      return Array(20).fill(0)
      .map((col,j) => {
        const coordinates = new Coordinates(j, i);
        return new Field(coordinates);
      })
    });
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
    this._fields = this.initializeFields();
    this._table.remove();
    this.drawPlayground();
    this.drawSnake();
  }

  markField(coordinates: Coordinates, type: string) {
    document.getElementById(coordinates.x.toString() + "-" + coordinates.y.toString())
    .setAttribute("style", type);
  }

  drawSnake() {
    // head
    const headCoordinates = this._snake.headPosition.coordinates;
    this.markField(headCoordinates, HEAD_FIELD);
    this._fields[headCoordinates.y][headCoordinates.x] = new SnakeBodyField(headCoordinates, HEAD_FIELD, this._snake.direction);

    // body & tail
    let shiftX, shiftY, field;
    for (let i = 1; i < this._snake.length; i++) {
      [shiftX, shiftY] = this.getCoordinateShiftFunctions(this._snake.direction, true, i);
      const bodyPartCoordinates = new Coordinates(shiftX(headCoordinates.x), shiftY(headCoordinates.y));
      field = new SnakeBodyField( bodyPartCoordinates, MARKED_FIELD, this._snake.direction );
      this.markField(field.coordinates, MARKED_FIELD);
      this._fields[field.coordinates.y][field.coordinates.x] = field;
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
    this._fields[tailPosition.coordinates.y][tailPosition.coordinates.x] = new Field(tailPosition.coordinates); // get tail position and unmark it, leave no traces behind
    let [shiftX, shiftY] = this.getCoordinateShiftFunctions(tailPosition.direction); 
    let [newX, newY] = [shiftX(tailPosition.coordinates.x), shiftY(tailPosition.coordinates.y)];
    const newTailCoordinates = new Coordinates(shiftX(tailPosition.coordinates.x), shiftY(tailPosition.coordinates.y));
    const newField = <SnakeBodyField>this._fields[newY][newX];
    this._snake.tailPosition = new SnakeBodyField(newTailCoordinates, MARKED_FIELD, newField.direction) // getShift functions, new coordinates, make nes tail Position
 
    // moveHead
    const headPosition = this._snake.headPosition;
    this._fields[headPosition.coordinates.y][headPosition.coordinates.x] = new SnakeBodyField(headPosition.coordinates, MARKED_FIELD, this._snake.direction);
    [shiftX, shiftY] = this.getCoordinateShiftFunctions(this._snake.direction);
    [newX, newY] = [shiftX(headPosition.coordinates.x), shiftY(headPosition.coordinates.y)];
    this.checkBorders(newX, newY);
    this.checkBodyHit(newX, newY);
    const newHeadCoordinates = new Coordinates(newX, newY);
    this._snake.headPosition = new SnakeBodyField(newHeadCoordinates, this._snake.direction);
    this.markField(tailPosition.coordinates, UNMARKED_FIELD);
    this.markField(headPosition.coordinates, MARKED_FIELD);
    this.markField(this._snake.headPosition.coordinates, HEAD_FIELD);
  }

  checkBorders(x:number , y: number) {
    if (x < 0 || x > this._playgroundSize-1 || y < 0 || y > this._playgroundSize-1) {
      throw new Error("Out of borders");
    }
  }

  checkBodyHit(x: number, y: number) {
    const field = this._fields[y][x];
    if (field instanceof SnakeBodyField) {
      throw new Error("You hit yourself");
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
