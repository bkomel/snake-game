
import { GameRunner, Playground, Snake } from './snake';

const snake = new Snake();
const playground = new Playground(snake);
const gameRunner = new GameRunner();

playground.drawPlayground();
playground.drawSnake();
setTimeout(
  () => {
    playground.moveSnake();
    console.log(`Snake: headPosition: x:${snake.headPosition.x} y:${snake.headPosition.y}, tailPosition: x:${snake.tailPosition.x}, y:${snake.tailPosition.y}, direction: ${snake.direction}, `);
  },
  3000
);
snake.direction = 'LEFT';

console.log(`Snake: headPosition: x:${snake.headPosition.x} y:${snake.headPosition.y}, tailPosition: x:${snake.tailPosition.x}, y:${snake.tailPosition.y}, direction: ${snake.direction}, `);

// setInterval(
//   gameRunner.timeSlice,
//   gameRunner.timeSlicePeriod
// )
