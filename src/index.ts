
import { GameRunner, Playground, Snake } from './snake';

const snake = new Snake();
const playground = new Playground(snake);
const gameRunner = new GameRunner(playground);

playground.drawPlayground();
playground.drawSnake();

setInterval(
  () => {
    gameRunner.timeSlice();
    console.log(`Snake: headPosition: x:${snake.headPosition.x} y:${snake.headPosition.y}, tailPosition: x:${snake.tailPosition.x}, y:${snake.tailPosition.y}, direction: ${snake.direction}, `);
  },
  gameRunner.timeSlicePeriod
);
