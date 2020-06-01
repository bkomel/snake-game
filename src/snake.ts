
const PLAYGROUND_SIZE = 20;
const INITIAL_SNAKE_LENGTH: number = 3;
enum DIRECTIONS {"UP", "DOWN", "LEFT", "RIGHT"};

class Field {

  private x: number = Math.round( Math.random()*(PLAYGROUND_SIZE-1) );
  private y: number = Math.round( Math.random()*(PLAYGROUND_SIZE-1) );
  private _marked: boolean = false;

}

class Snake {

  private _length: number = INITIAL_SNAKE_LENGTH;
  private _direction: string = DIRECTIONS[Math.round(Math.random()*3)];
  private _headPosition: Field = new Field();
  private _tailPosition: Field;

  get headPosition () {
    return this._headPosition;
  }

  getTailPosition () {

  }

  get direction () {
    return this._direction;
  }

  set direction (direction) {
    this._direction = direction;
  }

}

class Playground {

  private _playgroundSize: number = PLAYGROUND_SIZE;
  private _fields = Array(PLAYGROUND_SIZE).fill(Array(PLAYGROUND_SIZE).fill(0));

  drawPlayground() {
    //
    console.log(this._fields[0][0])
  }

  drawSnake() {
    // markHead
    // mark fields for snake_length in opposite direction
    // setTailPosition
  }

  drawFood() {
    //
  }

  findNewTailPosition() {
    //
  }

  moveSnake(snake: Snake, direction: number) {
    // getTailPosition
    // unmarkTailPosition if tail is not on the food point
    // find new TailPosition
    // setTailPosition
    // find new HeadPosition
    // setHeadPosition
    // markHeadPosition

    // checkConstraints
    // checkFood
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
