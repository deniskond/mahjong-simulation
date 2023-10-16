export enum SUITS {
  CIRCLE = 'CIRCLE',
  BAMBOO = 'BAMBOO',
  CHARACTER = 'CHARACTER',
}

export enum DRAGONS {
  RED = 'RED',
  GREEN = 'GREEN',
  WHITE = 'WHITE',
}

export enum WINDS {
  EAST = 'EAST',
  WEST = 'WEST',
  NORTH = 'NORTH',
  SOUTH = 'SOUTH',
}

export interface TileInterface {
  number: number | null; // number on tile
  type: SUITS | DRAGONS | WINDS;
  count: number; // which one of four of the same kind
}

let singleTiles: TileInterface[] = [
  {
    number: null,
    type: DRAGONS.RED,
    count: 1,
  },
  {
    number: null,
    type: DRAGONS.GREEN,
    count: 1,
  },
  {
    number: null,
    type: DRAGONS.WHITE,
    count: 1,
  },
  {
    number: null,
    type: WINDS.EAST,
    count: 1,
  },
  {
    number: null,
    type: WINDS.WEST,
    count: 1,
  },
  {
    number: null,
    type: WINDS.SOUTH,
    count: 1,
  },
  {
    number: null,
    type: WINDS.NORTH,
    count: 1,
  },
];

(Object.values(SUITS) as SUITS[]).forEach((suit: SUITS) => {
  singleTiles = [
    ...new Array(9).fill(null).map((el, index) => ({
      number: index + 1,
      type: suit,
      count: 1,
    })),
    ...singleTiles,
  ];
});

export const TILES = singleTiles.reduce<TileInterface[]>((tiles, tile) => {
  return [
    ...tiles,
    { ...tile, count: 1 },
    { ...tile, count: 2 },
    { ...tile, count: 3 },
    { ...tile, count: 4 },
  ];
}, []);
