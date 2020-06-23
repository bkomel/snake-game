
import { adjectives } from './adjectives';
import { lastnames } from './lastnames';

export class Player {

  private _name: string;

  constructor (name="unknown") {
    this._name = name;
  }

  makeRandomName () {
    const randomAdj = adjectives[Math.floor(Math.random() * adjectives.length)];
    const randomName = lastnames[Math.floor(Math.random() * lastnames.length)];
    return String.prototype.concat(
      randomAdj.charAt(0).toUpperCase()+randomAdj.slice(1),
      " ",
      randomName
    )
  }

  get name() {
    return this._name;
  }

  set name(name: string) {
    this._name = name;
  }

}