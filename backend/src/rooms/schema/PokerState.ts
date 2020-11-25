import { Schema, ArraySchema, type } from "@colyseus/schema";
import { PokerPlayer } from "./PlayerState";
import { Streets } from "../PokerConstants";

export class PokerState extends Schema {
  @type([PokerPlayer])
  players = new ArraySchema<PokerPlayer>();

  @type("number")
  playerCount: number = 0;

  @type("number")
  currentPlayer: number = 0;

  @type("number")
  lastPlayer: number = 0;

  @type("number")
  currentDealer: number = 0;

  @type("number")
  bigBlind: number = 50;

  @type("number")
  smallBlind: number = 25;

  @type("number")
  pot: number = 0;

  @type("number")
  currentBet: number = 0;

  @type("number")
  street: Streets = Streets.PREFLOP;

  @type("string")
  card1: string = "EM";

  @type("string")
  card2: string = "EM";

  @type("string")
  card3: string = "EM";

  @type("string")
  card4: string = "EM";

  @type("string")
  card5: string = "EM";

  constructor() {
    super();
    for (let i = 0; i < 9; i++) {
      this.players.push(new PokerPlayer());
    }
  }
}
