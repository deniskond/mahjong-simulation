import { Component } from '@angular/core';
import { DRAGONS, SUITS, TILES, TileInterface } from './tiles.const';

interface TurnInterface {
  number: number;
  dragonDoubleForAnotherPlayerCount: number;
  dragonPungForFirstPlayerCount: number;
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
  public readonly epochs = 1000000;
  public currentEpoch = 1;
  public turns: TurnInterface[] = [];

  ngOnInit(): void {
    this.runEpochs();
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
    for (let epoch = 0; epoch < this.epochs; epoch++) {
      this.currentEpoch = epoch + 1;
      this.setHands();

      if (this.isDragonDoubleForAnotherPlayer()) {
        this.turns[0] = {
          number: 0,
          dragonDoubleForAnotherPlayerCount:
            (this.turns[0]?.dragonDoubleForAnotherPlayerCount || 0) + 1,
          dragonPungForFirstPlayerCount: 0,
        };
      }

      for (let turn = 1; turn <= this.turnsToEmulate; turn++) {
        for (let playerNumber = 0; playerNumber < 4; playerNumber++) {
          const discardedTile = this.drawTileForPlayer(playerNumber);

          if (this.isDragonPungForFirstPlayer(discardedTile)) {
            this.turns[turn] = {
              number: turn,
              dragonDoubleForAnotherPlayerCount:
                this.turns[turn]?.dragonDoubleForAnotherPlayerCount || 0,
              dragonPungForFirstPlayerCount:
                (this.turns[turn]?.dragonPungForFirstPlayerCount || 0) + 1,
            };
          }
        }

        if (this.isDragonDoubleForAnotherPlayer()) {
          this.turns[turn] = {
            number: turn,
            dragonDoubleForAnotherPlayerCount:
              (this.turns[turn]?.dragonDoubleForAnotherPlayerCount || 0) + 1,
            dragonPungForFirstPlayerCount:
              this.turns[turn]?.dragonPungForFirstPlayerCount || 0,
          };
        }
      }
    }
  }

  // returns discarded tile
  private drawTileForPlayer(playerNumber: number): TileInterface {
    const playerHand = [...this.hands[playerNumber]];
    const drawnTile = this.drawRandomTile();

    if (this.isEqualTiles(drawnTile, RED_DRAGON_TILE)) {
      const nonRedDragonTile = playerHand.find(
        (tile: TileInterface) => !this.isEqualTiles(tile, RED_DRAGON_TILE)
      )!;

      this.hands[playerNumber] = [
        ...this.hands[playerNumber].filter(
          (tile: TileInterface) =>
            !this.isEqualTiles(drawnTile, nonRedDragonTile)
        ),
        drawnTile,
      ];

      return nonRedDragonTile;
    }

    return drawnTile;
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
    firstTile: TileInterface,
    secondTile: TileInterface
  ): boolean {
    return (
      firstTile.number === secondTile.number &&
      firstTile.type === secondTile.type
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

  private isDragonPungForFirstPlayer(drawnTile: TileInterface): boolean {
    let count = 0;

    [...this.hands[0], drawnTile].forEach((tile: TileInterface) => {
      if (this.isEqualTiles(tile, RED_DRAGON_TILE)) {
        count++;
      }
    });

    return count === 3;
  }

  private isDragonDoubleForAnotherPlayer(): boolean {
    for (let player = 1; player <= 3; player++) {
      let count = 0;

      this.hands[player].forEach((tile: TileInterface) => {
        if (this.isEqualTiles(tile, RED_DRAGON_TILE)) {
          count++;
        }
      });

      if (count == 2) {
        return true;
      }
    }

    return false;
  }
}
