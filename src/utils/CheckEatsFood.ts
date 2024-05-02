import {Coordinate} from '../types/types';

export const checkEatsFood = (
  snakeHead: Coordinate,
  food: Coordinate,
  area: number,
): boolean => {
  const distanceX = Math.abs(snakeHead.x - food.x);
  const distanceY = Math.abs(snakeHead.y - food.y);
  return distanceX < area && distanceY < area;
};
