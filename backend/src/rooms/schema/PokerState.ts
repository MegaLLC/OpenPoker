import { Schema, ArraySchema, type, filter } from "@colyseus/schema";
import { PokerPlayer } from "./PlayerState";
import { Streets } from "../logic/PokerConstants";

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

  @filter((_, __, root: PokerState) => root.street >= Streets.FLOP)
  @type("string")
  card1: string = "EM";

  @filter((_, __, root: PokerState) => root.street >= Streets.FLOP)
  @type("string")
  card2: string = "EM";

  @filter((_, __, root: PokerState) => root.street >= Streets.FLOP)
  @type("string")
  card3: string = "EM";

  @filter((_, __, root: PokerState) => root.street >= Streets.TURN)
  @type("string")
  card4: string = "EM";

  @filter((_, __, root: PokerState) => root.street >= Streets.RIVER)
  @type("string")
  card5: string = "EM";

  constructor() {
    super();
    for (let i = 0; i < 9; i++) {
      this.players.push(new PokerPlayer());
    }
  }
}
