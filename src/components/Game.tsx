import {SafeAreaView, StyleSheet, Text, View} from 'react-native';
import React, {useEffect, useState} from 'react';
import {
  GestureEvent,
  PanGestureHandler,
  PanGestureHandlerEventPayload,
} from 'react-native-gesture-handler';

import {Colors} from '../styles/colors';
import {Coordinate, Direction} from '../types/types';
import Snake from './Snake';
import {CheckGameOver} from '../utils/CheckGameOver';
import Food from './Food';
import {checkEatsFood} from '../utils/CheckEatsFood';
import {randomFoodPosition} from '../utils/getRandomFoodPosition';
import Header from './Header';

const SNAKE_INITIAL_POSITION = [{x: 5, y: 5}];
const FOOD_INITIAL_POSITION = {x: 5, y: 20};
const GAME_BOUNDS = {xMin: 0, xMax: 35, yMin: 0, yMax: 60};
const MOVE_INTERVAL = 50;
const SCORE_INCREMENT = 10;

const Game = (): JSX.Element => {
  const [direction, setDirection] = useState<Direction>(Direction.Right);
  const [snake, setSnake] = useState<Coordinate[]>(SNAKE_INITIAL_POSITION);
  const [food, setFood] = useState<Coordinate>(FOOD_INITIAL_POSITION);
  const [isGameOver, setIsGameOver] = useState<boolean>(false);
  const [isPaused, setIsPaused] = useState<boolean>(false);
  const [score, setScore] = useState<number>(0);

  useEffect(() => {
    if (!isGameOver) {
      const interval = setInterval(() => {
        !isPaused && moveSnake();
      }, MOVE_INTERVAL);
      return () => clearInterval(interval);
    }
  }, [snake, isGameOver, isPaused]);

  const moveSnake = () => {
    const snakeHead = snake[0];
    const newHead = {...snakeHead}; //creating copy to edit it

    //game over
    if (CheckGameOver(snakeHead, GAME_BOUNDS)) {
      setIsGameOver(prev => !prev);
      return;
    }

    switch (direction) {
      case Direction.Up:
        newHead.y -= 1;
        break;
      case Direction.Down:
        newHead.y += 1;
        break;
      case Direction.Left:
        newHead.x -= 1;
        break;
      case Direction.Right:
        newHead.x += 1;
        break;
      default:
        break;
    }
    //if eats food ,grow snake
    if (checkEatsFood(snakeHead, food, 2)) {
      //set food on another position
      setFood(randomFoodPosition(GAME_BOUNDS.xMax, GAME_BOUNDS.yMax));
      setSnake([newHead, ...snake]);
      setScore(score + SCORE_INCREMENT);
    } else {
      setSnake([newHead, ...snake.slice(0, -1)]);
    }
  };

  const handleGesture = (
    event: GestureEvent<PanGestureHandlerEventPayload>,
  ) => {
    const {translationX, translationY} = event.nativeEvent;
    if (Math.abs(translationX) > Math.abs(translationY)) {
      if (translationX > 0) {
        //move to right
        setDirection(Direction.Right);
      } else {
        //move to left
        setDirection(Direction.Left);
      }
    } else {
      if (translationY > 0) {
        //move to down
        setDirection(Direction.Down);
      } else {
        //move to up
        setDirection(Direction.Up);
      }
    }
  };
  const pauseGame = () => {
    setIsPaused(!isPaused);
  };
  const reloadGame = () => {
    setDirection(Direction.Right);
    setSnake(SNAKE_INITIAL_POSITION);
    setFood(FOOD_INITIAL_POSITION);
    setIsGameOver(false);
    setIsPaused(false);
    setScore(0);
  };
  return (
    <PanGestureHandler onGestureEvent={handleGesture}>
      <SafeAreaView style={styles.container}>
        <Header
          isPaused={isPaused}
          pauseGame={pauseGame}
          reloadGame={reloadGame}>
          <Text style={styles.score}>{score}</Text>
        </Header>
        <View style={styles.boundries}>
          <Snake snake={snake} />
          <Food x={food.x} y={food.y} />
        </View>
      </SafeAreaView>
    </PanGestureHandler>
  );
};

export default Game;

const styles = StyleSheet.create({
  container: {
    backgroundColor: Colors.primary,
    flex: 1,
  },
  boundries: {
    flex: 1,
    borderColor: Colors.primary,
    borderWidth: 12,
    borderBottomLeftRadius: 30,
    borderBottomRightRadius: 30,
    backgroundColor: Colors.background,
  },
  score: {
    fontWeight: 'bold',
    fontSize: 20,
    color: Colors.primary,
  },
});
