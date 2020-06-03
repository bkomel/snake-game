
const PLAYGROUND_SIZE = 20;
const MARKED_FIELD = "height: 20px; width: 20px; background-color: #777; border-radius: 4px";
const UNMARKED_FIELD = "height: 20px; width: 20px; background-color: silver;";
const HEAD_FIELD = "height: 20px; width: 20px; background-color: black; border-radius: 2px";
const FOOD_FIELD = "height: 20px; width: 20px; background-color: red; border-radius: 15px";
const BODY_AND_FOOD_FIELD = "height: 20px; width: 20px; background-color: #444; border-radius: 2px"
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
    this.drawFood();
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
    let coordinates: Coordinates;
    do {
      coordinates = new Coordinates(
        Math.floor(Math.random() * (this._playgroundSize - 1) ),
        Math.floor(Math.random() * (this._playgroundSize - 1) )
      )
    } while (this._fields[coordinates.y][coordinates.x] !instanceof SnakeBodyField)
    this.setField(coordinates, new FoodField(coordinates, FOOD_FIELD));
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
