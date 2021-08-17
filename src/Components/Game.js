import React, { useState, useRef, useEffect } from "react";
import { useInterval } from "./useInterval";
import {
  CANVAS_SIZE,
  SNAKE_START,
  APPLE_START,
  SCALE,
  SPEED,
  DIRECTIONS,
} from "./constants";
import Coinflip from "./coinflip.gif";
import Snake from "./snake.gif";

const Game = () => {
  const canvasRef = useRef();
  const [snake, setSnake] = useState(SNAKE_START);
  const [apple, setApple] = useState(APPLE_START);
  const [points, setPoints] = useState(0);
  const [totalPoints, setTotalPoints] = useState(0);
  const [dir, setDir] = useState([0, -1]);
  const [speed, setSpeed] = useState(null);
  const [gameOver, setGameOver] = useState(false);

  useInterval(() => gameLoop(), speed);

  const endGame = () => {
    setSpeed(null);
    setGameOver(true);
    if (points > totalPoints) {
      setTotalPoints(points);
    }
  };

  const moveSnake = ({ keyCode }) => {
    keyCode >= 37 && keyCode <= 40 && setDir(DIRECTIONS[keyCode]);
    if (keyCode === 39 && dir[0] === -1 && dir[1] === 0) {
      setDir(DIRECTIONS[37]);
    } else if (keyCode === 37 && dir[0] === 1 && dir[1] === 0) {
      setDir(DIRECTIONS[39]);
    } else if (keyCode === 38 && dir[0] === 0 && dir[1] === 1) {
      setDir(DIRECTIONS[40]);
    } else if (keyCode === 40 && dir[0] === 0 && dir[1] === -1) {
      setDir(DIRECTIONS[38]);
    }
  };

  const createApple = () =>
    apple.map((_a, i) => Math.floor(Math.random() * (CANVAS_SIZE[i] / SCALE)));

  const checkCollision = (piece, snk = snake) => {
    if (
      piece[0] * SCALE >= CANVAS_SIZE[0] ||
      piece[0] < 0 ||
      piece[1] * SCALE >= CANVAS_SIZE[1] ||
      piece[1] < 0
    )
      return true;

    for (const segment of snk) {
      if (piece[0] === segment[0] && piece[1] === segment[1]) return true;
    }
    return false;
  };

  const checkAppleCollision = (newSnake) => {
    if (newSnake[0][0] === apple[0] && newSnake[0][1] === apple[1]) {
      setSpeed(speed - 1);
      setPoints(points + 1);
      let newApple = createApple();
      while (checkCollision(newApple, newSnake)) {
        newApple = createApple();
      }
      setApple(newApple);
      return true;
    }
    return false;
  };

  const gameLoop = () => {
    const snakeCopy = JSON.parse(JSON.stringify(snake));
    const newSnakeHead = [snakeCopy[0][0] + dir[0], snakeCopy[0][1] + dir[1]];
    snakeCopy.unshift(newSnakeHead);
    if (checkCollision(newSnakeHead)) endGame();
    if (!checkAppleCollision(snakeCopy)) snakeCopy.pop();
    setSnake(snakeCopy);
  };

  const startGame = () => {
    setSnake(SNAKE_START);
    setApple(APPLE_START);
    setDir([0, -1]);
    setSpeed(SPEED);
    setGameOver(false);
    setPoints(0);
  };

  useEffect(() => {
    const context = canvasRef.current.getContext("2d");
    context.setTransform(SCALE, 0, 0, SCALE, 0, 0);
    context.clearRect(0, 0, window.innerWidth, window.innerHeight);
    context.fillStyle = "green";
    snake.forEach(([x, y]) => context.fillRect(x, y, 1, 1));
    context.fillStyle = "red";
    context.fillRect(apple[0], apple[1], 1, 1);
  }, [snake, apple, gameOver]);

  return (
    <div role="button" tabIndex="0" onKeyDown={(e) => moveSnake(e)}>
      <header className="headerS">Snake</header>
      <div className="containerpoints">
        {points}
        <img
          style={{ width: "30px", height: "30px" }}
          src={Coinflip}
          alt="coin"
        ></img>
      </div>
      <div className="containersnake">
        <img
          style={{ width: "70px", height: "70px", float: "left" }}
          src={Snake}
          alt="snake"
        ></img>
        <img
          style={{ width: "70px", height: "70px", float: "right" }}
          src={Snake}
          alt="snake"
        ></img>
      </div>
      <button className="playagainbtn" onClick={startGame}>
        Play again?
      </button>
      <canvas
        className="canvas"
        ref={canvasRef}
        width={`${CANVAS_SIZE[0]}px`}
        height={`${CANVAS_SIZE[1]}px`}
      />
      <div className="popup">
        {gameOver && (
          <div className="gameover">GAME OVER! HighScore: {totalPoints}</div>
        )}
      </div>
    </div>
  );
};

export default Game;
