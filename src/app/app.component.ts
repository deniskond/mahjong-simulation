import { Component } from '@angular/core';
import { DRAGONS, SUITS, TILES, TileInterface } from './tiles.const';

interface TurnInterface {
  number: number;
  dragonPungForAnotherPlayerCount: number;
  dragonPungForFirstPlayerCount: number;
}

interface ResultInterface {
  strategies: Strategy[];
  doubleForPlayerProbability: number;
  doubleForOpponentsProbability: number;
}

interface ComparisonResultInterface {
  strategy: Strategy;
  doubleForPlayerProbability: number;
  doubleForOpponentsProbability: number;
}

enum Strategy {
  KEEP_ANY = 'KEEP_ANY',
  DISCARD_ONE = 'DISCARD_ONE',
  DISCARD_IN_MIDDLE = 'DISCARD_IN_MIDDLE',
}

const RED_DRAGON_TILE: TileInterface = {
  number: null,
  type: DRAGONS.RED,
  count: 1,
};

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.less'],
})
export class AppComponent {
  public wallTiles: TileInterface[] = [];
  public hands: TileInterface[][] = [];
  private turnsToEmulate = 16;
  public readonly epochs = 10000;
  public currentEpoch = 1;
  public turns: TurnInterface[] = [];
  private strategies: [Strategy, Strategy, Strategy, Strategy] = [
    Strategy.KEEP_ANY,
    Strategy.KEEP_ANY,
    Strategy.KEEP_ANY,
    Strategy.KEEP_ANY,
  ];
  private allStrategies: [Strategy, Strategy, Strategy] = [
    Strategy.DISCARD_IN_MIDDLE,
    Strategy.DISCARD_ONE,
    Strategy.KEEP_ANY,
  ];
  public results: ResultInterface[] = [];
  public comparisonResults: ComparisonResultInterface[] = [
    {
      strategy: Strategy.DISCARD_IN_MIDDLE,
      doubleForPlayerProbability: 0,
      doubleForOpponentsProbability: 0,
    },
    {
      strategy: Strategy.DISCARD_ONE,
      doubleForPlayerProbability: 0,
      doubleForOpponentsProbability: 0,
    },
    {
      strategy: Strategy.KEEP_ANY,
      doubleForPlayerProbability: 0,
      doubleForOpponentsProbability: 0,
    },
  ];

  ngOnInit(): void {
    for (let first = 0; first < 3; first++) {
      for (let second = 0; second < 3; second++) {
        for (let third = 0; third < 3; third++) {
          for (let fourth = 0; fourth < 3; fourth++) {
            this.strategies = [
              this.allStrategies[first],
              this.allStrategies[second],
              this.allStrategies[third],
              this.allStrategies[fourth],
            ];

            this.runEpochs();

            const doubleForOpponentsProbability =
              (this.turns[16].dragonPungForAnotherPlayerCount / this.epochs) *
              100;

            const doubleForPlayerProbability =
              (this.turns[16].dragonPungForFirstPlayerCount / this.epochs) *
              100;

            this.results.push({
              strategies: this.strategies,
              doubleForOpponentsProbability,
              doubleForPlayerProbability,
            });

            this.comparisonResults[first].doubleForOpponentsProbability +=
              doubleForOpponentsProbability;

            this.comparisonResults[first].doubleForPlayerProbability +=
              doubleForPlayerProbability;
          }
        }
      }
    }

    this.comparisonResults = this.comparisonResults.map((comparisonResult: ComparisonResultInterface) => ({
      ...comparisonResult,
      doubleForOpponentsProbability: comparisonResult.doubleForOpponentsProbability / 27,
      doubleForPlayerProbability: comparisonResult.doubleForPlayerProbability / 27,
    }))
  }

  private setHands(): void {
    this.wallTiles = TILES;
    this.hands = [];

    const firstPlayerHand: TileInterface[] = [
      {
        number: null,
        type: DRAGONS.RED,
        count: 1,
      },
      {
        number: 1,
        type: SUITS.BAMBOO,
        count: 1,
      },
      {
        number: 1,
        type: SUITS.BAMBOO,
        count: 2,
      },
      {
        number: 1,
        type: SUITS.BAMBOO,
        count: 3,
      },
      {
        number: 1,
        type: SUITS.BAMBOO,
        count: 4,
      },
      {
        number: 2,
        type: SUITS.BAMBOO,
        count: 1,
      },
      {
        number: 3,
        type: SUITS.BAMBOO,
        count: 1,
      },
      {
        number: 4,
        type: SUITS.BAMBOO,
        count: 1,
      },
      {
        number: 5,
        type: SUITS.BAMBOO,
        count: 1,
      },
      {
        number: 6,
        type: SUITS.BAMBOO,
        count: 1,
      },
      {
        number: 7,
        type: SUITS.BAMBOO,
        count: 1,
      },
      {
        number: 8,
        type: SUITS.BAMBOO,
        count: 1,
      },
      {
        number: 9,
        type: SUITS.BAMBOO,
        count: 1,
      },
    ];

    this.wallTiles = this.wallTiles.filter((wallTile: TileInterface) => {
      return firstPlayerHand.every(
        (firstPlayerTile: TileInterface) =>
          !this.isStrictEqualTiles(wallTile, firstPlayerTile)
      );
    });

    this.hands.push(firstPlayerHand);
    this.hands.push(this.drawRandomHand());
    this.hands.push(this.drawRandomHand());
    this.hands.push(this.drawRandomHand());
  }

  private runEpochs(): void {
    for (let turn = 0; turn <= this.turnsToEmulate; turn++) {
      this.turns[turn] = {
        number: turn,
        dragonPungForAnotherPlayerCount: 0,
        dragonPungForFirstPlayerCount: 0,
      };
    }

    for (let epoch = 0; epoch < this.epochs; epoch++) {
      this.currentEpoch = epoch + 1;
      this.setHands();

      if (this.isDragonPungForAnotherPlayer(null)) {
        this.turns[0] = {
          number: 0,
          dragonPungForAnotherPlayerCount:
            (this.turns[0]?.dragonPungForAnotherPlayerCount || 0) + 1,
          dragonPungForFirstPlayerCount: 0,
        };
      }

      for (let turn = 1; turn <= this.turnsToEmulate; turn++) {
        for (let playerNumber = 0; playerNumber < 4; playerNumber++) {
          const discardedTile = this.drawTileForPlayer(playerNumber, turn);

          if (this.isDragonPungForPlayer(discardedTile, 0)) {
            this.turns[turn] = {
              number: turn,
              dragonPungForAnotherPlayerCount:
                this.turns[turn]?.dragonPungForAnotherPlayerCount || 0,
              dragonPungForFirstPlayerCount:
                (this.turns[turn]?.dragonPungForFirstPlayerCount || 0) + 1,
            };
          }

          if (this.isDragonPungForAnotherPlayer(discardedTile)) {
            this.turns[turn] = {
              number: turn,
              dragonPungForAnotherPlayerCount:
                (this.turns[turn]?.dragonPungForAnotherPlayerCount || 0) + 1,
              dragonPungForFirstPlayerCount:
                this.turns[turn]?.dragonPungForFirstPlayerCount || 0,
            };
          }
        }
      }
    }
  }

  // returns discarded tile
  private drawTileForPlayer(playerNumber: number, turn: number): TileInterface {
    const drawnTile = this.drawRandomTile();
    const strategy: Strategy = this.strategies[playerNumber];

    this.hands[playerNumber] = [...this.hands[playerNumber], drawnTile];

    let dragonCount = 0;

    this.hands[playerNumber].forEach((tile: TileInterface | null) => {
      if (this.isEqualTiles(tile, RED_DRAGON_TILE)) {
        dragonCount++;
      }
    });

    if (dragonCount === 1) {
      if (
        strategy === Strategy.DISCARD_ONE ||
        (strategy === Strategy.DISCARD_IN_MIDDLE && turn > 8)
      ) {
        const redDragonTile = this.hands[playerNumber].find(
          (tile: TileInterface) => this.isEqualTiles(tile, RED_DRAGON_TILE)
        )!;

        this.hands[playerNumber] = this.hands[playerNumber].filter(
          (tile: TileInterface) => !this.isEqualTiles(tile, RED_DRAGON_TILE)
        );

        return redDragonTile;
      }
    }

    const nonRedDragonTile = this.hands[playerNumber].find(
      (tile: TileInterface) => !this.isEqualTiles(tile, RED_DRAGON_TILE)
    )!;

    this.hands[playerNumber] = this.hands[playerNumber].filter(
      (tile: TileInterface) => !this.isEqualTiles(tile, nonRedDragonTile)
    );

    return nonRedDragonTile;
  }

  private drawRandomHand(): TileInterface[] {
    const randomHand: TileInterface[] = [];

    for (let index = 0; index < 13; index++) {
      randomHand.push(this.drawRandomTile());
    }

    return randomHand;
  }

  private drawRandomTile(): TileInterface {
    const randomWallTileNumber = Math.floor(
      Math.random() * this.wallTiles.length
    );

    const randomTile: TileInterface = this.wallTiles[randomWallTileNumber];

    this.wallTiles = this.wallTiles.filter(
      (tile: TileInterface) => !this.isStrictEqualTiles(tile, randomTile)
    );

    return randomTile;
  }

  private isEqualTiles(
    firstTile: TileInterface | null,
    secondTile: TileInterface | null
  ): boolean {
    return (
      firstTile?.number === secondTile?.number &&
      firstTile?.type === secondTile?.type
    );
  }

  private isStrictEqualTiles(
    firstTile: TileInterface,
    secondTile: TileInterface
  ): boolean {
    return (
      firstTile.count === secondTile.count &&
      firstTile.number === secondTile.number &&
      firstTile.type === secondTile.type
    );
  }

  private isDragonPungForPlayer(
    drawnTile: TileInterface | null,
    playerNumber: number
  ): boolean {
    let count = 0;

    [...this.hands[playerNumber], drawnTile].forEach(
      (tile: TileInterface | null) => {
        if (this.isEqualTiles(tile, RED_DRAGON_TILE)) {
          count++;
        }
      }
    );

    return count === 3;
  }

  private isDragonPungForAnotherPlayer(
    drawnTile: TileInterface | null
  ): boolean {
    return (
      this.isDragonPungForPlayer(drawnTile, 1) ||
      this.isDragonPungForPlayer(drawnTile, 2) ||
      this.isDragonPungForPlayer(drawnTile, 3)
    );
  }
}
