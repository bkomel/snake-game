
import { GameRunner, Playground, Snake, UP, DOWN, LEFT, RIGHT } from './snake';
import Score from './score';
import { Player } from './player';

const snake = new Snake();
const score = new Score(document.getElementById("score"));
const player = new Player();
const playground = new Playground(snake, score);
const gameRunner = new GameRunner(playground, player);

playground.drawPlayground();
playground.drawSnake();
playground.drawFood();
gameRunner.enableGameControls();
gameRunner.enablePlayerNameChanging();
score.showScore();


setInterval(
  () => {
    gameRunner.timeSlice();
    //console.log(`Snake: headPosition: x:${snake.headPosition.x} y:${snake.headPosition.y}, tailPosition: x:${snake.tailPosition.x}, y:${snake.tailPosition.y}, direction: ${snake.direction}, `);
  },
  gameRunner.timeSlicePeriod
);
