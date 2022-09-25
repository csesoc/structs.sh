import { strokeWidth } from '../../common/constants';

export const whitespace = 5;
export const topOffset = 60;
export const boxWidth = 50;
export const textCy = 230;

export const CANVAS = '#canvas';

export const shapeAttributes = {
  'stroke-width': strokeWidth,
  stroke: 'black',
  fill: 'black',
  opacity: 0,
};

export const textAttributes = {
  x: boxWidth / 2,
  y: topOffset,
  'dominant-baseline': 'middle',
  'text-anchor': 'middle',
  'stroke-width': 0,
  'font-family': 'CodeText',
  opacity: 0,
};
