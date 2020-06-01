
import { GameRunner } from './snake';

const gameRunner = new GameRunner();

setInterval(
  gameRunner.timeSlice,
  gameRunner.timeSlicePeriod
)
