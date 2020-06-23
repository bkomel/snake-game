import Score from "./score";
import { Player } from "./player";

const PLAYGROUND_SIZE = 20;
const INITIAL_SNAKE_LENGTH: number = 3;
const TIME_SLICE_PERIOD: number = 90;

const EMPTY_FIELD = "height: 20px; width: 20px; background-color: rgb(170, 170, 170);"; // change #aaa to silver
const FOOD_FIELD = "height: 20px; width: 20px; background-color: rgb(255, 0, 0); border-radius: 15px;";

const SNAKE_HEAD = "height: 20px; width: 20px; background-color: rgb(64, 64, 64); border-radius: 2px";
const SNAKE_HEAD_AND_FOOD = "height: 20px; width: 20px; background-color: rgb(0, 0, 0); border-radius: 2px";
const SNAKE_BODY = "height: 20px; width: 20px; background-color: rgb(126, 126, 126); border-radius: 4px;";
const SNAKE_TAIL = "height: 20px; width: 20px; background-color: #777; border-radius: 4px";
const SNAKE_BODY_AND_FOOD = "height: 20px; width: 20px; background-color: rgb(64, 64, 64); border-radius: 4px";


export const UP = "UP";
export const DOWN = "DOWN";
export const LEFT = "LEFT";
export const RIGHT = "RIGHT";
export const NONE = "NONE";

type FoodType = typeof FOOD_FIELD;
type SnakeBodyType = typeof SNAKE_HEAD | typeof SNAKE_HEAD_AND_FOOD | typeof SNAKE_BODY | typeof SNAKE_BODY_AND_FOOD | typeof SNAKE_TAIL;
type DirectionsType = typeof UP | typeof DOWN | typeof LEFT | typeof RIGHT | typeof NONE;

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

interface ISnakeBodyPart {
  coordinates: Coordinates
  direction: DirectionsType
  type: SnakeBodyType
}

class SnakeBodyPart implements ISnakeBodyPart {

  private _coordinates: Coordinates;
  private _direction: DirectionsType;
  private _type: SnakeBodyType;

  constructor (
    coordinates: Coordinates,
    direction: DirectionsType,
    type: SnakeBodyType
  ) {
    this._coordinates = coordinates;
    this._direction = direction;
    this._type = type;
  }

  get coordinates(){
    return this._coordinates;
  }

  set coordinates(coordinates: Coordinates) {
    this._coordinates = coordinates;
  }

  get direction(){
    return this._direction;
  }

  set direction(direction: DirectionsType) {
    this._direction = direction;
  }

  get type(){
    return this._type;
  }

  set type(type: SnakeBodyType) {
    this._type = type;
  }

}

interface IFood {
  coordinates: Coordinates
  type: FoodType
}

class Food implements IFood {

  private _coordinates: Coordinates
  private _type: FoodType

  constructor (
    coordinates: Coordinates,
    type: FoodType
  ) {
    this._coordinates = coordinates;
    this._type = type;
  }

  get coordinates(){
    return this._coordinates;
  }

  set coordinates(coordinates: Coordinates) {
    this._coordinates = coordinates;
  }

  get type(){
    return this._type;
  }

  set type(type: FoodType) {
    this._type = type;
  }

}

interface ISnake {
  length: number
  direction: DirectionsType
  head: SnakeBodyPart
  body: SnakeBodyPart[]
}

export class Snake implements ISnake{

  private _length: number = INITIAL_SNAKE_LENGTH;
  private _direction: DirectionsType = <DirectionsType>[UP, DOWN, LEFT, RIGHT][Math.floor(Math.random()*4)];
  private _head: SnakeBodyPart = new SnakeBodyPart(
    new Coordinates(
      Math.floor( Math.random() * (PLAYGROUND_SIZE - 2*this._length) + this._length ),
      Math.floor( Math.random() * (PLAYGROUND_SIZE - 2*this._length) + this._length )
    ),
    this._direction,
    SNAKE_HEAD
  )
  private _body: SnakeBodyPart[] = [];


  get length() {
    return this._length;
  }

  set length(length: number) {
    this._length = length;
  }

  get direction () {
    return this._direction;
  }

  set direction (direction: DirectionsType) {
    this._direction = direction;
  }

  set head (head: SnakeBodyPart) {
    this._head = head;
  }

  get head () {
    return this._head;
  }

  set body (body: SnakeBodyPart[]) {
    this._body = body;
  }

  get body () {
    return this._body;
  }

}

interface IPlayground {
  //
}

export class Playground {

  private _playgroundSize: number = PLAYGROUND_SIZE;
  private _playgroundDiv: any = document.getElementById('playground');
  private _snake: Snake;
  private _table: HTMLElement;
  private _score: Score;

  constructor(snake: Snake, score: Score) {
    this._snake = snake;
    this._score = score;
  }

  get snake () {
    return this._snake;
  }

  drawPlayground() {
    this._table = document.createElement('table');
    const tableBody = document.createElement('tbody');
    for (const row in Array(this._playgroundSize).fill(0)) {
      const tableRow = document.createElement('tr');
      for (const col in Array(this._playgroundSize).fill(0)) {
        const tableData = document.createElement('td');
        tableData.setAttribute("style", EMPTY_FIELD);
        tableData.setAttribute("id", col+"-"+row);
        tableData.setAttribute("field-type", EMPTY_FIELD);
        // tableData.append(col+"-"+row);
        tableRow.appendChild(tableData);
      }
      tableBody.appendChild(tableRow);
    }
    this._table.appendChild(tableBody);
    this._table.setAttribute("style", "margin: 0 auto; border: 2px solid; font-size: 6px;");
    this._playgroundDiv.appendChild(this._table);
  }

  resetPlayground() {
    this._snake = new Snake();
    this._table.remove();
    this._score.reset();
    this._score.showScore();
    this.drawPlayground();
    this.drawSnake();
    this.drawFood();
  }

  markField(coordinates: Coordinates, type: string) {
    document.getElementById(coordinates.x.toString() + "-" + coordinates.y.toString())
    .setAttribute("style", type);
  }

  drawSnake() {
    this.markField(this._snake.head.coordinates, this._snake.head.type);
    let shiftX, shiftY, snakeBodyPart;
    for (let i = 1; i < this._snake.length; i++) {
      [shiftX, shiftY]=this.getCoordinateShiftFunctions(this._snake.direction, true, i);
      snakeBodyPart = new SnakeBodyPart(new Coordinates(
        shiftX(this._snake.head.coordinates.x),
        shiftY(this._snake.head.coordinates.y)
      ), this._snake.direction, SNAKE_BODY);
      this._snake.body = [...this._snake.body, snakeBodyPart];
      this.markField(snakeBodyPart.coordinates, snakeBodyPart.type);
    }
  }

  flashTableBorder() {
    let i = 5;
    let interval = setInterval(() => {
      if (i%2) {
        this._table.setAttribute("style", "margin: 0 auto; border: 2px solid red; font-size: 6px;");
      } else {
        this._table.setAttribute("style", "margin: 0 auto; border: 2px solid; font-size: 6px;");
      }
      if (i<0) {
        this._table.setAttribute("style", "margin: 0 auto; border: 2px solid; font-size: 6px;");
        clearInterval(interval);
      }
      i--;
    }, 300)
  }

  drawFood () {
    let coordinates: Coordinates;
    do {
      coordinates = new Coordinates(
        Math.floor( Math.random() * (this._playgroundSize - 1) ),
        Math.floor( Math.random() * (this._playgroundSize - 1) )
      )
    } while (document.getElementById(coordinates.x+"-"+coordinates.y).getAttribute("style") !== EMPTY_FIELD)
    this.markField(coordinates, FOOD_FIELD);
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
    // head
    const newHeadCoordinates = this.makeShiftedCoordinates(this._snake.head.coordinates, this._snake.direction);
    this.checkBorderHit(newHeadCoordinates);
    this.checkBodyHit(newHeadCoordinates);

    let headType: SnakeBodyType = SNAKE_HEAD;
    let neckType: SnakeBodyType = this._snake.head.type === SNAKE_HEAD ? SNAKE_BODY: SNAKE_BODY_AND_FOOD;
    if (this.checkFoodHit(newHeadCoordinates)) {
      this._score.score = this._score.score += 1;
      this._score.showScore();
      headType = SNAKE_HEAD_AND_FOOD;
      this.drawFood();
    }

    const snakeBody = [
      new SnakeBodyPart(this._snake.head.coordinates, this._snake.direction, neckType),
      ...this._snake.body
    ];
    this.markField(this._snake.head.coordinates, neckType);

    // tail
    const tail = snakeBody[snakeBody.length - 1];
    if (snakeBody[snakeBody.length - 1].type === SNAKE_BODY_AND_FOOD) {
      snakeBody[snakeBody.length - 1] = new SnakeBodyPart(tail.coordinates, tail.direction, SNAKE_BODY);
      this.markField(tail.coordinates, SNAKE_BODY);
    } else {
      snakeBody.pop();
      this.markField(tail.coordinates, EMPTY_FIELD);
    }

    this._snake.body = snakeBody;    

    this._snake.head = new SnakeBodyPart(newHeadCoordinates, this._snake.direction, headType);
    this.markField(this._snake.head.coordinates, this._snake.head.type);
  }

  makeShiftedCoordinates(coordinates: Coordinates, direction: DirectionsType) {
    let [shiftX, shiftY] = this.getCoordinateShiftFunctions(direction);
    return new Coordinates(
      shiftX(coordinates.x),
      shiftY(coordinates.y)
    )
  }

  checkBorderHit (coordinates: Coordinates) {
    if (coordinates.x < 0 || coordinates.x > this._playgroundSize-1 || coordinates.y < 0 || coordinates.x > this._playgroundSize) {
      console.log("You hit the border!");
      throw new Error("You hit the border!");
    }
  }

  checkBodyHit (coordinates: Coordinates) {
    const fieldStyle = document.getElementById(coordinates.x+"-"+coordinates.y).style.cssText;
    if (fieldStyle === SNAKE_BODY || fieldStyle === SNAKE_BODY_AND_FOOD) {
      console.log("You hit yourself");
      throw new Error("You hit yourself");
    }
  }

  checkFoodHit (coordinates: Coordinates) {
    if (document.getElementById(coordinates.x+"-"+coordinates.y).style.cssText === FOOD_FIELD) {
      return true;
    } else {
      return false;
    }
  }

}

export class GameRunner {

  private _timeSlicePeriod: number = TIME_SLICE_PERIOD; // miliseconds
  private _gameRunning: boolean = false;
  private _playground: Playground;
  private _player: Player;

  constructor (playground: Playground, player: Player) {
    this._playground = playground;
    this._player = player;
    this.showPlayerName();
    this.enterRandomPlayerName = this.enterRandomPlayerName.bind(this);
    this.changePlayerName = this.changePlayerName.bind(this);
  }

  start() {
    this.disablePlayerNameChanging();
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
    this.enablePlayerNameChanging();
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

  sKeyListener = (ev: KeyboardEvent) => {
    switch(ev.keyCode) {
      case 115: {
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
        if (this._playground.snake.direction !== DOWN) {
          this._playground.snake.direction = UP;
        }
        break;
      }
      case 107: {
        if (this._playground.snake.direction !== UP) {
          this._playground.snake.direction = DOWN;
        }
        break;
      }
      case 106: {
        if (this._playground.snake.direction !== RIGHT) {
          this._playground.snake.direction = LEFT;
        }
        break;
      }
      case 108: {

        if (this._playground.snake.direction !== LEFT) {
          this._playground.snake.direction = RIGHT;
        }
        break;
      }
    }
  }

  enableGameControls () {
    document.addEventListener('keypress', this.sKeyListener);
  }

  disableGameControls () {
    document.removeEventListener('keypress', this.sKeyListener);
  }

  enableSnakeControls () {
    document.addEventListener('keypress', this.controlKeysListener);
  }

  disableSnakeControls () {
    document.removeEventListener('keypress', this.controlKeysListener);
  }

  showPlayerName () {
    document.getElementById("greeting").innerHTML = `<h2>Hello, ${this._player.name}</h2>`;
  }

  enablePlayerRandomName() {
    const element = document.getElementById("randomName");
    element.removeAttribute("disabled");
    element.addEventListener("click", this.enterRandomPlayerName);
  }

  disablePlayerRandomName() {
    const element = document.getElementById("randomName");
    element.setAttribute("disabled", "true");
    element.removeEventListener("click", this.enterRandomPlayerName);
  }

  enterRandomPlayerName(ev: MouseEvent) {
    ev.preventDefault();
    (<HTMLInputElement>document.getElementById("nameInput")).value = this._player.makeRandomName();
    document.getElementById("randomName").blur();
  }

  enableConfirmPlayerName() {
    const element = document.getElementById("submitName");
    element.removeAttribute("disabled");
    element.addEventListener("click", this.changePlayerName);
  }

  disableConfirmPlayerName() {
    const element = document.getElementById("submitName");
    element.setAttribute("disabled", "true");
    element.removeEventListener("click", this.changePlayerName);
  }

  changePlayerName(ev: MouseEvent) {
    ev.preventDefault();
    this._player.name = (<HTMLInputElement>document.getElementById("nameInput")).value;
    this.showPlayerName();
    document.getElementById("submitName").blur();
  }

  enablePlayerNameChanging () {
    this.enablePlayerRandomName();
    this.enableConfirmPlayerName();
  }

  disablePlayerNameChanging () {
    this.disablePlayerRandomName();
    this.disableConfirmPlayerName();
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
