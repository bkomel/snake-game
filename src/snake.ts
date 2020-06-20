
const PLAYGROUND_SIZE = 20;
const MARKED_FIELD = "height: 20px; width: 20px; background-color: #777; border-radius: 4px";
const UNMARKED_FIELD = "height: 20px; width: 20px; background-color: silver;";
const HEAD_FIELD = "height: 20px; width: 20px; background-color: black; border-radius: 2px";
const FOOD_FIELD = "height: 20px; width: 20px; background-color: rgb(255, 0, 0); border-radius: 15px;";
const BODY_AND_FOOD_FIELD = "height: 20px; width: 20px; background-color: #444; border-radius: 2px"
const INITIAL_SNAKE_LENGTH: number = 3;

const EMPTY_FIELD = "height: 20px; width: 20px; background-color: rgb(170, 170, 170);"; // change #aaa to silver

const SNAKE_HEAD = "height: 20px; width: 20px; background-color: rgb(64, 64, 64); border-radius: 2px";
const SNAKE_HEAD_AND_FOOD = "height: 20px; width: 20px; background-color: rgb(0, 0, 0); border-radius: 2px";
const SNAKE_BODY = "height: 20px; width: 20px; background-color: rgb(126, 126, 126); border-radius: 4px;";
const SNAKE_TAIL = "height: 20px; width: 20px; background-color: #777; border-radius: 4px";
const SNAKE_BODY_AND_FOOD = "height: 20px; width: 20px; background-color: rgb(64, 64, 64); border-radius: 4px";


type SnakeBodyType = typeof SNAKE_HEAD | typeof SNAKE_HEAD_AND_FOOD | typeof SNAKE_BODY | typeof SNAKE_BODY_AND_FOOD | typeof SNAKE_TAIL;
type FoodType = typeof FOOD_FIELD;

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

interface ISnakeBodyPart {
  coordinates: Coordinates
  direction: DirectionsType
  type: SnakeBodyType
  containsFood: boolean
}

class SnakeBodyPart implements ISnakeBodyPart {

  private _coordinates: Coordinates;
  private _direction: DirectionsType;
  private _type: SnakeBodyType;
  private _containsFood: boolean;

  constructor (
    coordinates: Coordinates,
    direction: DirectionsType,
    type: SnakeBodyType,
    containsFood: boolean = false
  ) {
    this._coordinates = coordinates;
    this._direction = direction;
    this._type = type;
    this._containsFood = containsFood
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

  get containsFood() {
    return this._containsFood;
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

interface IFoodField extends Field {
  foodType: any
}

class FoodField extends Field implements IFoodField {

  private _foodType: any

  constructor (
    coordinates: Coordinates = new Coordinates(),
    foodType: any
  ) {
    super(coordinates);
    this._foodType = foodType;
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
  private _fields: (SnakeBodyField | Field) [][];
  private _snake: Snake;
  private _table: HTMLElement;

  constructor(snake: Snake) {
    this._snake = snake;
    this._fields = this.initializeFields();
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
    //this._fields = this.initializeFields();
    this._table.remove();
    this.drawPlayground();
    this.drawSnake2();
    this.drawFood2();
  }

  markField(coordinates: Coordinates, type: string) {
    document.getElementById(coordinates.x.toString() + "-" + coordinates.y.toString())
    .setAttribute("style", type);
  }

  drawSnake2() {
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

  drawFood2 () {
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

  getField(coordinates: Coordinates): Field | ISnakeBodyField | IFoodField {
    return this._fields[coordinates.y][coordinates.x];
  }

  setField(coordinates: Coordinates, field: (SnakeBodyField | Field)) {
    this._fields[coordinates.y][coordinates.x] = field;
  }

  moveSnake2() {
    // head
    const newHeadCoordinates = this.makeShiftedCoordinates(this._snake.head.coordinates, this._snake.direction);
    this.checkBorderHit(newHeadCoordinates);
    this.checkBodyHit2(newHeadCoordinates);

    let headType: SnakeBodyType = SNAKE_HEAD;
    let neckType: SnakeBodyType = this._snake.head.type === SNAKE_HEAD ? SNAKE_BODY: SNAKE_BODY_AND_FOOD;
    if (this.checkFoodHit(newHeadCoordinates)) {
      // updateScore
      headType = SNAKE_HEAD_AND_FOOD;
      this.drawFood2();
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

  moveSnake() {

    // head
    const _newHeadCoordinates = this.makeShiftedCoordinates(this._snake.headPosition.coordinates, this._snake.direction);
    this.checkBorderHit(_newHeadCoordinates);
    this.checkBodyHit(_newHeadCoordinates);
    if (this.checkFoodField(_newHeadCoordinates)) {
      // update Score;
      this.drawFood();
    }
    const afterHeadBodyType = this.checkFoodField(this._snake.headPosition.coordinates) ? BODY_AND_FOOD_FIELD: MARKED_FIELD;
    this.setField(
      this._snake.headPosition.coordinates,
      new SnakeBodyField(this._snake.headPosition.coordinates, afterHeadBodyType, this._snake.direction)
    );
    this.markField(this._snake.headPosition.coordinates, afterHeadBodyType);
    this._snake.headPosition = new SnakeBodyField(_newHeadCoordinates, HEAD_FIELD, this._snake.direction);  // this._snake.headPosition could just be headCoordinates
    this.markField(this._snake.headPosition.coordinates, HEAD_FIELD);

    // tail
    if (this.checkBodyAndFoodField(this._snake.tailPosition.coordinates)) {
      this.setField(
        this._snake.tailPosition.coordinates,
        new SnakeBodyField(
          this._snake.tailPosition.coordinates, MARKED_FIELD,
          this._snake.tailPosition.direction
        )
      )
      this._snake.length = this._snake.length + 1;
    } else {
      const tailField = <SnakeBodyField>this.getField(this._snake.tailPosition.coordinates);
      const _newTailCoordinates = this.makeShiftedCoordinates(this._snake.tailPosition.coordinates, tailField.direction);
      const newTailField = <SnakeBodyField>this.getField(_newTailCoordinates);
      this.setField(this._snake.tailPosition.coordinates, new Field(this._snake.tailPosition.coordinates))
      this.markField(this._snake.tailPosition.coordinates, UNMARKED_FIELD);
      this._snake.tailPosition = new SnakeBodyField(_newTailCoordinates, MARKED_FIELD, newTailField.direction);
    }
  }

  makeShiftedCoordinates(coordinates: Coordinates, direction: DirectionsType) {
    let [shiftX, shiftY] = this.getCoordinateShiftFunctions(direction);
    return new Coordinates(
      shiftX(coordinates.x),
      shiftY(coordinates.y)
    )
  }

  makeNewTailPosition(tailPosition: SnakeBodyField) {
    let [shiftX, shiftY] = this.getCoordinateShiftFunctions(tailPosition.direction);
    let [newX, newY] = [shiftX(tailPosition.coordinates.x), shiftY(tailPosition.coordinates.y)];
    return new SnakeBodyField(
      new Coordinates(
        shiftX(tailPosition.coordinates.x)
      )
    )
  }

  checkBorderHit (coordinates: Coordinates) {
    if (coordinates.x < 0 || coordinates.x > this._playgroundSize-1 || coordinates.y < 0 || coordinates.x > this._playgroundSize) {
      console.log("You hit the border!");
      throw new Error("You hit the border!");
    }
  }

  checkBodyHit2 (coordinates: Coordinates) {
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

  checkBodyHit(coordinates: Coordinates) {
    if (this._fields[coordinates.y][coordinates.x] instanceof SnakeBodyField) {
      console.log("You hit yourself!");
      throw new Error("You hit yourself!");
    }
  }

  checkFoodField(coordinates: Coordinates) {
    const field = this.getField(coordinates);
    if (field instanceof FoodField) {
      return true;
    } else {
      return false;
    }
  }

  checkBodyAndFoodField(coordinates: Coordinates) {
    const field = <SnakeBodyField>this.getField(coordinates);
    if (field.bodyType === BODY_AND_FOOD_FIELD) {
      return true;
    } else {
      return false;
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
        this._playground.moveSnake2()
      } catch (error) {
        this.gameover();
      }
    }
  }

}
