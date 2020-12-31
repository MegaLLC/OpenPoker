import { Schema, ArraySchema, type, filter } from "@colyseus/schema";
import { PokerPlayer } from "./PlayerState";
import { Streets } from "../logic/PokerConstants";
import { nosync } from "colyseus";
import { PotState } from "./PotState";

export class PokerState extends Schema {
  @type([PokerPlayer])
  players = new ArraySchema<PokerPlayer>();

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

  @type([PotState])
  pot = new ArraySchema<PotState>();

  @type("number")
  currentBet: number = 0;

  @type("number")
  street: Streets = Streets.PREFLOP;

  @nosync
  card1: string = "EM";

  @nosync
  card2: string = "EM";

  @nosync
  card3: string = "EM";

  @nosync
  card4: string = "EM";

  @nosync
  card5: string = "EM";

  constructor() {
    super();
    for (let i = 0; i < 9; i++) {
      this.players.push(new PokerPlayer());
    }
  }
}
