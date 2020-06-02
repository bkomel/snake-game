
const PLAYGROUND_SIZE = 20;
const MARKED_FIELD = "black";
const UNMARKED_FIELD = "silver";
const HEAD_FIELD = "blue";
const INITIAL_SNAKE_LENGTH: number = 3;
const UP = "UP";
const DOWN = "DOWN";
const LEFT = "LEFT";
const RIGHT = "RIGHT";

type DirectionsType = "UP" | "DOWN" | "LEFT" | "RIGHT";

class Field {

  private _x: number;
  private _y: number;
  private _marked: boolean = false;
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

export class Playground {

  private _playgroundSize: number = PLAYGROUND_SIZE;
  private _playgroundDiv: any = document.getElementById('playground');
  private _fields = Array(20).fill(0).map(() => { return Array(20).fill(0)});
  private _snake: Snake;

  constructor(snake: Snake) {
    this._snake = snake;
    console.log(this._fields);
  }

  drawPlayground() {
    //

    const table = document.createElement('table');
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
    table.appendChild(tableBody);
    this._playgroundDiv.appendChild(table);
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

  drawFood() {
    //
  }

  findNewTailPosition() {
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
    this.markField(tailPosition, UNMARKED_FIELD);
    this._fields[tailPosition.y][tailPosition.x] = 0; // get tail position and unmark it, leave no traces behind
    let [shiftX, shiftY] = this.getCoordinateShiftFunctions(tailPosition.direction); 
    let [newX, newY] = [shiftX(tailPosition.x), shiftY(tailPosition.y)];
    this._snake.tailPosition = new Field(newX, newY, this._fields[newY][newX]) // getShift functions, new coordinates, make nes tail Position
 
    // moveHead
    const headPosition = this._snake.headPosition;
    this.markField(headPosition, MARKED_FIELD);
    this._fields[headPosition.y][headPosition.x] = this._snake.direction;
    [shiftX, shiftY] = this.getCoordinateShiftFunctions(this._snake.direction);
    [newX, newY] = [shiftX(headPosition.x), shiftY(headPosition.y)];
    this._snake.headPosition = new Field(
      newX, newY, this._snake.direction
    );
    this.markField(this._snake.headPosition, HEAD_FIELD);
  }

}

const TIME_SLICE_PERIOD: number = 3000;

export class GameRunner {

  private _timeSlicePeriod: number = TIME_SLICE_PERIOD; // miliseconds
  private _gameRunning: boolean = false;

  start() {
    this._gameRunning = true;
  }

  pause() {
    this._gameRunning = false;
  }

  reset() {
    this._gameRunning = false;
  }

  gameover() {
    this._gameRunning = false;
  }

  get timeSlicePeriod() {
    return this._timeSlicePeriod;
  }

  get gameRunning () {
    return this._gameRunning;
  }

  timeSlice (): any {
    if (this._gameRunning) {
      // moveSnake
    }
    console.log('timeSlice function')
  }

}

const snake = new Snake();
