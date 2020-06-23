
const INITIAL_SCORE = 0;

export default class Score {

  private _score: number = INITIAL_SCORE;
  private _element: HTMLElement;

  constructor (
    element: HTMLElement,
    score: number = INITIAL_SCORE
  ) {
    this._score = score;
    this._element = element;
  }

  showScore() {
    this._element.innerHTML = String(this.score);
  }

  reset() {
    this._score = INITIAL_SCORE
  }

  get score() {
    return this._score;
  }

  set score(score: number) {
    this._score = score;
  }
}
