
import { GameRunner, Playground, Snake, UP, DOWN, LEFT, RIGHT } from './snake';

const snake = new Snake();
const playground = new Playground(snake);
const gameRunner = new GameRunner(playground);

playground.drawPlayground();
// playground.drawSnake();
// playground.drawFood();
// gameRunner.enableGameControls();


// setInterval(
//   () => {
//     gameRunner.timeSlice();
//     //console.log(`Snake: headPosition: x:${snake.headPosition.x} y:${snake.headPosition.y}, tailPosition: x:${snake.tailPosition.x}, y:${snake.tailPosition.y}, direction: ${snake.direction}, `);
//   },
//   gameRunner.timeSlicePeriod
// );
