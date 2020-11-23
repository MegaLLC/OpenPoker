import { Schema, ArraySchema, type } from "@colyseus/schema";
import { PokerPlayer } from "./PlayerState";

export class PokerState extends Schema {
  @type([PokerPlayer])
  players = new ArraySchema<PokerPlayer>();

  @type("number")
  currentPlayer: number = 0;

  @type("number")
  currentDealer: number = 0;

  @type("number")
  pot: number = 30;

  @type("number")
  currentBet: number = 0;

  @type("string")
  card1: string = "7H";

  @type("string")
  card2: string = "8H";

  @type("string")
  card3: string = "9H";

  @type("string")
  card4: string = "TH";

  @type("string")
  card5: string = "JH";

  PokerState() {
    for (let i = 0; i < 9; i++) {
      this.players.push(new PokerPlayer());
    }
  }
}
